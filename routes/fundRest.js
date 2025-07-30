const express = require('express');
const router = express.Router();

// 펀드 상품 목록 조회 (GET)
router.get('/fund', (req, res) => {
  const fundList = [
    { fund_code: 'F001', fund_name: '성장형 펀드', category: '성장형' },
    { fund_code: 'F002', fund_name: '안정형 펀드', category: '안정형' },
    { fund_code: 'F003', fund_name: '배당형 펀드', category: '배당형' }
  ];

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

  const fundAumData = [
    { fund_code: 'F001', fund_name: '성장형 펀드', aum: 15000000000, date: today_date },
    { fund_code: 'F002', fund_name: '안정형 펀드', aum: 25000000000, date: today_date },
    { fund_code: 'F003', fund_name: '배당형 펀드', aum: 8000000000, date: today_date }
  ];

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

  const fundNavData = [
    { fund_code: 'F001', fund_name: '성장형 펀드', nav: 12500, date: today_date },
    { fund_code: 'F002', fund_name: '안정형 펀드', nav: 9800, date: today_date },
    { fund_code: 'F003', fund_name: '배당형 펀드', nav: 11200, date: today_date }
  ];

  res.json({
    data: fundNavData,
    count: fundNavData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

// 과거 펀드 운용규모
router.post('/fund/fund_aum/prev', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const prevFundAumData = [
    { fund_code: 'F001', fund_name: '성장형 펀드', aum: 14800000000, date: today_date },
    { fund_code: 'F002', fund_name: '안정형 펀드', aum: 25200000000, date: today_date },
    { fund_code: 'F003', fund_name: '배당형 펀드', aum: 8200000000, date: today_date }
  ];

  res.json({
    data: prevFundAumData,
    count: prevFundAumData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

// 과거 펀드 기준가
router.post('/fund/fund_nav/prev', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const prevFundNavData = [
    { fund_code: 'F001', fund_name: '성장형 펀드', nav: 12400, date: today_date },
    { fund_code: 'F002', fund_name: '안정형 펀드', nav: 9750, date: today_date },
    { fund_code: 'F003', fund_name: '배당형 펀드', nav: 11150, date: today_date }
  ];

  res.json({
    data: prevFundNavData,
    count: prevFundNavData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
