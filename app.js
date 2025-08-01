const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
require('dotenv').config(); // .env 파일 로드

// 환경 변수 구조분해할당
const {
  PORT = PORT,
  WS_PORT = WS_PORT,
  NODE_ENV = NODE_ENV,
  APP_NAME = 'FINSIGHT-TRADE',
  APP_VERSION = '1.0.0',
  ALLOWED_ORIGINS,
  LOG_FORMAT = ':date[iso] :method :status :url :response-time[digits]ms'
} = process.env;

// 모듈 import
const etfRestRoutes = require('./routes/etfRest');
const fundRestRoutes = require('./routes/fundRest');
const { startWebSocketServer, broadcastData } = require('./websocket/wsServer');

// 스케줄러 클래스 불러오기
const ETFScheduler = require('./services/scheduler/etfScheduler');
const FundScheduler = require('./services/scheduler/fundScheduler');

const app = express();

// CORS 설정
const allowedOrigins = ALLOWED_ORIGINS
  ? ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// 로깅 미들웨어
app.use(morgan(LOG_FORMAT));

// 정적 파일
app.use(express.static('public'));

// JSON 파서
app.use(express.json());

// REST 라우트 등록
app.use('/', etfRestRoutes);
app.use('/', fundRestRoutes);

// API 정보 라우트
app.get('/api', (req, res) => {
  res.json({
    message: APP_NAME,
    version: APP_VERSION,
    environment: NODE_ENV,
    endpoints: {
      etf: '/etf',
      fund: '/fund',
      websocket: `ws://localhost:${PORT}`
    },
    timestamp: new Date().toISOString()
  });
});

// 404 핸들러
app.use('/*', (req, res) => {
  res.status(404).json({
    error: '요청한 엔드포인트를 찾을 수 없습니다.',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({
    error: '서버 내부 오류가 발생했습니다.',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// HTTP 서버 생성
const server = http.createServer(app);

// WebSocket 서버 시작
startWebSocketServer(server);

// 스케줄러 인스턴스 생성
const etfScheduler = new ETFScheduler();
const fundScheduler = new FundScheduler();

// HTTP 서버 시작
server.listen(PORT, () => {
  console.log(`${APP_NAME} HTTP 서버가 포트 ${PORT}에서 시작되었습니다.`);
  console.log(`ETF API: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log(`환경: ${NODE_ENV}`);

  // 스케줄러 시작 (현재 시간 기준)
  const startTime = new Date();
  console.log(`스케줄러 시작 시간: ${startTime.toISOString()}`);

  etfScheduler.start(startTime);
  fundScheduler.start(startTime);

  console.log('모든 스케줄러가 시작되었습니다.');
});

// 종료 처리
function gracefulShutdown() {
  console.log('\n서버를 종료합니다...');

  // 스케줄러 중지
  etfScheduler.stop();
  fundScheduler.stop();

  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// broadcastData 함수를 전역으로 export (스케줄러에서 사용)
module.exports = { broadcastData };
