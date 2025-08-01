// .env 파일 로드
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
        const etfPriceData = generateAllETFPriceData();

        // InfluxDB에 저장
        for (const etfData of etfPriceData) {
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
        }

        // WebSocket으로 브로드캐스트
        const broadcastData = etfPriceData.map(data => ({
          product_code: data.product_code,
          price: data.etf_price,
          volume: data.etf_volume,
          timestamp: data.timestamp
        }));

        broadcastETFData(broadcastData);

        const now = new Date();
        console.log(`[ETF] ${etfPriceData.length}개 저장 완료 - ${now.toLocaleString('ko-KR')}`);
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
    // cron 작업은 자동으로 중지되므로 별도 처리 불필요
  }
}

module.exports = ETFScheduler;
