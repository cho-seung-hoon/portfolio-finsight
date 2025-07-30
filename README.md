# FINSIGHT-TRADE ETF Data Server

ETF 실시간 데이터를 제공하는 Node.js REST API 및 WebSocket 서버입니다.

## 프로젝트 구조

```
finsight-trade/
├── app.js                   # 메인 실행 파일
├── routes/                  # GET 요청 처리 라우터
│   └── etf.js
├── websocket/               # WebSocket 서버 로직
│   └── etfSocket.js
├── data/                    # 시세 생성 관련 파일
│   └── dataGenerator.js
├── package.json
├── package-lock.json
├── eslint.config.js
├── .eslintrc.js
└── .prettierrc
```

## 데이터베이스 연동

이 서버는 다음과 같은 데이터베이스 테이블과 연동됩니다:

### ETF 테이블

- `product_code`: 상품 코드 (기본키)
- `etf_price`: 시세 (1초마다 업데이트)
- `etf_volume`: 거래량 (1초마다 업데이트)

### Holdings 테이블

- `product_code`: 상품 코드 (ETF 테이블 참조)
- `product_category`: 'ETF'로 고정
- `holdings_total_price`: 총 투자금액
- `holdings_total_quantity`: 총 투자수량

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
NODE_ENV=development
PORT=3000
WS_PORT=3001
```

### 3. 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

### REST API (포트: 3000)

#### 기본 엔드포인트

- `GET /` - 서버 상태 확인

#### ETF 관련 엔드포인트

- `GET /api/etfs` - 모든 ETF 상품 코드 목록 조회
- `GET /api/prices` - 모든 ETF의 현재 시세 조회
- `GET /api/prices/:productCode` - 특정 ETF의 현재 시세 조회
- `GET /api/holdings/:productCode` - Holdings 테이블 연동용 ETF 시세 조회
- `GET /api/test` - CORS 테스트

### WebSocket API (포트: 3001)

#### 연결

```javascript
const ws = new WebSocket('ws://localhost:3001');
```

#### 메시지 타입

**구독**

```javascript
ws.send(
  JSON.stringify({
    type: 'subscribe',
    product_code: '388420' // 특정 ETF 구독
  })
);

ws.send(
  JSON.stringify({
    type: 'subscribe',
    product_code: 'all' // 모든 ETF 구독
  })
);
```

**구독 해제**

```javascript
ws.send(
  JSON.stringify({
    type: 'unsubscribe',
    product_code: '388420'
  })
);
```

**핑/퐁**

```javascript
ws.send(
  JSON.stringify({
    type: 'ping'
  })
);
```

#### 수신 메시지

**ETF 데이터**

```javascript
{
  type: 'etf_data',
  data: [
    {
      product_code: '388420',
      etf_price: 45000,      // ETF 테이블의 etf_price
      etf_volume: 15000,     // ETF 테이블의 etf_volume
      timestamp: '2024-01-01T12:00:00.000Z'
    }
  ],
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

## 데이터 업데이트 주기

- **ETF 시세 (etf_price)**: 1초마다 업데이트
- **ETF 거래량 (etf_volume)**: 1초마다 업데이트

## 기술 스택

- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **WebSocket (ws)** - 실시간 통신
- **Morgan** - HTTP 요청 로깅
- **CORS** - Cross-Origin Resource Sharing

## 개발 스크립트

```bash
npm run dev      # 개발 모드 실행 (nodemon)
npm start        # 프로덕션 모드 실행
npm run lint     # ESLint 검사
npm run lint:fix # ESLint 자동 수정
npm run format   # Prettier 포맷팅
```

## 라이센스

ISC
