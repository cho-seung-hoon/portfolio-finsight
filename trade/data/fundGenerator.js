// 펀드 데이터 생성기
// 펀드 상품의 기준가 및 운용규모 데이터를 생성합니다

const productCodes = require('./productCodes.json');
const initialValues = require('./productInitialValues.json');

// 펀드 상품 코드 목록
const FUND_PRODUCT_ID = productCodes.FUND_PRODUCT_CODES;

// 각 펀드의 기본 기준가 및 운용규모 정보 (초기값)
const fundBaseNavs = {};
const fundBaseAums = {};

// 펀드 기본 기준가 및 운용규모 초기화
function initializeFundData() {
  FUND_PRODUCT_ID.forEach(symbol => {
    const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
    
    if (initialConfig) {
      // 설정된 초기값이 있으면 사용
      fundBaseNavs[symbol] = parseFloat(initialConfig.initialNav.toFixed(2));
      fundBaseAums[symbol] = parseFloat(initialConfig.initialAum.toFixed(2));
    } else {
      // 설정된 값이 없으면 기본값 생성
      const initialNav = Math.random() * 7000 + 8000;
      fundBaseNavs[symbol] = parseFloat(Math.max(initialNav, 100).toFixed(2));
      
      const initialAum = Math.floor(Math.random() * 491 + 10); // 10억 ~ 500억
      fundBaseAums[symbol] = parseFloat(Math.max(initialAum, 1).toFixed(2));
    }
  });
}

// 과거 데이터를 기반으로 펀드 데이터 초기화
async function initializeFundDataFromHistory(startTime) {
  const { getLatestFundData } = require('../services/influx/influxClient');

  try {
    console.log(`[Fund] ${startTime.toISOString()} 기준 과거 데이터 조회 중...`);
    const latestData = await getLatestFundData(startTime);

    FUND_PRODUCT_ID.forEach(symbol => {
      const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
      
      // 과거 데이터가 있으면 사용, 없으면 초기값 설정
      if (latestData.nav[symbol]) {
        fundBaseNavs[symbol] = parseFloat(latestData.nav[symbol].toFixed(2));
        console.log(`[Fund] ${symbol} 기준가 기존값 조회: ${latestData.nav[symbol]}`);
      } else if (initialConfig) {
        fundBaseNavs[symbol] = parseFloat(initialConfig.initialNav.toFixed(2));
        console.log(`[Fund] ${symbol} 기준가 초기값 생성: ${initialConfig.initialNav}`);
      } else {
        fundBaseNavs[symbol] = parseFloat((Math.random() * 7000 + 8000).toFixed(2));
        console.log(`[Fund] ${symbol} 기준가 기본값 생성: ${fundBaseNavs[symbol]}`);
      }

      if (latestData.aum[symbol]) {
        fundBaseAums[symbol] = parseFloat(latestData.aum[symbol].toFixed(2));
        console.log(`[Fund] ${symbol} 운용규모 기존값 조회: ${latestData.aum[symbol]}`);
      } else if (initialConfig) {
        fundBaseAums[symbol] = parseFloat(initialConfig.initialAum.toFixed(2));
        console.log(`[Fund] ${symbol} 운용규모 초기값 생성: ${initialConfig.initialAum}`);
      } else {
        fundBaseNavs[symbol] = parseFloat((Math.random() * 200 + 50).toFixed(2));
        console.log(`[Fund] ${symbol} 운용규모 기본값 생성: ${fundBaseNavs[symbol]}`);
      }
    });

    console.log(`[Fund] 초기값 설정 완료 - ${FUND_PRODUCT_ID.length}개 상품`);
  } catch (error) {
    console.error('[Fund] 과거 데이터 조회 실패, 기본값으로 초기화:', error);
    initializeFundData();
  }
}

