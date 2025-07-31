// InfluxDB 연결 설정
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
const url = process.env.INFLUX_URL;

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket, 'ns'); // ns: nanoseconds precision

// InfluxDB에 데이터 쓰기 함수
async function writeToInflux(measurement, fields, tags = {}, timestamp = null) {
  const point = new Point(measurement);
  Object.entries(fields).forEach(([key, value]) => point.floatField(key, value));
  Object.entries(tags).forEach(([key, value]) => point.tag(key, value));

  // timestamp가 제공되면 명시적으로 설정
  if (timestamp) {
    point.timestamp(new Date(timestamp));
  }

  writeApi.writePoint(point);
  await writeApi.flush();
}

module.exports = {
  writeToInflux
};
