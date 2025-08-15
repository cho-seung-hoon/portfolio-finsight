// ETF 데이터 생성기
// ETF 상품의 시세, 거래량, 기준가 데이터를 생성합니다

const productCodes = require('./productCodes.json');
const initialValues = require('./productInitialValues.json');

// ETF 상품 코드 목록
const ETF_PRODUCT_ID = productCodes.ETF_PRODUCT_CODES;

// 각 ETF의 기본 시세, 거래량, 기준가 정보 (초기값)
const etfBasePrices = {};
const etfBaseVolumes = {};
const etfBaseNavs = {};

// ETF 기본 시세, 거래량, 기준가 초기화
function initializeETFData() {
  ETF_PRODUCT_ID.forEach(symbol => {
    const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
    
    if (initialConfig) {
      // 설정된 초기값이 있으면 사용
      etfBasePrices[symbol] = parseFloat(initialConfig.initialPrice.toFixed(2));
      etfBaseVolumes[symbol] = initialConfig.initialVolume;
      etfBaseNavs[symbol] = parseFloat(initialConfig.initialNav.toFixed(2));
    } else {
      // 설정된 값이 없으면 기본값 생성
      const initialPrice = Math.random() * 25000 + 5000;
      etfBasePrices[symbol] = parseFloat(Math.max(initialPrice, 100).toFixed(2));
      
      const initialVolume = Math.floor(Math.random() * 490 + 10);
      etfBaseVolumes[symbol] = Math.max(initialVolume, 100);
      
      const initialNav = Math.random() * 7000 + 8000;
      etfBaseNavs[symbol] = parseFloat(Math.max(initialNav, 100).toFixed(2));
    }
  });
}

// 과거 데이터를 기반으로 ETF 데이터 초기화
async function initializeETFDataFromHistory(startTime) {
  const { getLatestETFData } = require('../services/influx/influxClient');

  try {
    console.log(`[ETF] ${startTime.toISOString()} 기준 과거 데이터 조회 중...`);
    const latestData = await getLatestETFData(startTime);

    ETF_PRODUCT_ID.forEach(symbol => {
      const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
      
      // 과거 데이터가 있으면 사용, 없으면 초기값 설정
      if (latestData.price[symbol]) {
        etfBasePrices[symbol] = parseFloat(latestData.price[symbol].toFixed(2));
        console.log(`[ETF] ${symbol} 시세 기존값 조회: ${etfBasePrices[symbol]}`);
      } else if (initialConfig) {
        etfBasePrices[symbol] = parseFloat(initialConfig.initialPrice.toFixed(2));
        console.log(`[ETF] ${symbol} 시세 초기값 생성: ${initialConfig.initialPrice}`);
      } else {
        etfBasePrices[symbol] = parseFloat((Math.random() * 25000 + 5000).toFixed(2));
        console.log(`[ETF] ${symbol} 시세 기본값 생성: ${etfBasePrices[symbol]}`);
      }

      if (latestData.volume[symbol]) {
        etfBaseVolumes[symbol] = latestData.volume[symbol];
        console.log(`[ETF] ${symbol} 거래량 기존값 조회: ${latestData.volume[symbol]}`);
      } else if (initialConfig) {
        etfBaseVolumes[symbol] = initialConfig.initialVolume;
        console.log(`[ETF] ${symbol} 거래량 초기값 생성: ${initialConfig.initialVolume}`);
      } else {
        etfBaseVolumes[symbol] = Math.floor(Math.random() * 490 + 10);
        console.log(`[ETF] ${symbol} 거래량 기본값 생성: ${etfBaseVolumes[symbol]}`);
      }

      if (latestData.nav[symbol]) {
        etfBaseNavs[symbol] = parseFloat(latestData.nav[symbol].toFixed(2));
        console.log(`[ETF] ${symbol} 기준가 기존값 조회: ${latestData.nav[symbol]}`);
      } else if (initialConfig) {
        etfBaseNavs[symbol] = parseFloat(initialConfig.initialNav.toFixed(2));
        console.log(`[ETF] ${symbol} 기준가 초기값 생성: ${initialConfig.initialNav}`);
      } else {
        etfBaseNavs[symbol] = parseFloat((Math.random() * 7000 + 8000).toFixed(2));
        console.log(`[ETF] ${symbol} 기준가 기본값 생성: ${etfBaseNavs[symbol]}`);
      }
    });

    console.log(`[ETF] 초기값 설정 완료 - ${ETF_PRODUCT_ID.length}개 상품`);
  } catch (error) {
    console.error('[ETF] 과거 데이터 조회 실패, 기본값으로 초기화:', error);
    initializeETFData();
  }
}

