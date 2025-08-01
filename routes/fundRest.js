const express = require('express');
const router = express.Router();
const fundGenerator = require('../data/fundGenerator');
const { getFundHistoricalData } = require('../services/influx/influxClient');

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

const calculateDateRange = targetDate => {
  const endDate = new Date(targetDate);
  const startDate = new Date(targetDate);
  startDate.setMonth(startDate.getMonth() - 3);
  return { startDate, endDate };
};

// 펀드 상품 목록 조회
router.get('/fund', (req, res) => {
  const fundProductIds = fundGenerator.getFundProductIds();

  const fundList = fundProductIds.map(fundCode => ({
    fund_code: fundCode
  }));

  res.json({
    data: fundList,
    count: fundList.length,
    timestamp: new Date().toISOString()
  });
});

// 펀드 운용규모 조회 (특정 날짜)
router.get('/fund/fund_aum', (req, res) => {
  const targetDate = validateDate(req.query.date, res);
  if (!targetDate) return;

  const fundAumData = fundGenerator.generateAllFundAumData().map(fund => ({
    fund_code: fund.fund_code,
    aum: fund.fund_aum,
    date: targetDate.toISOString().split('T')[0],
    timestamp: fund.timestamp
  }));

  res.json({
    data: fundAumData,
    count: fundAumData.length,
    date: targetDate.toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  });
});

// 펀드 기준가 조회 (특정 날짜)
router.get('/fund/fund_nav', (req, res) => {
  const targetDate = validateDate(req.query.date, res);
  if (!targetDate) return;

  const fundNavData = fundGenerator.generateAllFundNavData().map(fund => ({
    fund_code: fund.fund_code,
    nav: fund.fund_nav,
    date: targetDate.toISOString().split('T')[0],
    timestamp: fund.timestamp
  }));

  res.json({
    data: fundNavData,
    count: fundNavData.length,
    date: targetDate.toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  });
});

// 펀드 운용규모 히스토리 조회 (3개월치)
router.get('/fund/fund_aum/prev', async (req, res) => {
  const targetDate = validateDate(req.query.date, res);
  if (!targetDate) return;

  try {
    const { startDate, endDate } = calculateDateRange(targetDate);

    // InfluxDB에서 3개월치 데이터 조회
    const historicalAumData = await getFundHistoricalData('fund_aum', startDate, endDate);

    // 데이터가 없으면 빈 배열 반환
    if (historicalAumData.length === 0) {
      return createEmptyDataResponse(targetDate, startDate, endDate, res);
    }

    // 데이터 포맷팅
    const formattedAumData = historicalAumData.map(item => ({
      fund_code: item.fund_code,
      aum: item.value,
      date: new Date(item.timestamp).toISOString().split('T')[0],
      timestamp: item.timestamp
    }));

    res.json({
      data: formattedAumData,
      count: formattedAumData.length,
      input_date: targetDate.toISOString().split('T')[0],
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      duration: '3개월',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    createErrorResponse(error, '펀드 운용규모 과거 데이터 조회 오류:', res);
  }
});

// 펀드 기준가 히스토리 조회 (3개월치)
router.get('/fund/fund_nav/prev', async (req, res) => {
  const targetDate = validateDate(req.query.date, res);
  if (!targetDate) return;

  try {
    const { startDate, endDate } = calculateDateRange(targetDate);

    // InfluxDB에서 3개월치 데이터 조회
    const historicalNavData = await getFundHistoricalData('fund_nav', startDate, endDate);

    // 데이터가 없으면 빈 배열 반환
    if (historicalNavData.length === 0) {
      return createEmptyDataResponse(targetDate, startDate, endDate, res);
    }

    // 데이터 포맷팅
    const formattedNavData = historicalNavData.map(item => ({
      fund_code: item.fund_code,
      nav: item.value,
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
    createErrorResponse(error, '펀드 기준가 과거 데이터 조회 오류:', res);
  }
});

module.exports = router;
