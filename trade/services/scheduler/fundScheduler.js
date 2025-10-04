// 펀드 데이터 스케줄러
// 펀드 기준가 및 운용규모 데이터를 주기적으로 생성하고 저장합니다

require('dotenv').config();

const cron = require('node-cron');
const { writeToInflux } = require('../influx/influxClient');
const {
  generateAllFundNavData,
  generateAllFundAumData,
  initializeFundDataFromHistory
} = require('../../data/fundGenerator');

// 펀드 데이터 스케줄러
class FundScheduler {
  constructor() {
    this.isInitialized = false;
    this.startTime = null;
  }

  // 스케줄러 초기화 (과거 데이터 기반)
  async initialize(startTime = null) {
    if (this.isInitialized) {
      console.log('[Fund Scheduler] 이미 초기화되었습니다.');
      return;
    }

    this.startTime = startTime || new Date();

    try {
      console.log(`[Fund Scheduler] ${this.startTime.toISOString()} 기준으로 초기화 시작...`);

      // 과거 데이터를 기반으로 초기값 설정
      await initializeFundDataFromHistory(this.startTime);

      this.isInitialized = true;
      console.log('[Fund Scheduler] 초기화 완료');
    } catch (error) {
      console.error('[Fund Scheduler] 초기화 실패:', error);
      this.isInitialized = true; // 기본값으로 계속 진행
    }
  }

  // 펀드 기준가 및 운용규모 스케줄러 (1일마다)
  startScheduler() {
    if (!this.isInitialized) {
      console.error('[Fund Scheduler] 초기화되지 않았습니다. initialize()를 먼저 호출하세요.');
      return;
    }

    console.log('[Fund Scheduler] 기준가 및 운용규모 스케줄러 시작 (1일 간격)');

    cron.schedule('0 0 * * *', async () => {
      try {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); // 오늘 00:00:00
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59); // 오늘 23:59:59
        
        // 오늘 데이터가 이미 있는지 확인 (오늘 00:00:00 ~ 23:59:59)
        const { getLatestFundData } = require('../influx/influxClient');
        const existingData = await getLatestFundData(todayEnd);
        
        // 오늘 생성된 데이터가 있는지 확인
        let hasTodayData = false;
        if (existingData.nav && Object.keys(existingData.nav).length > 0) {
          // 실제로 오늘 데이터인지 추가 확인
          const queryApi = require('../influx/influxClient').client.getQueryApi(require('../influx/influxClient').org);
          const todayCheckQuery = `
            from(bucket: "${require('../influx/influxClient').bucket}")
              |> range(start: ${todayStart.toISOString()}, stop: ${todayEnd.toISOString()})
              |> filter(fn: (r) => r._measurement == "fund_nav")
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
          console.log(`[Fund] ${today.toISOString().split('T')[0]} 데이터가 이미 존재합니다. 건너뜁니다.`);
          return;
        }

        // 펀드 기준가 데이터 생성
        const fundNavData = generateAllFundNavData();

        // 펀드 운용규모 데이터 생성
        const fundAumData = generateAllFundAumData();

        // 각 펀드 기준가 데이터를 InfluxDB에 저장
        for (const navData of fundNavData) {
          await writeToInflux(
            'fund_nav',
            { value: navData.fund_nav },
            { fund_code: navData.fund_code },
            navData.timestamp
          );
        }

        // 각 펀드 운용규모 데이터를 InfluxDB에 저장
        for (const aumData of fundAumData) {
          await writeToInflux(
            'fund_aum',
            { value: aumData.fund_aum },
            { fund_code: aumData.fund_code },
            aumData.timestamp
          );
        }

        const now = new Date();
        console.log(`[Fund] ${fundNavData.length}개 저장 완료 - ${now.toLocaleString('ko-KR')}`);
      } catch (error) {
        console.error('[Fund Scheduler] 오류:', error);
      }
    });
  }

  // 모든 스케줄러 시작
  start(startTime = null) {
    this.initialize(startTime).then(() => {
      this.startScheduler();
      console.log('[Fund Scheduler] 모든 스케줄러가 시작되었습니다.');
    });
  }

  // 스케줄러 중지
  stop() {
    console.log('[Fund Scheduler] 스케줄러 중지');
    // cron 작업은 자동으로 중지됨
  }
}

module.exports = FundScheduler;
