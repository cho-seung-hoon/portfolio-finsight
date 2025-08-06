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
    const initialNav = Math.random() * 7000 + 8000;
    fundBaseNavs[symbol] = Math.max(initialNav, 100); // 최소 100원 보장

    // 펀드 운용규모 범위: 10억원 ~ 1000억원
    const initialAum = Math.floor(Math.random() * 99000000000 + 1000000000);
    fundBaseAums[symbol] = Math.max(initialAum, 100000000); // 최소 1억원 보장
  });
}

// 과거 데이터를 기반으로 펀드 데이터 초기화
async function initializeFundDataFromHistory(startTime) {
  const { getLatestFundData } = require('../services/influx/influxClient');

  try {
    console.log(`[Fund] ${startTime.toISOString()} 기준 과거 데이터 조회 중...`);
    const latestData = await getLatestFundData(startTime);

    FUND_PRODUCT_ID.forEach(symbol => {
      // 과거 데이터가 있으면 사용, 없으면 기본값 생성
      if (latestData.nav[symbol]) {
        fundBaseNavs[symbol] = latestData.nav[symbol];
        console.log(`[Fund] ${symbol} 기준가 초기값 설정: ${latestData.nav[symbol]}`);
      } else {
        fundBaseNavs[symbol] = Math.random() * 7000 + 8000;
        console.log(`[Fund] ${symbol} 기준가 기본값 생성: ${fundBaseNavs[symbol]}`);
      }

      if (latestData.aum[symbol]) {
        fundBaseAums[symbol] = latestData.aum[symbol];
        console.log(`[Fund] ${symbol} 운용규모 초기값 설정: ${latestData.aum[symbol]}`);
      } else {
        fundBaseAums[symbol] = Math.floor(Math.random() * 99000000000 + 1000000000);
        console.log(`[Fund] ${symbol} 운용규모 기본값 생성: ${fundBaseAums[symbol]}`);
      }
    });

    console.log(`[Fund] 초기값 설정 완료 - ${FUND_PRODUCT_ID.length}개 상품`);
  } catch (error) {
    console.error('[Fund] 과거 데이터 조회 실패, 기본값으로 초기화:', error);
    initializeFundData();
  }
}

// 랜덤 기준가 변동 생성 (펀드용)
function generateNavChange(currentNav) {
  // 안전장치: 현재 기준가가 유효하지 않으면 기본값 사용
  if (!currentNav || isNaN(currentNav) || !isFinite(currentNav) || currentNav <= 0) {
    return Math.random() * 7000 + 8000;
  }

  // 펀드 기준가 최대값 제한 (실제 펀드 기준가에 적합한 범위)
  const MAX_FUND_NAV = 100000; // 10만원
  if (currentNav >= MAX_FUND_NAV) {
    return MAX_FUND_NAV * 0.9; // 최대값의 90%로 조정
  }

  const maxChangePercent = 0.02; // 펀드 기준가는 변동폭이 작음
  const changePercent = (Math.random() - 0.5) * 2 * maxChangePercent;
  const navChange = currentNav * changePercent;

  // 최소값 보장 (0이 되지 않도록)
  const minNav = Math.max(currentNav * 0.98, 100); // 최소 100원
  const newNav = Math.max(currentNav + navChange, minNav);

  // 최대값 제한
  const finalNav = Math.min(newNav, MAX_FUND_NAV * 0.9);

  // 결과값 검증
  if (isNaN(finalNav) || !isFinite(finalNav) || finalNav <= 0) {
    return Math.max(currentNav, 100);
  }

  return finalNav;
}

// 랜덤 운용규모 변동 생성
function generateAumChange(currentAum) {
  // 안전장치: 현재 운용규모가 유효하지 않으면 기본값 사용
  if (!currentAum || isNaN(currentAum) || !isFinite(currentAum) || currentAum <= 0) {
    return Math.floor(Math.random() * 99000000000 + 1000000000);
  }

  // 펀드 운용규모 최대값 제한 (실제 펀드 운용규모에 적합한 범위)
  const MAX_FUND_AUM = 10000000000000; // 10조원
  if (currentAum >= MAX_FUND_AUM) {
    return Math.floor(MAX_FUND_AUM * 0.9); // 최대값의 90%로 조정
  }

  // 운용규모 변동률을 -10%에서 +15% 사이로 제한
  const maxChangePercent = 0.125;
  const changePercent = (Math.random() - 0.4) * 2 * maxChangePercent;
  const aumChange = currentAum * changePercent;

  // 최소값 보장 (0이 되지 않도록)
  const minAum = Math.max(currentAum * 0.9, 100000000); // 최소 1억원
  const newAum = Math.max(currentAum + aumChange, minAum);

  // 최대값 제한
  const finalAum = Math.min(newAum, MAX_FUND_AUM * 0.9);

  // 결과값 검증
  if (isNaN(finalAum) || !isFinite(finalAum) || finalAum <= 0) {
    return Math.max(currentAum, 100000000);
  }

  return Math.floor(finalAum);
}

// 단일 펀드 기준가 데이터 생성
function generateFundNavData(symbol) {
  // 기본값이 없으면 초기화
  if (!fundBaseNavs[symbol] || isNaN(fundBaseNavs[symbol]) || fundBaseNavs[symbol] <= 0) {
    fundBaseNavs[symbol] = Math.random() * 7000 + 8000;
  }

  const currentNav = fundBaseNavs[symbol];

  const newNav = generateNavChange(currentNav);

  // 최종 검증 및 안전장치
  const finalNav = Math.max(newNav, 100); // 최소 100원 보장

  // 현재 기준가를 다음 계산을 위해 업데이트
  fundBaseNavs[symbol] = finalNav;

  return {
    fund_code: symbol,
    fund_nav: parseFloat(finalNav.toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

// 단일 펀드 운용규모 데이터 생성
function generateFundAumData(symbol) {
  // 기본값이 없으면 초기화
  if (!fundBaseAums[symbol] || isNaN(fundBaseAums[symbol]) || fundBaseAums[symbol] <= 0) {
    fundBaseAums[symbol] = Math.floor(Math.random() * 99000000000 + 1000000000);
  }

  const currentAum = fundBaseAums[symbol];

  const newAum = generateAumChange(currentAum);

  // 최종 검증 및 안전장치
  const finalAum = Math.max(Math.floor(newAum), 100000000); // 최소 1억원 보장

  // 현재 운용규모를 다음 계산을 위해 업데이트
  fundBaseAums[symbol] = finalAum;

  return {
    fund_code: symbol,
    fund_aum: parseFloat(finalAum.toFixed(2)),
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

// 초기화 (기본값) - 모듈 로드 시점에 호출하지 않음
// initializeFundData();

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
  initializeFundDataFromHistory,
  getCurrentNavs,
  getCurrentAums,
  getFundProductIds,
  getFundNavByProductCode,
  getFundAumByProductCode
};
