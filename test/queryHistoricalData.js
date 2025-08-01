// .env 파일 로드
require('dotenv').config();

const { InfluxDB } = require('@influxdata/influxdb-client');

// InfluxDB 설정
const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET || 'finsight';

// InfluxDB 클라이언트 생성
const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

/*
 * 특정 날짜 범위의 데이터 조회 스크립트
 *
 * 사용법:
 * node test/queryHistoricalData.js [시작날짜] [종료날짜] [측정값]
 *
 * 예시:
 * node test/queryHistoricalData.js 2025-01-30T00:00:00 2025-01-30T23:59:59 etf_price
 * node test/queryHistoricalData.js 2025-01-30 2025-01-31 fund_nav
 * node test/queryHistoricalData.js 2025-01-30T09:00:00 2025-01-30T18:00:00 all
 */

// 명령행 인수 파싱
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('사용법: node test/queryHistoricalData.js [시작날짜] [종료날짜] [측정값]');
  console.error('측정값: etf_price, etf_volume, etf_nav, fund_nav, fund_aum, all');
  console.error(
    '예시: node test/queryHistoricalData.js 2025-01-30T00:00:00 2025-01-30T23:59:59 etf_price'
  );
  process.exit(1);
}

const startDateStr = args[0];
const endDateStr = args[1];
const measurement = args[2] || 'all';

// 날짜 파싱 및 검증
function parseDate(dateStr) {
  let date;

  // ISO 형식 (2025-01-30T00:00:00)
  if (dateStr.includes('T')) {
    date = new Date(dateStr);
  }
  // 날짜만 (2025-01-30) - 시작은 00:00:00, 종료는 23:59:59
  else {
    if (dateStr === startDateStr) {
      date = new Date(dateStr + 'T00:00:00');
    } else {
      date = new Date(dateStr + 'T23:59:59');
    }
  }

  if (isNaN(date.getTime())) {
    throw new Error(`잘못된 날짜 형식: ${dateStr}`);
  }

  return date;
}

const startDate = parseDate(startDateStr);
const endDate = parseDate(endDateStr);

if (startDate >= endDate) {
  console.error('시작 날짜는 종료 날짜보다 이전이어야 합니다.');
  process.exit(1);
}

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

// 측정값별 쿼리 함수
async function queryMeasurement(measurementName, start, end) {
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: ${start.toISOString()}, stop: ${end.toISOString()})
      |> filter(fn: (r) => r._measurement == "${measurementName}")
      |> sort(columns: ["_time"])
  `;

  console.log(`\n=== ${measurementName.toUpperCase()} 데이터 조회 ===`);
  console.log(`조회 기간: ${formatDateTime(start)} ~ ${formatDateTime(end)}`);

  const results = [];
  let count = 0;

  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      const o = tableMeta.toObject(values);
      results.push(o);
      count++;

      // 진행률 표시 (100개마다)
      if (count % 100 === 0) {
        process.stdout.write(`\r조회 중... ${count?.toLocaleString()}개`);
      }
    }

    console.log(`\n총 ${count?.toLocaleString()}개 레코드 조회 완료`);

    // 최근 10개 데이터 표시
    if (results.length > 0) {
      console.log('\n최근 10개 데이터:');
      const recentData = results.slice(-10);

      recentData.forEach((data, index) => {
        const time = formatDateTime(new Date(data._time));
        const value = data._value?.toLocaleString();
        const tag = data.product_code || data.fund_code || 'N/A';

        console.log(
          `  ${index + 1}. ${time} | ${measurementName === 'etf_price' || measurementName === 'etf_volume' ? '상품코드' : '펀드코드'}: ${tag} | 값: ${value}`
        );
      });
    }

    return { count, results };
  } catch (error) {
    console.error(`\n${measurementName} 조회 중 오류:`, error);
    return { count: 0, results: [] };
  }
}

// 모든 측정값 조회
async function queryAllMeasurements(start, end) {
  const measurements = ['etf_price', 'etf_volume', 'etf_nav', 'fund_nav', 'fund_aum'];
  const results = {};
  let totalCount = 0;

  console.log('\n=== 모든 측정값 데이터 조회 ===');
  console.log(`조회 기간: ${formatDateTime(start)} ~ ${formatDateTime(end)}`);

  for (const measurementName of measurements) {
    const result = await queryMeasurement(measurementName, start, end);
    results[measurementName] = result;
    totalCount += result.count;
  }

  console.log('\n=== 전체 통계 ===');
  console.log(`총 조회된 레코드: ${totalCount?.toLocaleString()}개`);

  Object.entries(results).forEach(([name, data]) => {
    console.log(`  ${name}: ${data.count?.toLocaleString()}개`);
  });

  return results;
}

// 메인 실행 함수
async function main() {
  console.log('=== InfluxDB 데이터 조회 시작 ===');
  console.log(`시작 날짜: ${formatDateTime(startDate)}`);
  console.log(`종료 날짜: ${formatDateTime(endDate)}`);
  console.log(`조회 측정값: ${measurement}`);

  try {
    let results;

    if (measurement === 'all') {
      results = await queryAllMeasurements(startDate, endDate);
    } else {
      const validMeasurements = ['etf_price', 'etf_volume', 'etf_nav', 'fund_nav', 'fund_aum'];
      if (!validMeasurements.includes(measurement)) {
        console.error(`잘못된 측정값: ${measurement}`);
        console.error(`사용 가능한 측정값: ${validMeasurements.join(', ')}`);
        process.exit(1);
      }

      const result = await queryMeasurement(measurement, startDate, endDate);
      results = { [measurement]: result };
    }

    console.log('\n=== 데이터 조회 완료 ===');
  } catch (error) {
    console.error('데이터 조회 중 오류:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = {
  queryMeasurement,
  queryAllMeasurements
};
