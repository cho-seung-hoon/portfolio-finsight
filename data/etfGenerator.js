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
    const initialPrice = Math.random() * 49000 + 1000;
    etfBasePrices[symbol] = Math.max(initialPrice, 100); // 최소 100원 보장

    // ETF 거래량 범위: 1000주 ~ 100000주
    const initialVolume = Math.floor(Math.random() * 99000 + 1000);
    etfBaseVolumes[symbol] = Math.max(initialVolume, 100); // 최소 100주 보장

    // ETF 기준가 범위: 8,000원에서 15,000원 사이의 랜덤 초기 기준가
    const initialNav = Math.random() * 7000 + 8000;
    etfBaseNavs[symbol] = Math.max(initialNav, 100); // 최소 100원 보장
  });
}

// 과거 데이터를 기반으로 ETF 데이터 초기화
async function initializeETFDataFromHistory(startTime) {
  const { getLatestETFData } = require('../services/influx/influxClient');

  try {
    console.log(`[ETF] ${startTime.toISOString()} 기준 과거 데이터 조회 중...`);
    const latestData = await getLatestETFData(startTime);

    ETF_PRODUCT_ID.forEach(symbol => {
      // 과거 데이터가 있으면 사용, 없으면 기본값 생성
      if (latestData.price[symbol]) {
        etfBasePrices[symbol] = latestData.price[symbol];
        console.log(`[ETF] ${symbol} 시세 초기값 설정: ${latestData.price[symbol]}`);
      } else {
        etfBasePrices[symbol] = Math.random() * 49000 + 1000;
        console.log(`[ETF] ${symbol} 시세 기본값 생성: ${etfBasePrices[symbol]}`);
      }

      if (latestData.volume[symbol]) {
        etfBaseVolumes[symbol] = latestData.volume[symbol];
        console.log(`[ETF] ${symbol} 거래량 초기값 설정: ${latestData.volume[symbol]}`);
      } else {
        etfBaseVolumes[symbol] = Math.floor(Math.random() * 99000 + 1000);
        console.log(`[ETF] ${symbol} 거래량 기본값 생성: ${etfBaseVolumes[symbol]}`);
      }

      if (latestData.nav[symbol]) {
        etfBaseNavs[symbol] = latestData.nav[symbol];
        console.log(`[ETF] ${symbol} 기준가 초기값 설정: ${latestData.nav[symbol]}`);
      } else {
        etfBaseNavs[symbol] = Math.random() * 7000 + 8000;
        console.log(`[ETF] ${symbol} 기준가 기본값 생성: ${etfBaseNavs[symbol]}`);
      }
    });

    console.log(`[ETF] 초기값 설정 완료 - ${ETF_PRODUCT_ID.length}개 상품`);
  } catch (error) {
    console.error('[ETF] 과거 데이터 조회 실패, 기본값으로 초기화:', error);
    initializeETFData();
  }
}

// 랜덤 시세 변동 생성
function generatePriceChange(currentPrice) {
  // 안전장치: 현재 가격이 유효하지 않으면 기본값 사용
  if (!currentPrice || isNaN(currentPrice) || !isFinite(currentPrice) || currentPrice <= 0) {
    return Math.random() * 49000 + 1000;
  }

  // ETF 시세 최대값 제한 (실제 주식 시세에 적합한 범위)
  const MAX_ETF_PRICE = 1000000; // 100만원
  if (currentPrice >= MAX_ETF_PRICE) {
    return MAX_ETF_PRICE * 0.9; // 최대값의 90%로 조정
  }

  const maxChangePercent = 0.05;
  const changePercent = (Math.random() - 0.5) * 2 * maxChangePercent;
  const priceChange = currentPrice * changePercent;

  // 최소값 보장 (0이 되지 않도록)
  const minPrice = Math.max(currentPrice * 0.95, 100); // 최소 100원
  const newPrice = Math.max(currentPrice + priceChange, minPrice);

  // 최대값 제한
  const finalPrice = Math.min(newPrice, MAX_ETF_PRICE * 0.9);

  // 결과값 검증
  if (isNaN(finalPrice) || !isFinite(finalPrice) || finalPrice <= 0) {
    return Math.max(currentPrice, 100);
  }

  return finalPrice;
}

