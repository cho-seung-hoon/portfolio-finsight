// .env 파일 로드
require('dotenv').config();

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

/*
 * InfluxDB 데이터 확인 스크립트
 *
 * 사용법:
 * 1. .env 파일에 환경 변수 설정:
 *    INFLUX_URL=http://localhost:8086
 *    INFLUX_TOKEN=your-token-here
 *    INFLUX_ORG=your-org-here
 *    INFLUX_BUCKET=finsight
 *
 * 2. 스크립트 실행:
 *    node test/checkInfluxData.js
 *
 * 3. 모듈로 사용:
 *    const { checkETFData, checkFundData, checkDataStats } = require('./test/checkInfluxData');
 */

// InfluxDB 설정
const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET || 'finsight';

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

// 시간 범위 설정 (최근 1시간)
const startTime = new Date(Date.now() - 60 * 60 * 1000); // 1시간 전
const endTime = new Date();

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

// ETF 데이터 조회 함수
async function checkETFData() {
  console.log('\n=== ETF 데이터 조회 ===');

  try {
    // ETF 시세 데이터 조회
    const etfPriceQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r._measurement == "etf_price")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 10)
    `;

    console.log('ETF 시세 데이터 (최근 10개):');
    for await (const { values, tableMeta } of queryApi.iterateRows(etfPriceQuery)) {
      const o = tableMeta.toObject(values);
      const time = formatDateTime(new Date(o._time));
      console.log(
        `  ${time} | 상품코드: ${o.product_code || 'N/A'} | 가격: ${o._value?.toLocaleString()}`
      );
    }

    // ETF 거래량 데이터 조회
    const etfVolumeQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r._measurement == "etf_volume")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 10)
    `;

    console.log('\nETF 거래량 데이터 (최근 10개):');
    for await (const { values, tableMeta } of queryApi.iterateRows(etfVolumeQuery)) {
      const o = tableMeta.toObject(values);
      const time = formatDateTime(new Date(o._time));
      console.log(
        `  ${time} | 상품코드: ${o.product_code || 'N/A'} | 거래량: ${o._value?.toLocaleString()}`
      );
    }

    // ETF 기준가 데이터 조회
    const etfNavQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r._measurement == "etf_nav")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 10)
    `;

    console.log('\nETF 기준가 데이터 (최근 10개):');
    for await (const { values, tableMeta } of queryApi.iterateRows(etfNavQuery)) {
      const o = tableMeta.toObject(values);
      const time = formatDateTime(new Date(o._time));
      console.log(
        `  ${time} | 상품코드: ${o.product_code || 'N/A'} | 기준가: ${o._value?.toLocaleString()}`
      );
    }
  } catch (error) {
    console.error('ETF 데이터 조회 중 오류:', error);
  }
}

// 펀드 데이터 조회 함수
async function checkFundData() {
  console.log('\n=== 펀드 데이터 조회 ===');

  try {
    // 펀드 기준가 데이터 조회
    const fundNavQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r._measurement == "fund_nav")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 10)
    `;

    console.log('펀드 기준가 데이터 (최근 10개):');
    for await (const { values, tableMeta } of queryApi.iterateRows(fundNavQuery)) {
      const o = tableMeta.toObject(values);
      const time = formatDateTime(new Date(o._time));
      console.log(
        `  ${time} | 펀드코드: ${o.fund_code || 'N/A'} | 기준가: ${o._value?.toLocaleString()}`
      );
    }

    // 펀드 운용규모 데이터 조회
    const fundAumQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r._measurement == "fund_aum")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 10)
    `;

    console.log('\n펀드 운용규모 데이터 (최근 10개):');
    for await (const { values, tableMeta } of queryApi.iterateRows(fundAumQuery)) {
      const o = tableMeta.toObject(values);
      const time = formatDateTime(new Date(o._time));
      console.log(
        `  ${time} | 펀드코드: ${o.fund_code || 'N/A'} | 운용규모: ${o._value?.toLocaleString()}`
      );
    }
  } catch (error) {
    console.error('펀드 데이터 조회 중 오류:', error);
  }
}

// 데이터 통계 조회 함수
async function checkDataStats() {
  console.log('\n=== 데이터 통계 ===');

  try {
    // ETF 데이터 개수
    const etfCountQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r._measurement =~ /etf_.*/)
        |> count()
    `;

    for await (const { values, tableMeta } of queryApi.iterateRows(etfCountQuery)) {
      const o = tableMeta.toObject(values);
      console.log(`ETF 데이터 총 개수: ${o._value?.toLocaleString()}개`);
    }

    // 펀드 데이터 개수
    const fundCountQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r._measurement =~ /fund_.*/)
        |> count()
    `;

    for await (const { values, tableMeta } of queryApi.iterateRows(fundCountQuery)) {
      const o = tableMeta.toObject(values);
      console.log(`펀드 데이터 총 개수: ${o._value?.toLocaleString()}개`);
    }

    // 측정값별 데이터 개수
    const measurementCountQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> group(columns: ["_measurement"])
        |> count()
        |> sort(columns: ["_value"], desc: true)
    `;

    console.log('\n측정값별 데이터 개수:');
    for await (const { values, tableMeta } of queryApi.iterateRows(measurementCountQuery)) {
      const o = tableMeta.toObject(values);
      console.log(`  ${o._measurement}: ${o._value?.toLocaleString()}개`);
    }
  } catch (error) {
    console.error('데이터 통계 조회 중 오류:', error);
  }
}

// 메인 실행 함수
async function main() {
  console.log('=== InfluxDB 데이터 확인 시작 ===');
  console.log(`조회 시간 범위: ${formatDateTime(startTime)} ~ ${formatDateTime(endTime)}`);
  console.log(`대상 버킷: ${bucket}`);

  try {
    await checkETFData();
    await checkFundData();
    await checkDataStats();

    console.log('\n=== 데이터 확인 완료 ===');
  } catch (error) {
    console.error('데이터 확인 중 오류:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkETFData,
  checkFundData,
  checkDataStats
};
