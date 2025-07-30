const fs = require('fs');
const path = require('path');

// 국내 ETF 상품 코드 목록 (ETF 테이블의 product_code에 해당)
const ETF_PRODUCT_ID = [
  // ... 기존 ETF 코드들 ...
];

// 각 ETF의 기본 시세 및 거래량 정보 (초기값)
const etfBasePrices = {};
const etfBaseVolumes = {}; // 거래량도 저장

// ETF 기본 시세 및 거래량 초기화
function initializeETFData() {
  ETF_PRODUCT_ID.forEach(symbol => {
    // 국내 ETF 시세 범위: 1,000원에서 50,000원 사이의 랜덤 초기 시세
    etfBasePrices[symbol] = Math.random() * 49000 + 1000;

    // 국내 ETF 거래량 범위: 1000주 ~ 100000주
    etfBaseVolumes[symbol] = Math.floor(Math.random() * 99000 + 1000);
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

// 단일 ETF 데이터 생성 (ETF 테이블 구조에 맞춤)
function generateETFData(symbol) {
  const currentPrice = etfBasePrices[symbol];
  const currentVolume = etfBaseVolumes[symbol];

  const newPrice = generatePriceChange(currentPrice);
  const newVolume = generateVolumeChange(currentVolume);

  // 현재 시세와 거래량을 다음 계산을 위해 업데이트
  etfBasePrices[symbol] = newPrice;
  etfBaseVolumes[symbol] = newVolume;

  return {
    product_code: symbol, // ETF 테이블의 product_code
    etf_price: parseFloat(newPrice.toFixed(0)), // ETF 테이블의 etf_price (시세)
    etf_volume: Math.floor(newVolume), // ETF 테이블의 etf_volume (거래량)
    timestamp: new Date().toISOString()
  };
}

// 모든 ETF 데이터 생성
function generateAllETFData() {
  return ETF_PRODUCT_ID.map(symbol => generateETFData(symbol));
}

// 초기화
initializeETFData();

// 현재 시세 및 거래량 조회 함수
function getCurrentPrices() {
  return { ...etfBasePrices };
}

function getCurrentVolumes() {
  return { ...etfBaseVolumes };
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

  const etfData = generateETFData(symbolUpper);

  return {
    product_code: symbolUpper,
    etf_price: etfData.etf_price,
    etf_volume: etfData.etf_volume,
    timestamp: etfData.timestamp
  };
}

module.exports = {
  ETF_PRODUCT_ID,
  generateETFData,
  generateAllETFData,
  getCurrentPrices,
  getCurrentVolumes,
  getETFProductIds,
  getETFPriceByProductCode
};