// 랜덤 시세 변동 생성 (기준가 중심 변동)
function generatePriceChange(symbol, currentPrice, currentNav) {
  // 현재 가격이 유효하지 않으면 기본값 사용
  if (!currentPrice || isNaN(currentPrice) || !isFinite(currentPrice) || currentPrice <= 0) {
    const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
    return initialConfig ? initialConfig.initialPrice : Math.random() * 25000 + 5000;
  }

  const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
  // 변동성 조정 (실시간 데이터에 맞게)
  const volatility = initialConfig ? initialConfig.volatility * 0.1 : 0.005; // 0.5%
  const minPrice = initialConfig ? initialConfig.minPrice : currentPrice * 0.5;
  const maxPrice = initialConfig ? initialConfig.maxPrice : currentPrice * 2;

  // 기준가 대비 시세 변동률 계산
  const navDeviation = (currentPrice - currentNav) / currentNav;
  
  // 평균 회귀: 기준가로 돌아가는 힘 (기준가에서 멀어질수록 강해짐)
  const meanReversion = -navDeviation * 0.03; // 3%
  
  // 랜덤 변동 (기준가 중심) - 변동성 조정
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  
  // 최종 변동률 계산
  const totalChange = meanReversion + randomChange;
  const newPrice = currentPrice * (1 + totalChange);

  // 최소값과 최대값 제한
  const finalPrice = Math.max(newPrice, minPrice);
  const finalPriceLimited = Math.min(finalPrice, maxPrice);

  // 결과값 검증
  if (isNaN(finalPriceLimited) || !isFinite(finalPriceLimited) || finalPriceLimited <= 0) {
    return Math.max(currentPrice, minPrice);
  }

  return finalPriceLimited;
}

// 랜덤 거래량 변동 생성 (종목별 거래량 단위 적용)
function generateVolumeChange(symbol, currentVolume) {
  // 현재 거래량이 유효하지 않으면 기본값 사용
  if (!currentVolume || isNaN(currentVolume) || !isFinite(currentVolume) || currentVolume <= 0) {
    const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
    return initialConfig ? initialConfig.initialVolume : Math.floor(Math.random() * 490 + 10);
  }

  const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
  const volumeUnit = initialConfig ? initialConfig.volumeUnit : 5000;
  const minVolume = initialConfig ? initialConfig.minVolume : 100;
  const maxVolume = initialConfig ? initialConfig.maxVolume : 1000000;

  // 기본 거래량 (0 ~ volumeUnit 범위)
  let baseVolume = Math.floor(Math.random() * volumeUnit);
  
  // 가격 변동률이 ±1% 이상이면 거래량 폭증
  const priceChangeRate = Math.abs((etfBasePrices[symbol] - (etfBasePrices[symbol] * 0.99)) / etfBasePrices[symbol]);
  if (priceChangeRate > 0.01) {
    baseVolume += Math.floor(Math.random() * volumeUnit);
  }

  // 거래량 변동률을 -20%에서 +30% 사이로 제한
  const maxChangePercent = 0.25;
  const changePercent = (Math.random() - 0.4) * 2 * maxChangePercent;
  const volumeChange = currentVolume * changePercent;

  // 최소값과 최대값 제한
  const minVolumeLimit = Math.max(currentVolume * 0.8, minVolume);
  const newVolume = Math.max(currentVolume + volumeChange, minVolumeLimit);
  const finalVolume = Math.min(newVolume, maxVolume);

  // 결과값 검증
  if (isNaN(finalVolume) || !isFinite(finalVolume) || finalVolume <= 0) {
    return Math.max(currentVolume, minVolume);
  }

  return Math.floor(finalVolume);
}

