# FINSIGHT-TRADE ETF & Fund Data Server

ETF와 펀드 실시간 데이터를 제공하는 Node.js REST API 및 WebSocket 서버입니다.

## 🚀 프로젝트 구조

```
FINSIGHT-TRADE/
├── app.js                   # 메인 실행 파일
├── routes/                  # REST API 라우터
│   ├── etfRest.js          # ETF REST API (GET 요청)
│   └── fundRest.js         # Fund REST API (GET 요청)
├── websocket/               # WebSocket 서버 로직
│   └── wsServer.js         # WebSocket 서버
├── data/                    # 데이터 생성 관련 파일
│   ├── productCodes.json   # ETF/펀드 상품 코드 목록
│   ├── etfGenerator.js     # ETF 데이터 생성기
│   └── fundGenerator.js    # Fund 데이터 생성기
├── services/                # 서비스 로직
│   ├── influx/             # InfluxDB 관련
│   │   └── influxClient.js # InfluxDB 클라이언트
│   └── scheduler/          # 스케줄러
│       ├── etfScheduler.js # ETF 데이터 스케줄러
│       └── fundScheduler.js # Fund 데이터 스케줄러
├── public/                  # 정적 파일
│   ├── api_test.html       # API 테스트 페이지
│   └── socket_test.html    # WebSocket 테스트 페이지
├── test/                    # 테스트 및 데이터 관리 스크립트
│   ├── checkInfluxData.js      # InfluxDB 데이터 확인 스크립트
│   ├── deleteInfluxData.js     # InfluxDB 데이터 삭제 스크립트
│   ├── generateHistoricalData.js # 과거 데이터 생성 스크립트
│   └── queryHistoricalData.js  # 과거 데이터 조회 스크립트
├── package.json
├── .env                     # 환경 변수
└── .gitignore
```

## 📊 데이터베이스 연동

이 서버는 InfluxDB와 연동되어 다음과 같은 데이터를 저장합니다:

### ETF 데이터 (InfluxDB 측정값)

- `etf_price`: ETF 시세 데이터 (1초마다 업데이트)
- `etf_volume`: ETF 거래량 데이터 (1초마다 업데이트)
- `etf_nav`: ETF 기준가 데이터 (1분마다 업데이트)

### Fund 데이터 (InfluxDB 측정값)

- `fund_nav`: Fund 기준가 데이터 (1분마다 업데이트)
- `fund_aum`: Fund 운용규모 데이터 (1분마다 업데이트)

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 서버 설정
PORT=3000
NODE_ENV=development

# 애플리케이션 설정
APP_NAME=FINSIGHT-TRADE
APP_VERSION=1.0.0

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080

# 로깅 설정
LOG_FORMAT=:date[iso] :method :status :url :response-time[digits]ms

# InfluxDB 설정
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your-influxdb-token-here
INFLUX_ORG=your-organization-name
INFLUX_BUCKET=finsight
```

### 3. 서버 실행

```bash
# 개발 모드
node app.js

