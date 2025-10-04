// InfluxDB 데이터 삭제 스크립트
// InfluxDB의 모든 데이터를 삭제하거나 특정 데이터만 삭제할 수 있습니다

require('dotenv').config();

const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const https = require('https');
const http = require('http');
const { URL } = require('url');

/*
 * InfluxDB 데이터 전체 삭제 스크립트
 *
 * 주의: 이 스크립트는 모든 데이터를 영구적으로 삭제합니다!
 *
 * 사용법:
 * 1. .env 파일에 환경 변수 설정:
 *    INFLUX_URL=http://localhost:8086
 *    INFLUX_TOKEN=your-token-here
 *    INFLUX_ORG=your-org-here
 *    INFLUX_BUCKET=finsight
 *
 * 2. 스크립트 실행:
 *    node test/deleteInfluxData.js
 *
 * 3. 모듈로 사용:
 *    const { deleteAllData, deleteETFData, deleteFundData } = require('./test/deleteInfluxData');
 */

// InfluxDB 설정
const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG || 'finsight';
const bucket = process.env.INFLUX_BUCKET || 'finsight_price';

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);
const writeApi = client.getWriteApi(org, bucket);

// 시간 범위 설정 (모든 데이터)
const startTime = new Date('1970-01-01T00:00:00Z'); // Unix epoch 시작
const endTime = new Date('2100-01-01T00:00:00Z'); // 미래

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

// HTTP 요청 함수
function makeHttpRequest(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const req = client.request(urlObj, options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// 데이터 삭제 함수 (HTTP API 사용)
async function deleteData(start, stop, predicate = '') {
  const deleteUrl = `${url}/api/v2/delete?org=${encodeURIComponent(org)}&bucket=${encodeURIComponent(bucket)}`;

  const deleteBody = {
    start: start,
    stop: stop,
    predicate: predicate
  };

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(deleteBody)
  };

  const response = await makeHttpRequest(deleteUrl, options);
  if (response.statusCode === 204) {
    return true;
  } else {
    throw new Error(`삭제 실패: ${response.statusCode} - ${response.data}`);
  }
}

// ETF 데이터 삭제 함수
async function deleteETFData() {
  console.log('\n=== ETF 데이터 삭제 시작 ===');

  try {
    // ETF 시세 데이터 삭제
    console.log('ETF 시세 데이터 삭제 중...');
    await deleteData(startTime.toISOString(), endTime.toISOString(), '_measurement="etf_price"');
    console.log('ETF 시세 데이터 삭제 완료');

    // ETF 거래량 데이터 삭제
    console.log('ETF 거래량 데이터 삭제 중...');
    await deleteData(startTime.toISOString(), endTime.toISOString(), '_measurement="etf_volume"');
    console.log('ETF 거래량 데이터 삭제 완료');

    // ETF 기준가 데이터 삭제
    console.log('ETF 기준가 데이터 삭제 중...');
    await deleteData(startTime.toISOString(), endTime.toISOString(), '_measurement="etf_nav"');
    console.log('ETF 기준가 데이터 삭제 완료');

    console.log('=== ETF 데이터 삭제 완료 ===');
  } catch (error) {
    console.error('ETF 데이터 삭제 중 오류:', error);
    throw error;
  }
}

// 펀드 데이터 삭제 함수
async function deleteFundData() {
  console.log('\n=== 펀드 데이터 삭제 시작 ===');

  try {
    // 펀드 기준가 데이터 삭제
    console.log('펀드 기준가 데이터 삭제 중...');
    await deleteData(startTime.toISOString(), endTime.toISOString(), '_measurement="fund_nav"');
    console.log('펀드 기준가 데이터 삭제 완료');

    // 펀드 운용규모 데이터 삭제
    console.log('펀드 운용규모 데이터 삭제 중...');
    await deleteData(startTime.toISOString(), endTime.toISOString(), '_measurement="fund_aum"');
    console.log('펀드 운용규모 데이터 삭제 완료');

    console.log('=== 펀드 데이터 삭제 완료 ===');
  } catch (error) {
    console.error('펀드 데이터 삭제 중 오류:', error);
    throw error;
  }
}

// 모든 데이터 삭제 함수
async function deleteAllData() {
  console.log('\n=== 모든 데이터 삭제 시작 ===');

  try {
    // 모든 측정값 삭제
    console.log('모든 측정값 데이터 삭제 중...');
    await deleteData(startTime.toISOString(), endTime.toISOString(), '');
    console.log('모든 데이터 삭제 완료');

    console.log('=== 모든 데이터 삭제 완료 ===');
  } catch (error) {
    console.error('모든 데이터 삭제 중 오류:', error);
    throw error;
  }
}

// 삭제 전 데이터 확인 함수
async function checkDataBeforeDelete() {
  console.log('\n=== 삭제 전 데이터 확인 ===');

  try {
    // 전체 데이터 개수 확인
    const totalCountQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> count()
    `;

    for await (const { values, tableMeta } of queryApi.iterateRows(totalCountQuery)) {
      const o = tableMeta.toObject(values);
      console.log(`총 데이터 개수: ${o._value?.toLocaleString()}개`);
    }

    // 측정값별 데이터 개수 확인
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
    console.error('데이터 확인 중 오류:', error);
  }
}

// 삭제 후 데이터 확인 함수
async function checkDataAfterDelete() {
  console.log('\n=== 삭제 후 데이터 확인 ===');

  try {
    // 전체 데이터 개수 확인
    const totalCountQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> count()
    `;

    let totalCount = 0;
    for await (const { values, tableMeta } of queryApi.iterateRows(totalCountQuery)) {
      const o = tableMeta.toObject(values);
      totalCount = parseInt(o._value);
      console.log(`총 데이터 개수: ${totalCount?.toLocaleString()}개`);
    }

    if (totalCount === 0) {
      console.log('모든 데이터가 성공적으로 삭제되었습니다.');
    } else {
      console.log('일부 데이터가 남아있습니다.');
    }
  } catch (error) {
    console.error('데이터 확인 중 오류:', error);
  }
}

// 메인 실행 함수
async function main() {
  console.log('=== InfluxDB 데이터 삭제 시작 ===');
  console.log(`삭제 시간 범위: ${formatDateTime(startTime)} ~ ${formatDateTime(endTime)}`);
  console.log(`대상 버킷: ${bucket}`);

  try {
    // 삭제 전 데이터 확인
    await checkDataBeforeDelete();

    // 모든 데이터 삭제
    await deleteAllData();

    // 삭제 후 데이터 확인
    await checkDataAfterDelete();

    console.log('\n=== 데이터 삭제 완료 ===');
  } catch (error) {
    console.error('데이터 삭제 중 오류:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  deleteAllData,
  deleteETFData,
  deleteFundData,
  checkDataBeforeDelete,
  checkDataAfterDelete
};
