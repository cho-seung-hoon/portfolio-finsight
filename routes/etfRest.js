const express = require('express');
const {
  ETF_PRODUCT_ID,
  generateETFData,
  getETFPriceByProductCode
} = require('../data/dataGenerator');

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
    const etfData = generateETFData(symbol);
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

// // 특정 ETF 시세 및 거래량 조회
// router.get('/etf/:productCode', (req, res) => {
//   try {
//     const { productCode } = req.params;
//     const etfData = getETFPriceByProductCode(productCode);

//     res.json({
//       product_code: etfData.product_code,
//       etf_price: etfData.etf_price,
//       etf_volume: etfData.etf_volume,
//       timestamp: etfData.timestamp
//     });
//   } catch (error) {
//     if (error.message === 'ETF를 찾을 수 없습니다.') {
//       return res.status(404).json({
//         error: error.message,
//         product_code: req.params.productCode.toUpperCase(),
//         availableSymbols: ETF_PRODUCT_ID.slice(0, 10)
//       });
//     }

//     res.status(500).json({
//       error: 'ETF 시세 및 거래량 조회 중 오류가 발생했습니다.',
//       message: error.message
//     });
//   }
// });

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
    const etfData = generateETFData(symbol);
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

// 과거 ETF 시세 조회
router.post('/etf/etf_price/prev', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const prevEtfPriceData = ETF_PRODUCT_ID.map(symbol => {
    const etfData = generateETFData(symbol);
    return {
      product_code: symbol,
      etf_price: etfData.etf_price,
      date: today_date,
      timestamp: new Date().toISOString()
    };
  });

  res.json({
    data: prevEtfPriceData,
    count: prevEtfPriceData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

// 과거 ETF 거래량 조회
router.post('/etf/etf_volume/prev', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const prevEtfVolumeData = ETF_PRODUCT_ID.map(symbol => {
    const etfData = generateETFData(symbol);
    return {
      product_code: symbol,
      etf_volume: etfData.etf_volume,
      date: today_date,
      timestamp: new Date().toISOString()
    };
  });

  res.json({
    data: prevEtfVolumeData,
    count: prevEtfVolumeData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

// 과거 ETF 기준가 조회
router.post('/etf/etf_nav/prev', (req, res) => {
  const { today_date } = req.body;

  if (!today_date) {
    return res.status(400).json({
      error: 'today_date가 필요합니다.',
      timestamp: new Date().toISOString()
    });
  }

  const prevEtfNavData = ETF_PRODUCT_ID.map(symbol => {
    const etfData = generateETFData(symbol);
    return {
      product_code: symbol,
      etf_nav: etfData.etf_price,
      date: today_date,
      timestamp: new Date().toISOString()
    };
  });

  res.json({
    data: prevEtfNavData,
    count: prevEtfNavData.length,
    date: today_date,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
