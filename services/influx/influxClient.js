// .env 파일 로드
require('dotenv').config();

const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// InfluxDB 설정
const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET || 'finsight';

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);

// 데이터 저장 함수
async function writeToInflux(measurement, fields, tags = {}, timestamp = null) {
  const point = new Point(measurement);

  // 필드 추가 (NaN 값 체크)
  Object.entries(fields).forEach(([key, value]) => {
    // NaN 값 체크 및 필터링
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      point.floatField(key, value);
    } else {
      console.warn(`[InfluxDB] NaN 또는 무한값 감지: ${measurement}.${key} = ${value}`);
      // 기본값으로 대체
      const defaultValue = key.includes('volume') ? 1000 : 10000;
      point.floatField(key, defaultValue);
    }
  });

  // 태그 추가
  Object.entries(tags).forEach(([key, value]) => {
    point.tag(key, value);
  });

  // 타임스탬프 설정
  if (timestamp) {
    point.timestamp(new Date(timestamp));
  }

  writeApi.writePoint(point);
  await writeApi.flush();
}

// 최근 ETF 데이터 조회 함수
async function getLatestETFData(beforeTime = null) {
  const queryApi = client.getQueryApi(org);
  const timeFilter = beforeTime ? `, stop: ${beforeTime.toISOString()}` : '';

  const queries = {
    price: `
      from(bucket: "${bucket}")
        |> range(start: -30d${timeFilter})
        |> filter(fn: (r) => r._measurement == "etf_price")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 1)
    `,
    volume: `
      from(bucket: "${bucket}")
        |> range(start: -30d${timeFilter})
        |> filter(fn: (r) => r._measurement == "etf_volume")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 1)
    `,
    nav: `
      from(bucket: "${bucket}")
        |> range(start: -30d${timeFilter})
        |> filter(fn: (r) => r._measurement == "etf_nav")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 1)
    `
  };

  const results = { price: {}, volume: {}, nav: {} };

  // ETF 시세 데이터 조회
  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(queries.price)) {
      const o = tableMeta.toObject(values);
      if (o.product_code) {
        results.price[o.product_code] = o._value;
      }
    }
  } catch (error) {
    console.log('ETF 시세 데이터 조회 중 오류 (데이터 없음):', error.message);
  }

  // ETF 거래량 데이터 조회
  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(queries.volume)) {
      const o = tableMeta.toObject(values);
      if (o.product_code) {
        results.volume[o.product_code] = parseInt(o._value);
      }
    }
  } catch (error) {
    console.log('ETF 거래량 데이터 조회 중 오류 (데이터 없음):', error.message);
  }

  // ETF 기준가 데이터 조회
  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(queries.nav)) {
      const o = tableMeta.toObject(values);
      if (o.product_code) {
        results.nav[o.product_code] = parseFloat(o._value.toFixed(2));
      }
    }
  } catch (error) {
    console.log('ETF 기준가 데이터 조회 중 오류 (데이터 없음):', error.message);
  }

  return results;
}

// 최근 펀드 데이터 조회 함수
async function getLatestFundData(beforeTime = null) {
  const queryApi = client.getQueryApi(org);
  const timeFilter = beforeTime ? `, stop: ${beforeTime.toISOString()}` : '';

  const queries = {
    nav: `
      from(bucket: "${bucket}")
        |> range(start: -30d${timeFilter})
        |> filter(fn: (r) => r._measurement == "fund_nav")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 1)
    `,
    aum: `
      from(bucket: "${bucket}")
        |> range(start: -30d${timeFilter})
        |> filter(fn: (r) => r._measurement == "fund_aum")
        |> filter(fn: (r) => r._field == "value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 1)
    `
  };

  const results = { nav: {}, aum: {} };

  // 펀드 기준가 데이터 조회
  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(queries.nav)) {
      const o = tableMeta.toObject(values);
      if (o.fund_code) {
        results.nav[o.fund_code] = parseFloat(o._value.toFixed(2));
      }
    }
  } catch (error) {
    console.log('펀드 기준가 데이터 조회 중 오류 (데이터 없음):', error.message);
  }

  // 펀드 운용규모 데이터 조회
  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(queries.aum)) {
      const o = tableMeta.toObject(values);
      if (o.fund_code) {
        results.aum[o.fund_code] = parseFloat(o._value.toFixed(2));
      }
    }
  } catch (error) {
    console.log('펀드 운용규모 데이터 조회 중 오류 (데이터 없음):', error.message);
  }

  return results;
}

// ETF 과거 데이터 조회 함수 (3개월치)
async function getETFHistoricalData(measurement, startDate, endDate) {
  const queryApi = client.getQueryApi(org);

  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})
      |> filter(fn: (r) => r._measurement == "${measurement}")
      |> filter(fn: (r) => r._field == "value")
      |> sort(columns: ["_time"], desc: true)
  `;

  const results = [];

  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(query)) {
      const o = tableMeta.toObject(values);
      results.push({
        product_code: o.product_code,
        value:
          measurement === 'etf_volume'
            ? parseInt(o._value)
            : measurement === 'etf_nav'
              ? parseFloat(o._value.toFixed(2))
              : o._value,
        timestamp: o._time
      });
    }
  } catch (error) {
    console.log(`${measurement} 과거 데이터 조회 중 오류:`, error.message);
  }

  return results;
}

// 펀드 과거 데이터 조회 함수 (3개월치)
async function getFundHistoricalData(measurement, startDate, endDate) {
  const queryApi = client.getQueryApi(org);

  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})
      |> filter(fn: (r) => r._measurement == "${measurement}")
      |> filter(fn: (r) => r._field == "value")
      |> sort(columns: ["_time"], desc: true)
  `;

  const results = [];

  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(query)) {
      const o = tableMeta.toObject(values);
      results.push({
        fund_code: o.fund_code,
        value:
          measurement === 'fund_aum'
            ? parseFloat(o._value.toFixed(2))
            : measurement === 'fund_nav'
              ? parseFloat(o._value.toFixed(2))
              : o._value,
        timestamp: o._time
      });
    }
  } catch (error) {
    console.log(`${measurement} 과거 데이터 조회 중 오류:`, error.message);
  }

  return results;
}

module.exports = {
  writeToInflux,
  getLatestETFData,
  getLatestFundData,
  getETFHistoricalData,
  getFundHistoricalData
};