// 랜덤 거래량 변동 생성
function generateVolumeChange(currentVolume) {
  // 안전장치: 현재 거래량이 유효하지 않으면 기본값 사용
  if (!currentVolume || isNaN(currentVolume) || !isFinite(currentVolume) || currentVolume <= 0) {
    return Math.floor(Math.random() * 99000 + 1000);
  }

  // ETF 거래량 최대값 제한 (실제 거래량에 적합한 범위)
  const MAX_ETF_VOLUME = 10000000; // 1000만주
  if (currentVolume >= MAX_ETF_VOLUME) {
    return Math.floor(MAX_ETF_VOLUME * 0.9); // 최대값의 90%로 조정
  }

  // 거래량 변동률을 -20%에서 +30% 사이로 제한
  const maxChangePercent = 0.25;
  const changePercent = (Math.random() - 0.4) * 2 * maxChangePercent;
  const volumeChange = currentVolume * changePercent;

  // 최소값 보장 (0이 되지 않도록)
  const minVolume = Math.max(currentVolume * 0.8, 100); // 최소 100주
  const newVolume = Math.max(currentVolume + volumeChange, minVolume);

  // 최대값 제한
  const finalVolume = Math.min(newVolume, MAX_ETF_VOLUME * 0.9);

  // 결과값 검증
  if (isNaN(finalVolume) || !isFinite(finalVolume) || finalVolume <= 0) {
    return Math.max(currentVolume, 100);
  }

  return Math.floor(finalVolume);
}

// 랜덤 기준가 변동 생성 (ETF용)
function generateNavChange(currentNav) {
  // 안전장치: 현재 기준가가 유효하지 않으면 기본값 사용
  if (!currentNav || isNaN(currentNav) || !isFinite(currentNav) || currentNav <= 0) {
    return Math.random() * 7000 + 8000;
  }

  // ETF 기준가 최대값 제한 (실제 기준가에 적합한 범위)
  const MAX_ETF_NAV = 500000; // 50만원
  if (currentNav >= MAX_ETF_NAV) {
    return MAX_ETF_NAV * 0.9; // 최대값의 90%로 조정
  }

  const maxChangePercent = 0.03; // 기준가는 시세보다 변동폭이 작음
  const changePercent = (Math.random() - 0.5) * 2 * maxChangePercent;
  const navChange = currentNav * changePercent;

  // 최소값 보장 (0이 되지 않도록)
  const minNav = Math.max(currentNav * 0.97, 100); // 최소 100원
  const newNav = Math.max(currentNav + navChange, minNav);

  // 최대값 제한
  const finalNav = Math.min(newNav, MAX_ETF_NAV * 0.9);

  // 결과값 검증
  if (isNaN(finalNav) || !isFinite(finalNav) || finalNav <= 0) {
    return Math.max(currentNav, 100);
  }

  return finalNav;
}

// 단일 ETF 시세 및 거래량 데이터 생성
function generateETFPriceData(symbol) {
  // 기본값이 없으면 초기화
  if (!etfBasePrices[symbol] || isNaN(etfBasePrices[symbol]) || etfBasePrices[symbol] <= 0) {
    etfBasePrices[symbol] = Math.random() * 49000 + 1000;
  }
  if (!etfBaseVolumes[symbol] || isNaN(etfBaseVolumes[symbol]) || etfBaseVolumes[symbol] <= 0) {
    etfBaseVolumes[symbol] = Math.floor(Math.random() * 99000 + 1000);
  }

  const currentPrice = etfBasePrices[symbol];
  const currentVolume = etfBaseVolumes[symbol];

  const newPrice = generatePriceChange(currentPrice);
  const newVolume = generateVolumeChange(currentVolume);

  // 최종 검증 및 안전장치
  const finalPrice = Math.max(newPrice, 100); // 최소 100원 보장
  const finalVolume = Math.max(Math.floor(newVolume), 100); // 최소 100주 보장

  // 현재 시세와 거래량을 다음 계산을 위해 업데이트
  etfBasePrices[symbol] = finalPrice;
  etfBaseVolumes[symbol] = finalVolume;

  return {
    product_code: symbol,
    etf_price: parseFloat(finalPrice.toFixed(0)),
    etf_volume: parseInt(finalVolume),
    timestamp: new Date().toISOString()
  };
}

// 단일 ETF 기준가 데이터 생성
function generateETFNavData(symbol) {
  // 기본값이 없으면 초기화
  if (!etfBaseNavs[symbol] || isNaN(etfBaseNavs[symbol]) || etfBaseNavs[symbol] <= 0) {
    etfBaseNavs[symbol] = Math.random() * 7000 + 8000;
  }

  const currentNav = etfBaseNavs[symbol];

  const newNav = generateNavChange(currentNav);

  // 최종 검증 및 안전장치
  const finalNav = Math.max(newNav, 100); // 최소 100원 보장

  // 현재 기준가를 다음 계산을 위해 업데이트
  etfBaseNavs[symbol] = finalNav;

  return {
    product_code: symbol,
    etf_nav: parseFloat(finalNav.toFixed(2)),
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

// 초기화 (기본값) - 모듈 로드 시점에 호출하지 않음
// initializeETFData();

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
  initializeETFDataFromHistory,
  getCurrentPrices,
  getCurrentVolumes,
  getCurrentNavs,
  getETFProductIds,
  getETFPriceByProductCode,
  getETFNavByProductCode
};
