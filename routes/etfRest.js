const express = require('express');
const { ETF_PRODUCT_ID, generateETFPriceData } = require('../data/etfGenerator');

const router = express.Router();

// ETF 상품 코드 목록 조회
router.get('/etf', (req, res) => {
  res.json({
    symbols: ETF_PRODUCT_ID,
    count: ETF_PRODUCT_ID.length,
    timestamp: new Date().toISOString()
  });
});

// ETF 시세 및 거래량 조회
router.get('/etf/all', (req, res) => {
  const allData = ETF_PRODUCT_ID.map(symbol => {
    const etfData = generateETFPriceData(symbol);
    return {
      product_code: symbol,
      etf_price: etfData.etf_price,
      etf_volume: etfData.etf_volume,
      timestamp: etfData.timestamp
    };
  });

  res.json({
    data: allData,
    count: allData.length,
    timestamp: new Date().toISOString()
  });
});

// ETF 기준가 조회
router.post('/etf/etf_nav', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const etfNavData = ETF_PRODUCT_ID.map(symbol => {
    const etfData = generateETFPriceData(symbol);
    return {
      product_code: symbol,
      etf_nav: etfData.etf_price,
      date: today_date,
      timestamp: new Date().toISOString()
    };
  });

  res.json({
    data: etfNavData,
    count: etfNavData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

// ETF 시세 조회 (1시간 단위 - timestamp 쿼리 파라미터, 해당 시간 기준 1시간치)
router.get('/etf/etf_price/prev', (req, res) => {
  const { timestamp } = req.query;

  if (!timestamp) {
    return res.status(400).json({
      error: 'timestamp 쿼리 파라미터가 필요합니다. (?timestamp=2025-07-31T15:30:00)',
      timestamp: new Date().toISOString()
    });
  }

  const targetDateTime = new Date(timestamp);

  if (isNaN(targetDateTime.getTime())) {
    return res.status(400).json({
      error: '올바른 timestamp 형식이 아닙니다. (YYYY-MM-DDTHH:MM:SS)',
      received_timestamp: timestamp,
      timestamp: new Date().toISOString()
    });
  }

  // 해당 시간 기준 1시간치 데이터 생성 (1분 단위)
  const hourData = [];
  const startTime = new Date(targetDateTime);
  startTime.setMinutes(0, 0, 0); // 해당 시간의 0분으로 설정
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1); // 1시간 후

  // 1분마다 데이터 생성
  for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 1)) {
    ETF_PRODUCT_ID.forEach(symbol => {
      const etfData = generateETFPriceData(symbol);
      hourData.push({
        product_code: symbol,
        etf_price: etfData.etf_price,
        timestamp: new Date(time).toISOString()
      });
    });
  }

  res.json({
    data: hourData,
    count: hourData.length,
    input_timestamp: targetDateTime.toISOString(),
    target_hour:
      targetDateTime.toISOString().split('T')[0] +
      'T' +
      targetDateTime.getHours().toString().padStart(2, '0') +
      ':00:00',
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    interval: '1분',
    duration: '1시간',
    timestamp: new Date().toISOString()
  });
});

// ETF 거래량 조회 (1시간 단위 - timestamp 쿼리 파라미터, 해당 시간 기준 1시간치)
router.get('/etf/etf_volume/prev', (req, res) => {
  const { timestamp } = req.query;

  if (!timestamp) {
    return res.status(400).json({
      error: 'timestamp 쿼리 파라미터가 필요합니다. (?timestamp=2025-07-31T15:30:00)',
      timestamp: new Date().toISOString()
    });
  }

  const targetDateTime = new Date(timestamp);

  if (isNaN(targetDateTime.getTime())) {
    return res.status(400).json({
      error: '올바른 timestamp 형식이 아닙니다. (YYYY-MM-DDTHH:MM:SS)',
      received_timestamp: timestamp,
      timestamp: new Date().toISOString()
    });
  }

  // 해당 시간 기준 1시간치 데이터 생성 (1분 단위)
  const hourData = [];
  const startTime = new Date(targetDateTime);
  startTime.setMinutes(0, 0, 0); // 해당 시간의 0분으로 설정
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1); // 1시간 후

  // 1분마다 데이터 생성
  for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 1)) {
    ETF_PRODUCT_ID.forEach(symbol => {
      const etfData = generateETFPriceData(symbol);
      hourData.push({
        product_code: symbol,
        etf_volume: etfData.etf_volume,
        timestamp: new Date(time).toISOString()
      });
    });
  }

  res.json({
    data: hourData,
    count: hourData.length,
    input_timestamp: targetDateTime.toISOString(),
    target_hour:
      targetDateTime.toISOString().split('T')[0] +
      'T' +
      targetDateTime.getHours().toString().padStart(2, '0') +
      ':00:00',
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    interval: '1분',
    duration: '1시간',
    timestamp: new Date().toISOString()
  });
});

// ETF 기준가 조회 (1일 단위 - date 쿼리 파라미터, 해당 날짜 기준 1년치)
router.get('/etf/etf_nav/prev', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      error: 'date 쿼리 파라미터가 필요합니다. (?date=2025-07-31)',
      timestamp: new Date().toISOString()
    });
  }

  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    return res.status(400).json({
      error: '올바른 date 형식이 아닙니다. (YYYY-MM-DD)',
      received_date: date,
      timestamp: new Date().toISOString()
    });
  }

  // 해당 날짜 기준 1년치 데이터 생성 (1일 단위)
  const yearData = [];
  const startDate = new Date(targetDate.getFullYear(), 0, 1); // 해당 연도 1월 1일
  const endDate = new Date(targetDate.getFullYear(), 11, 31); // 해당 연도 12월 31일

  // 1일마다 데이터 생성
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    ETF_PRODUCT_ID.forEach(symbol => {
      const etfData = generateETFPriceData(symbol);
      yearData.push({
        product_code: symbol,
        etf_nav: etfData.etf_price,
        date: new Date(date).toISOString().split('T')[0],
        timestamp: new Date(date).toISOString()
      });
    });
  }

  res.json({
    data: yearData,
    count: yearData.length,
    input_date: targetDate.toISOString().split('T')[0],
    year: targetDate.getFullYear(),
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    interval: '1일',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
