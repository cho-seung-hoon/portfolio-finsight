const express = require('express');
const {
  ETF_PRODUCT_ID,
  generateETFPriceData,
  generateETFNavData
} = require('../data/etfGenerator');
const { getETFHistoricalData } = require('../services/influx/influxClient');

const router = express.Router();

// 공통 유틸리티 함수들
const validateDate = (dateString, res) => {
  if (!dateString) {
    res.status(400).json({
      error: 'date 쿼리 파라미터가 필요합니다. (?date=2025-07-31)',
      timestamp: new Date().toISOString()
    });
    return null;
  }

  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    res.status(400).json({
      error: '올바른 date 형식이 아닙니다. (YYYY-MM-DD)',
      received_date: dateString,
      timestamp: new Date().toISOString()
    });
    return null;
  }

  return parsedDate;
};

const validateTimestamp = (timestampString, res) => {
  if (!timestampString) {
    res.status(400).json({
      error: 'timestamp 쿼리 파라미터가 필요합니다. (?timestamp=2025-07-31T15:30:00)',
      timestamp: new Date().toISOString()
    });
    return null;
  }

  const parsedTimestamp = new Date(timestampString);
  if (isNaN(parsedTimestamp.getTime())) {
    res.status(400).json({
      error: '올바른 timestamp 형식이 아닙니다. (YYYY-MM-DDTHH:MM:SS)',
      received_timestamp: timestampString,
      timestamp: new Date().toISOString()
    });
    return null;
  }

  return parsedTimestamp;
};

const createErrorResponse = (error, message, res) => {
  console.error(message, error);
  res.status(500).json({
    error: '데이터 조회 중 오류가 발생했습니다.',
    message: error.message,
    timestamp: new Date().toISOString()
  });
};

const createEmptyDataResponse = (inputDate, startDate, endDate, res) => {
  return res.json({
    data: [],
    count: 0,
    input_date: inputDate.toISOString().split('T')[0],
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    duration: '3개월',
    message: '해당 기간의 데이터가 없습니다.',
    timestamp: new Date().toISOString()
  });
};

// ETF 상품 코드 목록 조회
router.get('/etf', (req, res) => {
  res.json({
    symbols: ETF_PRODUCT_ID,
    count: ETF_PRODUCT_ID.length,
    timestamp: new Date().toISOString()
  });
});

// ETF 시세 및 거래량 조회 (현재 데이터)
router.get('/etf/all', (req, res) => {
  const currentETFData = ETF_PRODUCT_ID.map(symbol => {
    const etfData = generateETFPriceData(symbol);
    return {
      product_code: symbol,
      etf_price: etfData.etf_price,
      etf_volume: etfData.etf_volume,
      timestamp: etfData.timestamp
    };
  });

  res.json({
    data: currentETFData,
    count: currentETFData.length,
    timestamp: new Date().toISOString()
  });
});

// ETF 기준가 조회 (특정 날짜)
router.get('/etf/etf_nav', (req, res) => {
  const targetDate = validateDate(req.query.date, res);
  if (!targetDate) return;

  const etfNavData = ETF_PRODUCT_ID.map(symbol => {
    const navData = generateETFNavData(symbol);
    return {
      product_code: symbol,
      etf_nav: navData.etf_nav,
      date: targetDate.toISOString().split('T')[0],
      timestamp: navData.timestamp
    };
  });

  res.json({
    data: etfNavData,
    count: etfNavData.length,
    date: targetDate.toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  });
});

// ETF 시세 히스토리 조회 (1시간 단위)
router.get('/etf/etf_price/prev', (req, res) => {
  const targetDateTime = validateTimestamp(req.query.timestamp, res);
  if (!targetDateTime) return;

  // 해당 시간 기준 1시간치 데이터 생성 (1분 단위)
  const hourlyPriceData = [];
  const startTime = new Date(targetDateTime);
  startTime.setMinutes(0, 0, 0); // 해당 시간의 0분으로 설정
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1); // 1시간 후

  // 1분마다 데이터 생성
  for (
    let currentTime = new Date(startTime);
    currentTime < endTime;
    currentTime.setMinutes(currentTime.getMinutes() + 1)
  ) {
    ETF_PRODUCT_ID.forEach(symbol => {
      const etfData = generateETFPriceData(symbol);
      hourlyPriceData.push({
        product_code: symbol,
        etf_price: etfData.etf_price,
        timestamp: new Date(currentTime).toISOString()
      });
    });
  }

  res.json({
    data: hourlyPriceData,
    count: hourlyPriceData.length,
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

// ETF 거래량 히스토리 조회 (3개월치)
router.get('/etf/etf_volume/prev', async (req, res) => {
  const targetDateTime = validateTimestamp(req.query.timestamp, res);
  if (!targetDateTime) return;

  try {
    // 3개월 전 날짜 계산
    const endDate = new Date(targetDateTime);
    const startDate = new Date(targetDateTime);
    startDate.setMonth(startDate.getMonth() - 3);

    // InfluxDB에서 3개월치 데이터 조회
    const historicalVolumeData = await getETFHistoricalData('etf_volume', startDate, endDate);

    // 데이터가 없으면 빈 배열 반환
    if (historicalVolumeData.length === 0) {
      return createEmptyDataResponse(targetDateTime, startDate, endDate, res);
    }

    // 데이터 포맷팅
    const formattedVolumeData = historicalVolumeData.map(item => ({
      product_code: item.product_code,
      etf_volume: parseInt(item.value),
      timestamp: item.timestamp
    }));

    res.json({
      data: formattedVolumeData,
      count: formattedVolumeData.length,
      input_timestamp: targetDateTime.toISOString(),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      duration: '3개월',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    createErrorResponse(error, 'ETF 거래량 과거 데이터 조회 오류:', res);
  }
});

// ETF 기준가 히스토리 조회 (3개월치)
router.get('/etf/etf_nav/prev', async (req, res) => {
  const targetDate = validateDate(req.query.date, res);
  if (!targetDate) return;

  try {
    // 3개월 전 날짜 계산
    const endDate = new Date(targetDate);
    const startDate = new Date(targetDate);
    startDate.setMonth(startDate.getMonth() - 3);

    // InfluxDB에서 3개월치 데이터 조회
    const historicalNavData = await getETFHistoricalData('etf_nav', startDate, endDate);

    // 데이터가 없으면 빈 배열 반환
    if (historicalNavData.length === 0) {
      return createEmptyDataResponse(targetDate, startDate, endDate, res);
    }

    // 데이터 포맷팅
    const formattedNavData = historicalNavData.map(item => ({
      product_code: item.product_code,
      etf_nav: item.value,
      date: new Date(item.timestamp).toISOString().split('T')[0],
      timestamp: item.timestamp
    }));

    res.json({
      data: formattedNavData,
      count: formattedNavData.length,
      input_date: targetDate.toISOString().split('T')[0],
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      duration: '3개월',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    createErrorResponse(error, 'ETF 기준가 과거 데이터 조회 오류:', res);
  }
});

module.exports = router;
