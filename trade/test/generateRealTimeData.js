// 실시간 데이터 생성 스크립트
// ETF와 펀드 데이터를 실시간으로 생성하여 WebSocket이나 API 테스트에 사용합니다

const { generateETFPriceData, generateETFNavData, initializeETFDataFromHistory } = require('../data/etfGenerator');
const { generateFundNavData, generateFundAumData, initializeFundDataFromHistory } = require('../data/fundGenerator');

// 데이터 생성기 초기화
require('../data/etfGenerator');
require('../data/fundGenerator');

/*
 * 실시간 데이터 생성 스크립트
 * 
 * 사용법:
 * node test/generateRealTimeData.js [생성주기(초)] [실행시간(분)]
 *
 * 예시:
 * node test/generateRealTimeData.js 1 10    # 1초마다 생성, 10분간 실행
 * node test/generateRealTimeData.js 5 30    # 5초마다 생성, 30분간 실행
 */

// 명령행 인수 파싱
const args = process.argv.slice(2);
const intervalSeconds = args[0] ? parseInt(args[0]) : 1;
const runMinutes = args[1] ? parseInt(args[1]) : 10;

if (isNaN(intervalSeconds) || isNaN(runMinutes) || intervalSeconds < 1 || runMinutes < 1) {
  console.error('사용법: node test/generateRealTimeData.js [생성주기(초)] [실행시간(분)]');
  console.error('예시: node test/generateRealTimeData.js 1 10');
  process.exit(1);
}

console.log(`=== 실시간 데이터 생성 시작 ===`);
console.log(`생성 주기: ${intervalSeconds}초`);
console.log(`실행 시간: ${runMinutes}분`);
console.log('');

// 데이터 생성기 초기화
async function initializeGenerators() {
  console.log('데이터 생성기 초기화 중...');
  
  try {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - 60); // 1시간 전부터 조회
    
    await initializeETFDataFromHistory(startTime);
    await initializeFundDataFromHistory(startTime);
    
    console.log('데이터 생성기 초기화 완료');
  } catch (error) {
    console.error('데이터 생성기 초기화 실패:', error.message);
    console.log('기본값으로 계속 진행합니다.');
  }
}

// ETF 데이터 생성 및 출력
function generateETFData() {
  const etfData = [];
  
  // ETF_PRODUCT_ID는 etfGenerator에서 가져옴
  const { ETF_PRODUCT_ID } = require('../data/etfGenerator');
  
  ETF_PRODUCT_ID.forEach(symbol => {
    try {
      const priceData = generateETFPriceData(symbol);
      const navData = generateETFNavData(symbol);
      
      // 기준가 대비 시세 변동률 계산
      const priceChangeRate = ((priceData.etf_price - navData.etf_nav) / navData.etf_nav * 100).toFixed(2);
      
      etfData.push({
        symbol: symbol,
        price: priceData.etf_price,
        volume: priceData.etf_volume,
        nav: navData.etf_nav,
        priceChangeRate: parseFloat(priceChangeRate), // 기준가 대비 변동률
        timestamp: priceData.timestamp
      });
    } catch (error) {
      console.error(`[ETF ${symbol}] 데이터 생성 오류:`, error.message);
    }
  });
  
  return etfData;
}

// 펀드 데이터 생성 및 출력
function generateFundData() {
  const fundData = [];
  
  // FUND_PRODUCT_ID는 fundGenerator에서 가져옴
  const { FUND_PRODUCT_ID } = require('../data/fundGenerator');
  
  FUND_PRODUCT_ID.forEach(symbol => {
    try {
      const navData = generateFundNavData(symbol);
      const aumData = generateFundAumData(symbol);
      
      fundData.push({
        symbol: symbol,
        nav: navData.fund_nav,
        aum: aumData.fund_aum,
        timestamp: navData.timestamp
      });
    } catch (error) {
      console.error(`[Fund ${symbol}] 데이터 생성 오류:`, error.message);
    }
  });
  
  return fundData;
}

// 데이터 출력 (JSON 형식)
function outputData(etfData, fundData) {
  const timestamp = new Date().toISOString();
  
  console.log(`\n${timestamp}`);
  console.log('ETF 데이터 (기준가 중심 변동):');
  
  // ETF 데이터 출력 (처음 5개만)
  etfData.slice(0, 5).forEach(item => {
    const changeIndicator = item.priceChangeRate > 0 ? '상승' : item.priceChangeRate < 0 ? '하락' : '보합';
    console.log(`  ${item.symbol}: ₩${item.price.toLocaleString()} | NAV: ₩${item.nav.toLocaleString()} | ${changeIndicator} ${item.priceChangeRate > 0 ? '+' : ''}${item.priceChangeRate}% | 거래량: ${item.volume.toLocaleString()}주`);
  });
  
  if (etfData.length > 5) {
    console.log(`  ... 외 ${etfData.length - 5}개 종목`);
  }
  
  console.log('펀드 데이터:');
  
  // 펀드 데이터 출력 (처음 5개만)
  fundData.slice(0, 5).forEach(item => {
    console.log(`  ${item.symbol}: NAV ₩${item.nav.toLocaleString()} | AUM ${item.aum}억원`);
  });
  
  if (fundData.length > 5) {
    console.log(`  ... 외 ${fundData.length - 5}개 펀드`);
  }
  
  // JSON 형식으로도 출력 (API 테스트용)
  const jsonOutput = {
    timestamp: timestamp,
    etf: etfData,
    fund: fundData
  };
  
  // JSON 파일로 저장 (선택사항)
  // require('fs').writeFileSync(`./data_${Date.now()}.json`, JSON.stringify(jsonOutput, null, 2));
  
  return jsonOutput;
}

// 메인 실행 함수
async function main() {
  console.log('실시간 데이터 생성 시작...\n');
  
  // 데이터 생성기 초기화
  await initializeGenerators();
  
  const startTime = Date.now();
  const endTime = startTime + (runMinutes * 60 * 1000);
  let iteration = 0;
  
  console.log('데이터 생성 시작...\n');
  
  // 주기적으로 데이터 생성
  const interval = setInterval(() => {
    iteration++;
    
    try {
      // ETF 데이터 생성
      const etfData = generateETFData();
      
      // 펀드 데이터 생성
      const fundData = generateFundData();
      
      // 데이터 출력
      const jsonData = outputData(etfData, fundData);
      
      // 진행상황 표시
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = (endTime - Date.now()) / 1000;
      
      console.log(`\n진행상황: ${iteration}회차 | 경과: ${elapsed.toFixed(0)}초 | 남은시간: ${remaining.toFixed(0)}초`);
      
      // 실행시간이 끝나면 종료
      if (Date.now() >= endTime) {
        clearInterval(interval);
        console.log('\n실시간 데이터 생성 완료!');
        console.log(`총 ${iteration}회 데이터 생성 완료`);
        process.exit(0);
      }
      
    } catch (error) {
      console.error('데이터 생성 오류:', error.message);
    }
  }, intervalSeconds * 1000);
  
  // Ctrl+C로 종료 처리
  process.on('SIGINT', () => {
    console.log('\n\n사용자에 의해 중단됨');
    clearInterval(interval);
    process.exit(0);
  });
}

// 스크립트 실행
main().catch(error => {
  console.error('스크립트 실행 오류:', error);
  process.exit(1);
});