// 랜덤 기준가 변동 생성 (펀드용, 종목별 변동성 적용)
function generateNavChange(symbol, currentNav) {
  // 현재 기준가가 유효하지 않으면 기본값 사용
  if (!currentNav || isNaN(currentNav) || !isFinite(currentNav) || currentNav <= 0) {
    const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
    return initialConfig ? initialConfig.initialNav : Math.random() * 7000 + 8000;
  }

  const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
  // 변동성 조정 (실시간 데이터에 맞게)
  const navVolatility = initialConfig ? initialConfig.navVolatility * 0.1 : 0.002; // 0.2%
  const minNav = initialConfig ? initialConfig.minNav : currentNav * 0.97;
  const maxNav = initialConfig ? initialConfig.maxNav : currentNav * 1.03;

  // 종목별 기준가 변동성 적용 (시세보다 변동폭이 작음)
  const changePercent = (Math.random() - 0.5) * 2 * navVolatility;
  const navChange = currentNav * changePercent;

  // 최소값과 최대값 제한
  const minNavLimit = Math.max(currentNav * 0.97, minNav);
  const newNav = Math.max(currentNav + navChange, minNavLimit);
  const finalNav = Math.min(newNav, maxNav);

  // 결과값 검증
  if (isNaN(finalNav) || !isFinite(finalNav) || finalNav <= 0) {
    return Math.max(currentNav, minNav);
  }

  return finalNav;
}

// 랜덤 운용규모 변동 생성 (펀드용, 종목별 변동성 적용)
function generateAumChange(symbol, currentAum) {
  // 현재 운용규모가 유효하지 않으면 기본값 사용
  if (!currentAum || isNaN(currentAum) || !isFinite(currentAum) || currentAum <= 0) {
    const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
    return initialConfig ? initialConfig.initialAum : Math.random() * 200 + 50;
  }

  const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
  // 변동성 조정 (실시간 데이터에 맞게)
  const aumVolatility = initialConfig ? initialConfig.aumVolatility * 0.1 : 0.015; // 1.5%
  const minAum = initialConfig ? initialConfig.minAum : currentAum * 0.8;
  const maxAum = initialConfig ? initialConfig.maxAum : currentAum * 1.2;

  // 종목별 운용규모 변동성 적용
  const changePercent = (Math.random() - 0.5) * 2 * aumVolatility;
  const aumChange = currentAum * changePercent;

  // 최소값과 최대값 제한
  const minAumLimit = Math.max(currentAum * 0.8, minAum);
  const newAum = Math.max(currentAum + aumChange, minAumLimit);
  const finalAum = Math.min(newAum, maxAum);

  // 결과값 검증
  if (isNaN(finalAum) || !isFinite(finalAum) || finalAum <= 0) {
    return Math.max(currentAum, minAum);
  }

  return finalAum;
}

// 단일 펀드 기준가 데이터 생성
function generateFundNavData(symbol) {
  // 기본값이 없으면 초기화
  if (!fundBaseNavs[symbol] || isNaN(fundBaseNavs[symbol]) || fundBaseNavs[symbol] <= 0) {
    const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
    fundBaseNavs[symbol] = initialConfig ? initialConfig.initialNav : Math.random() * 7000 + 8000;
  }

  const currentNav = fundBaseNavs[symbol];
  
  // 오늘 기준가가 없으면 어제 기준가를 사용하거나 초기값 사용
  if (!currentNav || isNaN(currentNav) || currentNav <= 0) {
    const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
    const fallbackNav = initialConfig ? initialConfig.initialNav : 10000;
    fundBaseNavs[symbol] = parseFloat(fallbackNav.toFixed(2));
    console.log(`[Fund ${symbol}] 오늘 기준가 없음, 초기값 사용: ${fallbackNav}`);
    return {
      fund_code: symbol,
      fund_nav: parseFloat(fallbackNav.toFixed(2)),
      timestamp: new Date().toISOString()
    };
  }

  const newNav = generateNavChange(symbol, currentNav);

  // 최종 검증 및 안전장치
  const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
  const minNav = initialConfig ? initialConfig.minNav : 100;
  const finalNav = Math.max(newNav, minNav);

  // 현재 기준가를 다음 계산을 위해 업데이트
  fundBaseNavs[symbol] = parseFloat(finalNav.toFixed(2));

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
    const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
    fundBaseAums[symbol] = initialConfig ? initialConfig.initialAum : Math.floor(Math.random() * 491 + 10);
  }

  const currentAum = fundBaseAums[symbol];
  const newAum = generateAumChange(symbol, currentAum);

  // 최종 검증 및 안전장치
  const initialConfig = initialValues.FUND_INITIAL_VALUES[symbol];
  const minAum = initialConfig ? initialConfig.minAum : 1;
  const finalAum = Math.max(Math.floor(newAum), minAum);

  // 현재 운용규모를 다음 계산을 위해 업데이트
  fundBaseAums[symbol] = parseFloat(finalAum.toFixed(2));

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

// 초기화 (기본값) - 필요시에만 호출
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