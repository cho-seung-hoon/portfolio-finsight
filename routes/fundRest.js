const express = require('express');
const router = express.Router();
const fundGenerator = require('../data/fundGenerator');

// 펀드 상품 목록 조회 (GET)
router.get('/fund', (req, res) => {
  const fundProductIds = fundGenerator.getFundProductIds();

  const fundList = fundProductIds.map(fundCode => ({
    fund_code: fundCode,
    fund_name: `${fundCode} 펀드`,
    category: '펀드'
  }));

  res.json({
    data: fundList,
    count: fundList.length,
    timestamp: new Date().toISOString()
  });
});

// 오늘 펀드 운용규모
router.post('/fund/fund_aum', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const fundAumData = fundGenerator.generateAllFundAumData().map(fund => ({
    fund_code: fund.fund_code,
    fund_name: `${fund.fund_code} 펀드`,
    aum: fund.fund_aum,
    date: today_date
  }));

  res.json({
    data: fundAumData,
    count: fundAumData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

// 오늘 펀드 기준가
router.post('/fund/fund_nav', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const fundNavData = fundGenerator.generateAllFundNavData().map(fund => ({
    fund_code: fund.fund_code,
    fund_name: `${fund.fund_code} 펀드`,
    nav: fund.fund_nav,
    date: today_date
  }));

  res.json({
    data: fundNavData,
    count: fundNavData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

// 펀드 운용규모 조회 (1일 단위 - date 쿼리 파라미터, 해당 날짜 기준 1년치)
router.get('/fund/fund_aum/prev', (req, res) => {
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
    const fundAumData = fundGenerator.generateAllFundAumData().map(fund => ({
      fund_code: fund.fund_code,
      fund_name: `${fund.fund_code} 펀드`,
      aum: fund.fund_aum,
      date: new Date(date).toISOString().split('T')[0],
      timestamp: new Date(date).toISOString()
    }));
    yearData.push(...fundAumData);
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

// 펀드 기준가 조회 (1일 단위 - date 쿼리 파라미터, 해당 날짜 기준 1년치)
router.get('/fund/fund_nav/prev', (req, res) => {
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
    const fundNavData = fundGenerator.generateAllFundNavData().map(fund => ({
      fund_code: fund.fund_code,
      fund_name: `${fund.fund_code} 펀드`,
      nav: fund.fund_nav,
      date: new Date(date).toISOString().split('T')[0],
      timestamp: new Date(date).toISOString()
    }));
    yearData.push(...fundNavData);
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
