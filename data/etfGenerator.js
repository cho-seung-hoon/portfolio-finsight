// ETF 생성기

// ETF 상품 코드 목록 가져오기
const productCodes = require('./productCodes.json');
// ETF 상품 코드 목록
const ETF_PRODUCT_ID = productCodes.ETF_PRODUCT_CODES;

// 각 ETF의 기본 시세, 거래량, 기준가 정보 (초기값)
const etfBasePrices = {};
const etfBaseVolumes = {};
const etfBaseNavs = {}; // ETF 기준가 추가

// ETF 기본 시세, 거래량, 기준가 초기화
function initializeETFData() {
  ETF_PRODUCT_ID.forEach(symbol => {
    // ETF 시세 범위: 1,000원에서 50,000원 사이의 랜덤 초기 시세
    etfBasePrices[symbol] = Math.random() * 49000 + 1000;

    // ETF 거래량 범위: 1000주 ~ 100000주
    etfBaseVolumes[symbol] = Math.floor(Math.random() * 99000 + 1000);

    // ETF 기준가 범위: 8,000원에서 15,000원 사이의 랜덤 초기 기준가
    etfBaseNavs[symbol] = Math.random() * 7000 + 8000;
  });
}

// 랜덤 시세 변동 생성
function generatePriceChange(currentPrice) {
  const maxChangePercent = 0.05;
  const changePercent = (Math.random() - 0.5) * 2 * maxChangePercent;
  const priceChange = currentPrice * changePercent;
  return Math.max(currentPrice + priceChange, currentPrice * 0.95);
}

// 랜덤 거래량 변동 생성
function generateVolumeChange(currentVolume) {
  // 거래량 변동률을 -20%에서 +30% 사이로 제한
  const maxChangePercent = 0.25;
  const changePercent = (Math.random() - 0.4) * 2 * maxChangePercent;
  const volumeChange = currentVolume * changePercent;

  // 새로운 거래량이 최소 100주 이상이 되도록 보장
  return Math.max(currentVolume + volumeChange, 100);
}

// 랜덤 기준가 변동 생성 (ETF용)
function generateNavChange(currentNav) {
  const maxChangePercent = 0.03; // 기준가는 시세보다 변동폭이 작음
  const changePercent = (Math.random() - 0.5) * 2 * maxChangePercent;
  const navChange = currentNav * changePercent;
  return Math.max(currentNav + navChange, currentNav * 0.97);
}

// 단일 ETF 시세 및 거래량 데이터 생성
function generateETFPriceData(symbol) {
  const currentPrice = etfBasePrices[symbol];
  const currentVolume = etfBaseVolumes[symbol];

  const newPrice = generatePriceChange(currentPrice);
  const newVolume = generateVolumeChange(currentVolume);

  // 현재 시세와 거래량을 다음 계산을 위해 업데이트
  etfBasePrices[symbol] = newPrice;
  etfBaseVolumes[symbol] = newVolume;

  return {
    product_code: symbol,
    etf_price: parseFloat(newPrice.toFixed(0)),
    etf_volume: Math.floor(newVolume),
    timestamp: new Date().toISOString()
  };
}

// 단일 ETF 기준가 데이터 생성
function generateETFNavData(symbol) {
  const currentNav = etfBaseNavs[symbol];

  const newNav = generateNavChange(currentNav);

  // 현재 기준가를 다음 계산을 위해 업데이트
  etfBaseNavs[symbol] = newNav;

  return {
    product_code: symbol,
    etf_nav: parseFloat(newNav.toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

// 모든 ETF 시세 및 거래량 데이터 생성
function generateAllETFPriceData() {
  return ETF_PRODUCT_ID.map(symbol => generateETFPriceData(symbol));
}

// 모든 ETF 기준가 데이터 생성
function generateAllETFNavData() {
  return ETF_PRODUCT_ID.map(symbol => generateETFNavData(symbol));
}

// 초기화
initializeETFData();

// 현재 시세, 거래량, 기준가 조회 함수
function getCurrentPrices() {
  return { ...etfBasePrices };
}

function getCurrentVolumes() {
  return { ...etfBaseVolumes };
}

function getCurrentNavs() {
  return { ...etfBaseNavs };
}

// ETF 상품 코드 목록 조회
function getETFProductIds() {
  return ETF_PRODUCT_ID;
}

// 특정 ETF 시세 및 거래량 조회
function getETFPriceByProductCode(productCode) {
  const symbolUpper = productCode.toUpperCase();

  if (!ETF_PRODUCT_ID.includes(symbolUpper)) {
    throw new Error('ETF를 찾을 수 없습니다.');
  }

  const etfData = generateETFPriceData(symbolUpper);

  return {
    product_code: symbolUpper,
    etf_price: etfData.etf_price,
    etf_volume: etfData.etf_volume,
    timestamp: etfData.timestamp
  };
}

// 특정 ETF 기준가 조회
function getETFNavByProductCode(productCode) {
  const symbolUpper = productCode.toUpperCase();

  if (!ETF_PRODUCT_ID.includes(symbolUpper)) {
    throw new Error('ETF를 찾을 수 없습니다.');
  }

  const etfNavData = generateETFNavData(symbolUpper);

  return {
    product_code: symbolUpper,
    etf_nav: etfNavData.etf_nav,
    timestamp: etfNavData.timestamp
  };
}

module.exports = {
  ETF_PRODUCT_ID,
  generateETFPriceData,
  generateETFNavData,
  generateAllETFPriceData,
  generateAllETFNavData,
  getCurrentPrices,
  getCurrentVolumes,
  getCurrentNavs,
  getETFProductIds,
  getETFPriceByProductCode,
  getETFNavByProductCode
};
