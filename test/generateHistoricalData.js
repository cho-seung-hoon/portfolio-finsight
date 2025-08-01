// .env 파일 로드
require('dotenv').config();

const { writeToInflux } = require('../services/influx/influxClient');
const {
  generateAllETFPriceData,
  generateAllETFNavData,
  initializeETFDataFromHistory
} = require('../data/etfGenerator');
const {
  generateAllFundNavData,
  generateAllFundAumData,
  initializeFundDataFromHistory
} = require('../data/fundGenerator');

// 데이터 생성기 초기화
require('../data/etfGenerator');
require('../data/fundGenerator');

/*
 * 특정 날짜 범위의 데이터 생성 스크립트
 *
 * 사용법:
 * node test/generateHistoricalData.js [시작날짜] [종료날짜]
 *
 * 예시:
 * node test/generateHistoricalData.js 2025-01-30T00:00:00 2025-01-30T23:59:59
 * node test/generateHistoricalData.js 2025-01-30 2025-01-31
 */

// 명령행 인수 파싱
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('사용법: node test/generateHistoricalData.js [시작날짜] [종료날짜]');
  console.error(
    '예시: node test/generateHistoricalData.js 2025-01-30T00:00:00 2025-01-30T23:59:59'
  );
  process.exit(1);
}

const startDateStr = args[0];
const endDateStr = args[1];

// 날짜 파싱
let startDate, endDate;

try {
  // ISO 형식이 아닌 경우 시간을 추가
  const normalizedStartStr = startDateStr.includes('T') ? startDateStr : startDateStr + 'T00:00:00';
  const normalizedEndStr = endDateStr.includes('T') ? endDateStr : endDateStr + 'T23:59:59';

  startDate = new Date(normalizedStartStr);
  endDate = new Date(normalizedEndStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('잘못된 날짜 형식');
  }
} catch (error) {
  console.error('날짜 파싱 오류:', error.message);
  console.error('올바른 형식: YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm:ss');
  process.exit(1);
}

// 시간 간격 설정 (초 단위)
const ETF_PRICE_INTERVAL = 1; // ETF 시세/거래량: 1초마다
const ETF_NAV_INTERVAL = 86400; // ETF 기준가: 1일마다 (24시간 * 60분 * 60초)
const FUND_INTERVAL = 86400; // 펀드: 1일마다 (24시간 * 60분 * 60초)

// 날짜 포맷팅 함수
function formatDateTime(date) {
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// 데이터 생성기 초기화 (과거 데이터 기반)
async function initializeGenerators() {
  console.log('=== 데이터 생성기 초기화 시작 ===');

  try {
    // ETF 데이터 생성기 초기화
    await initializeETFDataFromHistory(startDate);

    // 펀드 데이터 생성기 초기화
    await initializeFundDataFromHistory(startDate);

    console.log('=== 데이터 생성기 초기화 완료 ===');
  } catch (error) {
    console.error('데이터 생성기 초기화 실패:', error);
    console.log('기본값으로 계속 진행합니다.');
  }
}

// 특정 시간의 데이터 생성 함수
async function generateDataAtTime(targetTime) {
  const timestamp = targetTime.toISOString();

  try {
    // ETF 시세 및 거래량 데이터 생성 (매초)
    const etfPriceData = generateAllETFPriceData();

    // 각 ETF 데이터를 InfluxDB에 저장
    for (const etfData of etfPriceData) {
      await writeToInflux(
        'etf_price',
        { value: etfData.etf_price },
        { product_code: etfData.product_code },
        timestamp
      );

      await writeToInflux(
        'etf_volume',
        { value: etfData.etf_volume },
        { product_code: etfData.product_code },
        timestamp
      );
    }

    // ETF 기준가 데이터 생성 (매일 자정)
    if (
      targetTime.getHours() === 0 &&
      targetTime.getMinutes() === 0 &&
      targetTime.getSeconds() === 0
    ) {
      const etfNavData = generateAllETFNavData();

      for (const navData of etfNavData) {
        await writeToInflux(
          'etf_nav',
          { value: navData.etf_nav },
          { product_code: navData.product_code },
          timestamp
        );
      }
    }

    // 펀드 데이터 생성 (매일 자정)
    if (
      targetTime.getHours() === 0 &&
      targetTime.getMinutes() === 0 &&
      targetTime.getSeconds() === 0
    ) {
      const fundNavData = generateAllFundNavData();
      const fundAumData = generateAllFundAumData();

      for (const navData of fundNavData) {
        await writeToInflux(
          'fund_nav',
          { value: navData.fund_nav },
          { fund_code: navData.fund_code },
          timestamp
        );
      }

      for (const aumData of fundAumData) {
        await writeToInflux(
          'fund_aum',
          { value: aumData.fund_aum },
          { fund_code: aumData.fund_code },
          timestamp
        );
      }
    }

    return {
      etfPrice: etfPriceData.length,
      etfNav:
        targetTime.getHours() === 0 &&
        targetTime.getMinutes() === 0 &&
        targetTime.getSeconds() === 0
          ? generateAllETFNavData().length
          : 0,
      fundNav:
        targetTime.getHours() === 0 &&
        targetTime.getMinutes() === 0 &&
        targetTime.getSeconds() === 0
          ? generateAllFundNavData().length
          : 0,
      fundAum:
        targetTime.getHours() === 0 &&
        targetTime.getMinutes() === 0 &&
        targetTime.getSeconds() === 0
          ? generateAllFundAumData().length
          : 0
    };
  } catch (error) {
    console.error(`[${formatDateTime(targetTime)}] 데이터 생성 오류:`, error);
    return null;
  }
}

// 메인 실행 함수
async function main() {
  console.log('=== 과거 데이터 생성 시작 ===');
  console.log(`시작 시간: ${formatDateTime(startDate)}`);
  console.log(`종료 시간: ${formatDateTime(endDate)}`);
  console.log('');

  // 데이터 생성기 초기화
  await initializeGenerators();

  const currentTime = new Date(startDate);
  let totalRecords = 0;
  let processedSeconds = 0;

  const startProcessTime = Date.now();

  while (currentTime <= endDate) {
    const result = await generateDataAtTime(currentTime);

    if (result) {
      totalRecords += result.etfPrice * 2; // 시세 + 거래량
      totalRecords += result.etfNav;
      totalRecords += result.fundNav;
      totalRecords += result.fundAum;

      processedSeconds++;

      // 진행상황 출력 (10초마다)
      if (processedSeconds % 10 === 0) {
        const progress = (((currentTime - startDate) / (endDate - startDate)) * 100).toFixed(1);
        console.log(
          `[${formatDateTime(currentTime)}] 진행률: ${progress}% - 총 ${totalRecords?.toLocaleString()}개 레코드`
        );
      }
    }

    // 1초씩 증가
    currentTime.setSeconds(currentTime.getSeconds() + 1);
  }

  const endProcessTime = Date.now();
  const duration = (endProcessTime - startProcessTime) / 1000;

  console.log('');
  console.log('=== 데이터 생성 완료 ===');
  console.log(`총 처리 시간: ${duration.toFixed(2)}초`);
  console.log(`총 생성된 레코드: ${totalRecords?.toLocaleString()}개`);
  console.log(`평균 처리 속도: ${(totalRecords / duration).toFixed(0)} 레코드/초`);
  console.log(`처리된 시간 범위: ${formatDateTime(startDate)} ~ ${formatDateTime(endDate)}`);
}

// 스크립트 실행
main().catch(error => {
  console.error('스크립트 실행 오류:', error);
  process.exit(1);
});
