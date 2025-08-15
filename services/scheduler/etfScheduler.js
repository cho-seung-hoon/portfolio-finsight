// ETF 데이터 스케줄러
// ETF 시세, 거래량, 기준가 데이터를 주기적으로 생성하고 저장합니다

require('dotenv').config();

const cron = require('node-cron');
const { writeToInflux } = require('../influx/influxClient');
const {
  generateAllETFPriceData,
  generateAllETFNavData,
  initializeETFDataFromHistory
} = require('../../data/etfGenerator');
const { broadcastETFData } = require('../../websocket/wsServer');

// ETF 데이터 스케줄러
class ETFScheduler {
  constructor() {
    this.isInitialized = false;
    this.startTime = null;
  }

  // 스케줄러 초기화 (과거 데이터 기반)
  async initialize(startTime = null) {
    if (this.isInitialized) {
      console.log('[ETF Scheduler] 이미 초기화되었습니다.');
      return;
    }

    this.startTime = startTime || new Date();

    try {
      console.log(`[ETF Scheduler] ${this.startTime.toISOString()} 기준으로 초기화 시작...`);

      // 과거 데이터를 기반으로 초기값 설정
      await initializeETFDataFromHistory(this.startTime);

      this.isInitialized = true;
      console.log('[ETF Scheduler] 초기화 완료');
    } catch (error) {
      console.error('[ETF Scheduler] 초기화 실패:', error);
      this.isInitialized = true; // 기본값으로 계속 진행
    }
  }

  // ETF 시세 및 거래량 스케줄러 (1초마다)
  startPriceVolumeScheduler() {
    if (!this.isInitialized) {
      console.error('[ETF Scheduler] 초기화되지 않았습니다. initialize()를 먼저 호출하세요.');
      return;
    }

    console.log('[ETF Scheduler] 시세 및 거래량 스케줄러 시작 (1초 간격)');

    cron.schedule('* * * * * *', async () => {
      try {
        const allEtfPriceData = generateAllETFPriceData();
        const changedEtfPriceData = [];

        // InfluxDB에 저장 및 변경된 데이터 필터링
        for (const etfData of allEtfPriceData) {
          // 일정 확률로 데이터 변경하지 않음
          if (Math.random() < 0.5) {
            continue; // 다음 종목으로
          }

          await writeToInflux(
            'etf_price',
            { value: etfData.etf_price },
            { product_code: etfData.product_code },
            etfData.timestamp
          );

          await writeToInflux(
            'etf_volume',
            { value: etfData.etf_volume },
            { product_code: etfData.product_code },
            etfData.timestamp
          );

          changedEtfPriceData.push(etfData);
        }

        // 변경된 데이터만 WebSocket으로 브로드캐스트
        if (changedEtfPriceData.length > 0) {
          const broadcastData = changedEtfPriceData.map(data => ({
            product_code: data.product_code,
            price: data.etf_price,
            volume: data.etf_volume,
            timestamp: data.timestamp
          }));

          broadcastETFData(broadcastData);
        }

        const now = new Date();
        console.log(
          `[ETF] ${changedEtfPriceData.length}개 변경 및 저장 완료 - ${now.toLocaleString('ko-KR')}`
        );
      } catch (error) {
        console.error('[ETF Scheduler] 시세 및 거래량 처리 중 오류:', error);
      }
    });
  }

  // ETF 기준가 스케줄러 (1일마다)
  startNavScheduler() {
    if (!this.isInitialized) {
      console.error('[ETF Scheduler] 초기화되지 않았습니다. initialize()를 먼저 호출하세요.');
      return;
    }

    console.log('[ETF Scheduler] 기준가 스케줄러 시작 (1일 간격)');

    cron.schedule('0 0 * * *', async () => {
      try {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); // 오늘 00:00:00
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59); // 오늘 23:59:59
        
        // 오늘 데이터가 이미 있는지 확인 (오늘 00:00:00 ~ 23:59:59)
        const { getLatestETFData } = require('../influx/influxClient');
        const existingData = await getLatestETFData(todayEnd);
        
        // 오늘 생성된 데이터가 있는지 확인
        let hasTodayData = false;
        if (existingData.nav && Object.keys(existingData.nav).length > 0) {
          // 실제로 오늘 데이터인지 추가 확인
          const queryApi = require('../influx/influxClient').client.getQueryApi(require('../influx/influxClient').org);
          const todayCheckQuery = `
            from(bucket: "${require('../influx/influxClient').bucket}")
              |> range(start: ${todayStart.toISOString()}, stop: ${todayEnd.toISOString()})
              |> filter(fn: (r) => r._measurement == "etf_nav")
              |> count()
          `;
          
          for await (const { values, tableMeta } of queryApi.iterateRows(todayCheckQuery)) {
            const o = tableMeta.toObject(values);
            if (o._value > 0) {
              hasTodayData = true;
              break;
            }
          }
        }
        
        if (hasTodayData) {
          console.log(`[ETF NAV] ${today.toISOString().split('T')[0]} 데이터가 이미 존재합니다. 건너뜁니다.`);
          return;
        }

        const etfNavData = generateAllETFNavData();

        // InfluxDB에 저장
        for (const navData of etfNavData) {
          await writeToInflux(
            'etf_nav',
            { value: navData.etf_nav },
            { product_code: navData.product_code },
            navData.timestamp
          );
        }

        const now = new Date();
        console.log(`[ETF NAV] ${etfNavData.length}개 저장 완료 - ${now.toLocaleString('ko-KR')}`);
      } catch (error) {
        console.error('[ETF NAV Scheduler] 오류:', error);
      }
    });
  }

  // 모든 스케줄러 시작
  start(startTime = null) {
    this.initialize(startTime).then(() => {
      this.startPriceVolumeScheduler();
      this.startNavScheduler();
      console.log('[ETF Scheduler] 모든 스케줄러가 시작되었습니다.');
    });
  }

  // 스케줄러 중지
  stop() {
    console.log('[ETF Scheduler] 스케줄러 중지');
    // cron 작업은 자동으로 중지됨
  }
}

module.exports = ETFScheduler;