# 또는 npm 스크립트 사용
npm start
```

## 🔌 API 엔드포인트

### REST API (포트: 3000)

#### 기본 엔드포인트

- `GET /` - 서버 상태 확인
- `GET /api` - API 정보 조회

#### ETF 관련 엔드포인트

**현재 데이터 조회**

- `GET /etf` - ETF 상품 코드 목록 조회
- `GET /etf/all` - 모든 ETF 시세 및 거래량 조회

**과거 데이터 조회 (쿼리 스트링 방식)**

- `GET /etf/etf_price/prev?timestamp=2025-07-31T15:30:00` - ETF 시세 히스토리 (1시간 단위, 1분 간격)
- `GET /etf/etf_volume/prev?timestamp=2025-07-31T15:30:00` - ETF 거래량 히스토리 (1시간 단위, 1분 간격)
- `GET /etf/etf_nav/prev?date=2025-07-31` - ETF 기준가 히스토리 (1년 단위, 1일 간격)

#### Fund 관련 엔드포인트

**현재 데이터 조회**

- `GET /fund` - 펀드 상품 목록 조회

**과거 데이터 조회 (쿼리 스트링 방식)**

- `GET /fund/fund_nav/prev?date=2025-07-31` - 펀드 기준가 히스토리 (1년 단위, 1일 간격)
- `GET /fund/fund_aum/prev?date=2025-07-31` - 펀드 운용규모 히스토리 (1년 단위, 1일 간격)

### WebSocket API (포트: 3000)

#### 연결

```javascript
const ws = new WebSocket('ws://localhost:3000');
```

#### 수신 메시지

**ETF 데이터**

```javascript
{
  type: 'etf_data',
  data: [
    {
      product_code: '388420',
      price: 45000,           // ETF 시세
      volume: 15000,          // ETF 거래량
      timestamp: '2024-01-01T12:00:00.000Z'
    }
  ],
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

## 📈 데이터 업데이트 주기

- **ETF 시세 (etf_price)**: 1초마다 업데이트
- **ETF 거래량 (etf_volume)**: 1초마다 업데이트
- **ETF 기준가 (etf_nav)**: 1분마다 업데이트
- **Fund 기준가 (fund_nav)**: 1분마다 업데이트
- **Fund 운용규모 (fund_aum)**: 1분마다 업데이트

## 🔍 데이터 관리 스크립트

### InfluxDB 데이터 확인

```bash
# 스케줄러에서 생성된 데이터 확인
node test/checkInfluxData.js
```

### InfluxDB 데이터 삭제

```bash
# 모든 데이터 삭제
node test/deleteInfluxData.js
```

### 과거 데이터 생성

```bash
# 특정 기간의 과거 데이터 생성
node test/generateHistoricalData.js 2025-01-01 2025-01-31
```

### 과거 데이터 조회

```bash
# 특정 기간의 데이터 조회
node test/queryHistoricalData.js 2025-01-01 2025-01-31 etf_price
```

## 🏗️ 기술 스택

- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **WebSocket (ws)** - 실시간 통신
- **InfluxDB** - 시계열 데이터베이스
- **node-cron** - 스케줄링
- **Morgan** - HTTP 요청 로깅
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - 환경 변수 관리

## 📝 개발 스크립트

```bash
npm start        # 서버 실행
npm run dev      # 개발 모드 실행 (nodemon)
npm run lint     # ESLint 검사
npm run lint:fix # ESLint 자동 수정
```

## 🎯 주요 기능

### 1. 실시간 데이터 생성 및 저장

- ETF 시세, 거래량, 기준가 실시간 생성 및 InfluxDB 저장
- Fund 기준가, 운용규모 실시간 생성 및 InfluxDB 저장
- WebSocket을 통한 실시간 데이터 전송

### 2. REST API 제공

- ETF 관련 GET API (현재 데이터 및 히스토리)
- Fund 관련 GET API (현재 데이터 및 히스토리)
- 쿼리 스트링 기반 과거 데이터 조회

### 3. 상품 코드 관리

- JSON 파일로 ETF/펀드 상품 코드 중앙 관리
- 60개 ETF 상품 코드
- 60개 Fund 상품 코드

### 4. 데이터 관리 도구

- InfluxDB 데이터 확인/삭제 스크립트
- 과거 데이터 생성/조회 스크립트
- 스케줄러 기반 자동 데이터 생성

## 🔧 설정 옵션

### 환경 변수

| 변수명            | 기본값                                                   | 설명                     |
| ----------------- | -------------------------------------------------------- | ------------------------ |
| `PORT`            | 3000                                                     | HTTP/WebSocket 서버 포트 |
| `NODE_ENV`        | development                                              | 실행 환경                |
| `APP_NAME`        | FINSIGHT-TRADE                                           | 애플리케이션 이름        |
| `APP_VERSION`     | 1.0.0                                                    | 애플리케이션 버전        |
| `ALLOWED_ORIGINS` | localhost:3000,5173,8080                                 | CORS 허용 도메인         |
| `LOG_FORMAT`      | :date[iso] :method :status :url :response-time[digits]ms | 로깅 포맷                |
| `INFLUX_URL`      | http://localhost:8086                                    | InfluxDB URL             |
| `INFLUX_TOKEN`    | -                                                        | InfluxDB 토큰            |
| `INFLUX_ORG`      | -                                                        | InfluxDB 조직            |
| `INFLUX_BUCKET`   | finsight                                                 | InfluxDB 버킷            |

## 📄 라이센스

ISC
