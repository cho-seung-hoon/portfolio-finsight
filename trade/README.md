# FINSIGHT-TRADE

금융 투자 상품 시뮬레이션 및 데이터 생성 시스템

## 주요 기능

- **ETF 데이터 생성**: 종목별 현실적인 시세, 거래량, 기준가 시뮬레이션
- **펀드 데이터 생성**: 종목별 기준가 및 운용규모 시뮬레이션
- **실시간 데이터 스트리밍**: WebSocket을 통한 실시간 데이터 전송
- **과거 데이터 생성**: 특정 기간의 일별 데이터 일괄 생성
- **InfluxDB 연동**: 시계열 데이터베이스에 데이터 저장

## 종목별 초기값 시스템

### ETF 종목별 설정
각 ETF마다 다른 초기값과 변동성을 설정하여 현실적인 시뮬레이션을 제공합니다.

```json
{
  "388420": {
    "name": "KODEX 200",
    "initialPrice": 30000,      // 초기 시세
    "initialVolume": 50000,     // 초기 거래량
    "initialNav": 30000,        // 초기 기준가
    "minPrice": 15000,          // 최소 시세
    "maxPrice": 60000,          // 최대 시세
    "volumeUnit": 5000,         // 거래량 단위
    "volatility": 0.05,         // 시세 변동성
    "navVolatility": 0.03       // 기준가 변동성
  }
}
```

### 펀드 종목별 설정
각 펀드마다 다른 기준가와 운용규모 변동성을 설정합니다.

```json
{
  "KR5103972976": {
    "name": "한국 주식형 펀드",
    "initialNav": 10000,        // 초기 기준가
    "initialAum": 150,          // 초기 운용규모 (억원)
    "minNav": 8000,             // 최소 기준가
    "maxNav": 15000,            // 최대 기준가
    "navVolatility": 0.02,      // 기준가 변동성
    "aumVolatility": 0.15       // 운용규모 변동성
  }
}
```

## 설치 및 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 설정을 추가하세요:

```env
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your_token_here
INFLUX_ORG=your_org_here
INFLUX_BUCKET=your_bucket_here
PORT=3000
WS_PORT=3001
NODE_ENV=development
```

### 3. 일별 데이터 생성
시스템을 실행하기 전에 먼저 과거 데이터를 생성해야 합니다.

```bash
# 2025년 1월 한 달간 데이터 생성
node test/generateDailyData.js 2025-01-01 2025-01-31

# 2025년 전체 데이터 생성
node test/generateDailyData.js 2025-01-01 2025-12-31
```

### 4. 개발 서버 실행
데이터 생성이 완료되면 개발 서버를 실행할 수 있습니다.

```bash
npm run dev
```

서버가 실행되면 다음 URL에서 접근할 수 있습니다:
- HTTP API: http://localhost:3000
- WebSocket: ws://localhost:3000
- API 테스트 페이지: http://localhost:3000/api_test.html
- WebSocket 테스트 페이지: http://localhost:3000/socket_test.html

## 사용법

### 일별 데이터 생성
특정 기간의 일별 데이터를 일괄 생성합니다.

```bash
# 2025년 1월 한 달간 데이터 생성
node test/generateDailyData.js 2025-01-01 2025-01-31

# 2025년 전체 데이터 생성
node test/generateDailyData.js 2025-01-01 2025-12-31
```

### 실시간 데이터 생성
WebSocket이나 API 테스트를 위한 실시간 데이터를 생성합니다.

```bash
# 1초마다 생성, 10분간 실행
node test/generateRealTimeData.js 1 10

# 5초마다 생성, 30분간 실행
node test/generateRealTimeData.js 5 30
```

### 데이터 생성기 직접 사용
JavaScript 코드에서 직접 데이터 생성기를 사용할 수 있습니다.

```javascript
const { generateETFPriceData, generateETFNavData } = require('./data/etfGenerator');
const { generateFundNavData, generateFundAumData } = require('./data/fundGenerator');

// ETF 데이터 생성
const etfData = generateETFPriceData('388420');
const etfNavData = generateETFNavData('388420');

// 펀드 데이터 생성
const fundNavData = generateFundNavData('KR5103972976');
const fundAumData = generateFundAumData('KR5103972976');
```

## 프로젝트 구조

```
FINSIGHT-TRADE/
├── data/                          # 데이터 생성 관련
│   ├── productCodes.json         # 상품 코드 목록
│   ├── productInitialValues.json # 종목별 초기값 설정
│   ├── etfGenerator.js           # ETF 데이터 생성기
│   └── fundGenerator.js          # 펀드 데이터 생성기
├── services/                      # 서비스 레이어
│   ├── influx/                   # InfluxDB 연동
│   └── scheduler/                # 스케줄러
├── test/                         # 테스트 및 데이터 생성 스크립트
│   ├── generateDailyData.js      # 일별 데이터 생성
│   ├── generateRealTimeData.js   # 실시간 데이터 생성
│   └── ...                       # 기타 테스트 스크립트
├── websocket/                    # WebSocket 서버
├── routes/                       # REST API 라우트
├── public/                       # 정적 파일 (테스트 페이지 포함)
└── app.js                        # 메인 애플리케이션 파일
```

## 종목별 초기값 수정
`data/productInitialValues.json` 파일에서 각 종목의 초기값을 수정할 수 있습니다.

## 데이터 시뮬레이션 특징

### ETF 데이터
- **시세 변동**: 종목별로 다른 변동성 (±3% ~ ±15%)
- **거래량**: 가격 급변 시 거래량 폭증 로직
- **기준가**: 시세보다 작은 변동폭으로 안정적

### 펀드 데이터
- **기준가 변동**: 종목별로 다른 변동성 (±1% ~ ±3.5%)
- **운용규모**: -10% ~ +15% 범위의 변동
- **일별 갱신**: 하루 단위로만 변동

## 시작하기

1. **의존성 설치**
```bash
npm install
```

2. **환경 변수 설정**
```bash
cp .env.example .env
# .env 파일 편집
```

3. **일별 데이터 생성**
```bash
# 2025년 1월 한 달간 데이터 생성
node test/generateDailyData.js 2025-01-01 2025-01-31
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **테스트**
- 브라우저에서 http://localhost:3000/api_test.html 접속하여 API 테스트
- 브라우저에서 http://localhost:3000/socket_test.html 접속하여 WebSocket 테스트

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여

버그 리포트나 기능 제안은 이슈를 통해 제출해 주세요.
Pull Request도 환영합니다!
