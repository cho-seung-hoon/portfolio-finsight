const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); // .env를 가장 먼저 로드

// 환경 변수 로드
const {
  PORT = 3000,
  WS_PORT = 3001,
  NODE_ENV = 'development',
  APP_NAME = 'FINSIGHT-TRADE',
  APP_VERSION = '1.0.0',
  ALLOWED_ORIGINS,
  LOG_FORMAT = ':date[iso] :method :status :url :response-time[digits]ms'
} = process.env;

// 모듈 import
const etfRestRoutes = require('./routes/etfRest');
const fundRestRoutes = require('./routes/fundRest');
const WebSocketServer = require('./websocket/etfSocket');

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

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: APP_NAME,
    version: APP_VERSION,
    environment: NODE_ENV,
    endpoints: {
      etf: '/etf',
      prices: '/prices',
      websocket: `ws://localhost:${WS_PORT}`
    },
    timestamp: new Date().toISOString()
  });
});

// REST 라우트 등록
app.use('/', etfRestRoutes);
app.use('/', fundRestRoutes);

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

// HTTP 서버 시작
app.listen(PORT, () => {
  console.log(`${APP_NAME} HTTP 서버가 포트 ${PORT}에서 시작되었습니다.`);
  console.log(`ETF API: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${WS_PORT}`);
  console.log(`환경: ${NODE_ENV}`);
});

// WebSocket 서버 시작
const wsServer = new WebSocketServer(WS_PORT);
wsServer.start();

// 종료 처리
function gracefulShutdown() {
  console.log('\n서버를 종료합니다...');
  wsServer.stop();
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
