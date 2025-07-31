// 펀드 생성기

// 펀드 상품 코드 목록 가져오기
const productCodes = require('./productCodes.json');
// 펀드 상품 코드 목록
const FUND_PRODUCT_ID = productCodes.FUND_PRODUCT_CODES;

// 각 펀드의 기본 기준가 및 운용규모 정보 (초기값)
const fundBaseNavs = {};
const fundBaseAums = {};

// 펀드 기본 기준가 및 운용규모 초기화
function initializeFundData() {
  FUND_PRODUCT_ID.forEach(symbol => {
    // 펀드 기준가 범위: 8,000원에서 15,000원 사이의 랜덤 초기 기준가
    fundBaseNavs[symbol] = Math.random() * 7000 + 8000;

    // 펀드 운용규모 범위: 10억원 ~ 1000억원
    fundBaseAums[symbol] = Math.floor(Math.random() * 99000000000 + 1000000000);
  });
}

// 랜덤 기준가 변동 생성 (펀드용)
function generateNavChange(currentNav) {
  const maxChangePercent = 0.02; // 펀드 기준가는 변동폭이 작음
  const changePercent = (Math.random() - 0.5) * 2 * maxChangePercent;
  const navChange = currentNav * changePercent;
  return Math.max(currentNav + navChange, currentNav * 0.98);
}

// 랜덤 운용규모 변동 생성
function generateAumChange(currentAum) {
  // 운용규모 변동률을 -10%에서 +15% 사이로 제한
  const maxChangePercent = 0.125;
  const changePercent = (Math.random() - 0.4) * 2 * maxChangePercent;
  const aumChange = currentAum * changePercent;

  // 새로운 운용규모가 최소 1억원 이상이 되도록 보장
  return Math.max(currentAum + aumChange, 100000000);
}

// 단일 펀드 기준가 데이터 생성
function generateFundNavData(symbol) {
  const currentNav = fundBaseNavs[symbol];

  const newNav = generateNavChange(currentNav);

  // 현재 기준가를 다음 계산을 위해 업데이트
  fundBaseNavs[symbol] = newNav;

  return {
    fund_code: symbol,
    fund_nav: parseFloat(newNav.toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

// 단일 펀드 운용규모 데이터 생성
function generateFundAumData(symbol) {
  const currentAum = fundBaseAums[symbol];

  const newAum = generateAumChange(currentAum);

  // 현재 운용규모를 다음 계산을 위해 업데이트
  fundBaseAums[symbol] = newAum;

  return {
    fund_code: symbol,
    fund_aum: Math.floor(newAum),
    timestamp: new Date().toISOString()
  };
}

// 모든 펀드 기준가 데이터 생성
function generateAllFundNavData() {
  return FUND_PRODUCT_ID.map(symbol => generateFundNavData(symbol));
}

// 모든 펀드 운용규모 데이터 생성
function generateAllFundAumData() {
  return FUND_PRODUCT_ID.map(symbol => generateFundAumData(symbol));
}

// 초기화
initializeFundData();

// 현재 기준가 및 운용규모 조회 함수
function getCurrentNavs() {
  return { ...fundBaseNavs };
}

function getCurrentAums() {
  return { ...fundBaseAums };
}

// 펀드 상품 코드 목록 조회
function getFundProductIds() {
  return FUND_PRODUCT_ID;
}

// 특정 펀드 기준가 조회
function getFundNavByProductCode(productCode) {
  const symbolUpper = productCode.toUpperCase();

  if (!FUND_PRODUCT_ID.includes(symbolUpper)) {
    throw new Error('펀드를 찾을 수 없습니다.');
  }

  const fundNavData = generateFundNavData(symbolUpper);

  return {
    fund_code: symbolUpper,
    fund_nav: fundNavData.fund_nav,
    timestamp: fundNavData.timestamp
  };
}

// 특정 펀드 운용규모 조회
function getFundAumByProductCode(productCode) {
  const symbolUpper = productCode.toUpperCase();

  if (!FUND_PRODUCT_ID.includes(symbolUpper)) {
    throw new Error('펀드를 찾을 수 없습니다.');
  }

  const fundAumData = generateFundAumData(symbolUpper);

  return {
    fund_code: symbolUpper,
    fund_aum: fundAumData.fund_aum,
    timestamp: fundAumData.timestamp
  };
}

module.exports = {
  FUND_PRODUCT_ID,
  generateFundNavData,
  generateFundAumData,
  generateAllFundNavData,
  generateAllFundAumData,
  getCurrentNavs,
  getCurrentAums,
  getFundProductIds,
  getFundNavByProductCode,
  getFundAumByProductCode
};
