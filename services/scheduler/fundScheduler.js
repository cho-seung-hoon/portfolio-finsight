const cron = require('node-cron');
const { writeToInflux } = require('../influx/influxClient');
const { generateAllFundNavData, generateAllFundAumData } = require('../../data/fundGenerator');

// 1분마다 실행
cron.schedule('* * * * *', async () => {
  try {
    // 펀드 기준가 데이터 생성
    const fundNavData = generateAllFundNavData();

    // 펀드 운용규모 데이터 생성
    const fundAumData = generateAllFundAumData();

    // 각 펀드 기준가 데이터를 InfluxDB에 저장
    for (const navData of fundNavData) {
      await writeToInflux(
        'fund_nav',
        {
          value: navData.fund_nav
        },
        {
          fund_code: navData.fund_code
        },
        navData.timestamp
      );
    }

    // 각 펀드 운용규모 데이터를 InfluxDB에 저장
    for (const aumData of fundAumData) {
      await writeToInflux(
        'fund_aum',
        {
          value: aumData.fund_aum
        },
        {
          fund_code: aumData.fund_code
        },
        aumData.timestamp
      );
    }

    const now = new Date();
    console.log(`[Fund] ${fundNavData.length}개 저장 완료 - ${now.toLocaleString('ko-KR')}`);
  } catch (error) {
    console.error('[Fund Scheduler] 오류:', error);
  }
});