// 랜덤 기준가 변동 생성 (ETF용, 종목별 변동성 적용)
function generateNavChange(symbol, currentNav) {
  // 현재 기준가가 유효하지 않으면 기본값 사용
  if (!currentNav || isNaN(currentNav) || !isFinite(currentNav) || currentNav <= 0) {
    const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
    return initialConfig ? initialConfig.initialNav : Math.random() * 7000 + 8000;
  }

  const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
  const navVolatility = initialConfig ? initialConfig.navVolatility : 0.03;
  const minNav = initialConfig ? initialConfig.minPrice : currentNav * 0.97;
  const maxNav = initialConfig ? initialConfig.maxPrice : currentNav * 1.03;

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

// 단일 ETF 시세 및 거래량 데이터 생성
function generateETFPriceData(symbol) {
  // 기본값이 없으면 초기화
  if (!etfBasePrices[symbol] || isNaN(etfBasePrices[symbol]) || etfBasePrices[symbol] <= 0) {
    const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
    etfBasePrices[symbol] = initialConfig ? initialConfig.initialPrice : Math.random() * 25000 + 5000;
  }
      if (!etfBaseVolumes[symbol] || isNaN(etfBaseVolumes[symbol]) || etfBaseVolumes[symbol] <= 0) {
      const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
      etfBaseVolumes[symbol] = initialConfig ? initialConfig.initialVolume : Math.floor(Math.random() * 490 + 10);
    }

  const currentPrice = etfBasePrices[symbol];
  const currentVolume = etfBaseVolumes[symbol];
  
  // 오늘 기준가 확인
  let todayNav = etfBaseNavs[symbol];
  
  // 오늘 기준가가 없으면 어제 기준가를 사용하거나 초기값 사용
  if (!todayNav || isNaN(todayNav) || todayNav <= 0) {
    const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
    todayNav = initialConfig ? initialConfig.initialNav : currentPrice;
    console.log(`[ETF ${symbol}] 오늘 기준가 없음, 초기값 사용: ${todayNav}`);
  }

  const newPrice = generatePriceChange(symbol, currentPrice, todayNav);
  const newVolume = generateVolumeChange(symbol, currentVolume);

  // 최종 검증 및 안전장치
  const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
  const minPrice = initialConfig ? initialConfig.minPrice : 100;
  const minVolume = initialConfig ? initialConfig.minVolume : 100;
  
  const finalPrice = Math.max(newPrice, minPrice);
  const finalVolume = Math.max(Math.floor(newVolume), minVolume);

  // 현재 시세와 거래량을 다음 계산을 위해 업데이트
  etfBasePrices[symbol] = parseFloat(finalPrice.toFixed(2));
  etfBaseVolumes[symbol] = finalVolume;

  return {
    product_code: symbol,
    etf_price: parseFloat(finalPrice.toFixed(2)),
    etf_volume: parseInt(finalVolume),
    timestamp: new Date().toISOString()
  };
}

// 단일 ETF 기준가 데이터 생성
function generateETFNavData(symbol) {
  // 기본값이 없으면 초기화
  if (!etfBaseNavs[symbol] || isNaN(etfBaseNavs[symbol]) || etfBaseNavs[symbol] <= 0) {
    const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
    etfBaseNavs[symbol] = initialConfig ? initialConfig.initialNav : Math.random() * 7000 + 8000;
  }

  const currentNav = etfBaseNavs[symbol];
  const newNav = generateNavChange(symbol, currentNav);

  // 최종 검증 및 안전장치
  const initialConfig = initialValues.ETF_INITIAL_VALUES[symbol];
  const minNav = initialConfig ? initialConfig.minPrice : 100;
  const finalNav = Math.max(newNav, minNav);

  // 현재 기준가를 다음 계산을 위해 업데이트
  etfBaseNavs[symbol] = parseFloat(finalNav.toFixed(2));

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

// 초기화 (기본값) - 필요시에만 호출
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
