// .env 파일 로드
require('dotenv').config();

const { writeToInflux } = require('../services/influx/influxClient');
const { generateAllETFPriceData, initializeETFDataFromHistory } = require('../data/etfGenerator');

// 데이터 생성기 초기화
require('../data/etfGenerator');

/*
 * 특정 시간 범위의 초 단위 데이터 생성 스크립트
 * (ETF 시세 및 거래량만 생성)
 *
 * 사용법:
 * node test/generateSecondData.js [시작시간] [종료시간]
 *
 * 예시:
 * node test/generateSecondData.js 2025-01-30T09:00:00 2025-01-30T15:30:00
 * node test/generateSecondData.js 2025-01-30T00:00:00 2025-01-30T23:59:59
 */

// 명령행 인수 파싱
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('사용법: node test/generateSecondData.js [시작시간] [종료시간]');
  console.error('예시: node test/generateSecondData.js 2025-01-30T09:00:00 2025-01-30T15:30:00');
  process.exit(1);
}

const startTimeStr = args[0];
const endTimeStr = args[1];

// 시간 파싱
let startTime, endTime;

try {
  // ISO 형식이 아닌 경우 시간을 추가
  const normalizedStartStr = startTimeStr.includes('T') ? startTimeStr : startTimeStr + 'T00:00:00';
  const normalizedEndStr = endTimeStr.includes('T') ? endTimeStr : endTimeStr + 'T23:59:59';

  startTime = new Date(normalizedStartStr);
  endTime = new Date(normalizedEndStr);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new Error('잘못된 시간 형식');
  }
} catch (error) {
  console.error('시간 파싱 오류:', error.message);
  console.error('올바른 형식: YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm:ss');
  process.exit(1);
}

// 시간 포맷팅 함수
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
    await initializeETFDataFromHistory(startTime);

    console.log('=== 데이터 생성기 초기화 완료 ===');
  } catch (error) {
    console.error('데이터 생성기 초기화 실패:', error);
    console.log('기본값으로 계속 진행합니다.');
  }
}

// 특정 시간의 초 단위 데이터 생성 함수
async function generateSecondDataAtTime(targetTime) {
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

    return {
      etfPrice: etfPriceData.length,
      etfVolume: etfPriceData.length
    };
  } catch (error) {
    console.error(`[${formatDateTime(targetTime)}] 데이터 생성 오류:`, error);
    return null;
  }
}

// 메인 실행 함수
async function main() {
  console.log('=== 초 단위 데이터 생성 시작 ===');
  console.log(`시작 시간: ${formatDateTime(startTime)}`);
  console.log(`종료 시간: ${formatDateTime(endTime)}`);
  console.log('');

  // 데이터 생성기 초기화
  await initializeGenerators();

  const currentTime = new Date(startTime);
  let totalRecords = 0;
  let processedSeconds = 0;

  const startProcessTime = Date.now();

  while (currentTime <= endTime) {
    const result = await generateSecondDataAtTime(currentTime);

    if (result) {
      totalRecords += result.etfPrice * 2; // 시세 + 거래량

      processedSeconds++;

      // 진행상황 출력 (10초마다)
      if (processedSeconds % 10 === 0) {
        const progress = (((currentTime - startTime) / (endTime - startTime)) * 100).toFixed(1);
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
  console.log('=== 초 단위 데이터 생성 완료 ===');
  console.log(`총 처리 시간: ${duration.toFixed(2)}초`);
  console.log(`총 생성된 레코드: ${totalRecords?.toLocaleString()}개`);
  console.log(`처리된 초: ${processedSeconds}초`);
  console.log(`평균 처리 속도: ${(totalRecords / duration).toFixed(0)} 레코드/초`);
  console.log(`처리된 시간 범위: ${formatDateTime(startTime)} ~ ${formatDateTime(endTime)}`);
}

// 스크립트 실행
main().catch(error => {
  console.error('스크립트 실행 오류:', error);
  process.exit(1);
});
