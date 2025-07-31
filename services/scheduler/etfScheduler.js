const cron = require('node-cron');
const { writeToInflux } = require('../influx/influxClient');
const { broadcastETFData } = require('../../websocket/wsServer');
const { generateAllETFPriceData, generateAllETFNavData } = require('../../data/etfGenerator');

// ETF 시세 및 거래량 스케줄러 (1초마다)
cron.schedule('* * * * * *', async () => {
  try {
    // ETF 시세 및 거래량 데이터 생성
    const etfPriceData = generateAllETFPriceData();

    // 각 ETF 데이터를 InfluxDB에 저장
    for (const etfData of etfPriceData) {
      await writeToInflux(
        'etf_price',
        {
          value: etfData.etf_price
        },
        {
          product_code: etfData.product_code
        },
        etfData.timestamp
      );

      await writeToInflux(
        'etf_volume',
        {
          value: etfData.etf_volume
        },
        {
          product_code: etfData.product_code
        },
        etfData.timestamp
      );
    }

    // WebSocket으로 ETF 시세와 거래량 데이터 전송 (실시간 모니터링용)
    if (etfPriceData.length > 0) {
      // 시세와 거래량만 포함한 데이터 생성
      const etfData = etfPriceData.map(etfData => ({
        product_code: etfData.product_code,
        price: etfData.etf_price,
        volume: etfData.etf_volume,
        timestamp: etfData.timestamp
      }));

      broadcastETFData(etfData);
    }

    const now = new Date();
    console.log(`[ETF] ${etfPriceData.length}개 저장 완료 - ${now.toLocaleString('ko-KR')}`);
  } catch (error) {
    console.error('[ETF Scheduler] 오류:', error);
  }
});

// ETF 기준가 스케줄러 (1분마다)
cron.schedule('* * * * *', async () => {
  try {
    // ETF 기준가 데이터 생성
    const etfNavData = generateAllETFNavData();

    // 각 ETF 기준가 데이터를 InfluxDB에 저장
    for (const navData of etfNavData) {
      await writeToInflux(
        'etf_nav',
        {
          value: navData.etf_nav
        },
        {
          product_code: navData.product_code
        },
        navData.timestamp
      );
    }

    const now = new Date();
    console.log(`[ETF NAV] ${etfNavData.length}개 저장 완료 - ${now.toLocaleString('ko-KR')}`);
  } catch (error) {
    console.error('[ETF NAV Scheduler] 오류:', error);
  }
});
