// .env 파일 로드
require('dotenv').config();

const { writeToInflux } = require('../services/influx/influxClient');
const { generateAllETFNavData, initializeETFDataFromHistory } = require('../data/etfGenerator');
const {
  generateAllFundNavData,
  generateAllFundAumData,
  initializeFundDataFromHistory
} = require('../data/fundGenerator');

// 데이터 생성기 초기화
require('../data/etfGenerator');
require('../data/fundGenerator');

/*
 * 특정 날짜 범위의 일 단위 데이터 생성 스크립트
 * (ETF 기준가, 펀드 기준가, 펀드 운용규모만 생성)
 *
 * 사용법:
 * node test/generateDailyData.js [시작날짜] [종료날짜]
 *
 * 예시:
 * node test/generateDailyData.js 2025-01-01 2025-01-31
 * node test/generateDailyData.js 2025-01-01 2025-12-31
 */

// 명령행 인수 파싱
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('사용법: node test/generateDailyData.js [시작날짜] [종료날짜]');
  console.error('예시: node test/generateDailyData.js 2025-01-01 2025-01-31');
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

// 날짜 포맷팅 함수
function formatDate(date) {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
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

// 특정 날짜의 일 단위 데이터 생성 함수
async function generateDailyDataAtDate(targetDate) {
  const timestamp = targetDate.toISOString();

  try {
    // ETF 기준가 데이터 생성
    const etfNavData = generateAllETFNavData();

    for (const navData of etfNavData) {
      await writeToInflux(
        'etf_nav',
        { value: navData.etf_nav },
        { product_code: navData.product_code },
        timestamp
      );
    }

    // 펀드 기준가 데이터 생성
    const fundNavData = generateAllFundNavData();

    for (const navData of fundNavData) {
      await writeToInflux(
        'fund_nav',
        { value: navData.fund_nav },
        { fund_code: navData.fund_code },
        timestamp
      );
    }

    // 펀드 운용규모 데이터 생성
    const fundAumData = generateAllFundAumData();

    for (const aumData of fundAumData) {
      await writeToInflux(
        'fund_aum',
        { value: aumData.fund_aum },
        { fund_code: aumData.fund_code },
        timestamp
      );
    }

    return {
      etfNav: etfNavData.length,
      fundNav: fundNavData.length,
      fundAum: fundAumData.length
    };
  } catch (error) {
    console.error(`[${formatDate(targetDate)}] 데이터 생성 오류:`, error);
    return null;
  }
}

// 메인 실행 함수
async function main() {
  console.log('=== 일 단위 데이터 생성 시작 ===');
  console.log(`시작 날짜: ${formatDate(startDate)}`);
  console.log(`종료 날짜: ${formatDate(endDate)}`);
  console.log('');

  // 데이터 생성기 초기화
  await initializeGenerators();

  const currentDate = new Date(startDate);
  let totalRecords = 0;
  let processedDays = 0;

  const startProcessTime = Date.now();

  while (currentDate <= endDate) {
    const result = await generateDailyDataAtDate(currentDate);

    if (result) {
      totalRecords += result.etfNav;
      totalRecords += result.fundNav;
      totalRecords += result.fundAum;

      processedDays++;

      // 진행상황 출력 (매일)
      const progress = (((currentDate - startDate) / (endDate - startDate)) * 100).toFixed(1);
      console.log(
        `[${formatDate(currentDate)}] 진행률: ${progress}% - ETF NAV: ${result.etfNav}개, Fund NAV: ${result.fundNav}개, Fund AUM: ${result.fundAum}개`
      );
    }

    // 1일씩 증가
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const endProcessTime = Date.now();
  const duration = (endProcessTime - startProcessTime) / 1000;

  console.log('');
  console.log('=== 일 단위 데이터 생성 완료 ===');
  console.log(`총 처리 시간: ${duration.toFixed(2)}초`);
  console.log(`총 생성된 레코드: ${totalRecords?.toLocaleString()}개`);
  console.log(`처리된 일수: ${processedDays}일`);
  console.log(`평균 처리 속도: ${(totalRecords / duration).toFixed(0)} 레코드/초`);
  console.log(`처리된 날짜 범위: ${formatDate(startDate)} ~ ${formatDate(endDate)}`);
}

// 스크립트 실행
main().catch(error => {
  console.error('스크립트 실행 오류:', error);
  process.exit(1);
});
