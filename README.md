# FINSIGHT
## 뉴스로 알아보는 금융 상품 추천 서비스

FINSIGHT는 뉴스 데이터를 기반으로 한 AI 금융 상품 추천 플랫폼입니다. 실시간 시세 데이터와 뉴스 분석을 통해 사용자 맞춤형 투자 포트폴리오를 제공하는 종합 금융 서비스입니다.

---

## 🏗️ 프로젝트 개요

### 주요 기능
- **AI 기반 상품 추천**: 뉴스 감성 분석 및 사용자 투자 성향 분석을 통한 개인화된 금융 상품 추천
- **실시간 시세 모니터링**: WebSocket 기반 ETF/펀드 실시간 가격 및 거래량 추적
- **포트폴리오 관리**: 보유 자산 실시간 수익률 계산 및 다양한 시각화 차트 제공
- **매매 시스템**: 실시간 매수/매도 기능 및 거래 내역 관리
- **뉴스 연동 분석**: 금융 뉴스 크롤링 및 AI 감성 분석을 통한 시장 트렌드 예측

### 기술 스택
- **Frontend**: Vue 3, Vite, Pinia, STOMP WebSocket, Chart.js
- **Backend**: Spring Boot, Spring WebSocket, MyBatis, JWT, MongoDB, InfluxDB
- **Trade Server**: Node.js, Express, WebSocket, InfluxDB
- **Database**: MySQL, InfluxDB (시계열), MongoDB (문서 데이터)
- **External APIs**: Google Cloud Natural Language API, 환율 API

---

## 🚀 나의 주요 개발 기여

### 1. Trade Server 구축 및 실시간 데이터 처리 시스템
**개발 기간**: 프로젝트 초기부터 완료까지  
**담당 역할**: Trade Server 전체 아키텍처 설계 및 구현

#### 핵심 구현 내용:
- **Node.js 기반 독립적인 Trade Server 개발**
  - ETF/펀드 실시간 시세 데이터 생성 및 배포 시스템 구축
  - WebSocket 서버 구현으로 실시간 데이터 스트리밍 제공
  - InfluxDB 시계열 데이터베이스 연동으로 고성능 데이터 저장

- **실시간 데이터 생성 엔진 개발**
  ```javascript
  // ETF 데이터 생성 시스템
  - 종목별 현실적인 시세, 거래량, 기준가 시뮬레이션
  - 변동성 모델링을 통한 자연스러운 가격 변동 구현
  - 초기값 시스템으로 종목별 특성화된 데이터 생성
  ```

- **WebSocket 기반 실시간 브로드캐스팅**
  ```javascript
  // wsServer.js - 실시간 데이터 배포
  function broadcastETFData(etfDataArray) {
    const simplifiedData = etfDataArray.map(etf => ({
      product_code: etf.product_code,
      price: etf.price,
      volume: etf.volume,
      timestamp: etf.timestamp
    }));
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'etf_data',
          data: simplifiedData
        }));
      }
    });
  }
  ```

### 2. Backend WebSocket 통신 시스템 구현
**개발 기간**: Trade Server 완료 후 Backend 연동  
**담당 역할**: Backend와 Trade Server 간 WebSocket 연동 및 STOMP 프로토콜 구현

#### 핵심 구현 내용:
- **Trade Server와 Backend 간 WebSocket 클라이언트 개발**
  ```java
  @Component
  public class TradeWebSocketClient {
    // Trade Server에서 실시간 데이터 수신
    public void connect() {
      WebSocketSession session = webSocketClient
        .doHandshake(handler, new WebSocketHttpHeaders(), URI.create(wsUrl))
        .get();
      
      // 과거 데이터 초기화 및 실시간 데이터 수신 처리
    }
  }
  ```

- **STOMP WebSocket으로 Frontend에 데이터 재배포**
  ```java
  @MessageMapping("/etf.subscribe")
  public void subscribeToEtf(@Payload String productCode, SimpMessageHeaderAccessor headerAccessor) {
    // 사용자별 ETF 구독 관리
    // Trade Server 데이터를 받아서 Frontend로 개별 전송
  }
  ```

- **InfluxDB 연동 및 시계열 데이터 처리**
  ```java
  public class InfluxDBService {
    // Trade Server에서 받은 데이터를 InfluxDB에 저장
    public void writeEtfPrice(String productCode, double price, Instant timestamp) {
      // 고성능 시계열 데이터 저장 로직
    }
  }
  ```

### 3. Frontend 실시간 데이터 연동 시스템
**개발 기간**: Backend WebSocket 완료 후 Frontend 연동  
**담당 역할**: Vue 3에서 STOMP WebSocket 연동 및 실시간 UI 업데이트

#### 핵심 구현 내용:
- **STOMP 클라이언트 및 WebSocket Store 구현**
  ```javascript
  // websocket.js - Pinia Store
  export const useWebSocketStore = defineStore('websocket', () => {
    const connect = () => {
      const socket = new SockJS(`http://localhost:8080/ws-etf`);
      client.value = new Client({
        webSocketFactory: () => socket,
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => {
          // 연결 성공 시 처리
        }
      });
    };
  });
  ```

- **상품별 실시간 구독 시스템**
  ```javascript
  // useProductSubscription.js - Composable
  export function useProductSubscription() {
    const subscribeToProducts = async (productCodes, callback) => {
      for (const code of productCodes) {
        const subscription = webSocketStore.subscribeToEtf(code, data => {
          callback(data, code); // 실시간 데이터로 UI 업데이트
        });
      }
    };
  }
  ```

- **실시간 차트 및 UI 업데이트**
  - ETF/펀드 상세 페이지에서 실시간 가격 차트 구현
  - 보유 자산 실시간 수익률 계산 및 표시
  - 찜한 상품 실시간 가격 모니터링

### 4. 금융 상세 페이지 및 차트 시스템
**개발 기간**: 실시간 데이터 연동 완료 후  
**담당 역할**: 금융 상품 상세 정보 페이지 및 다양한 차트 구현

#### 핵심 구현 내용:
- **동적 차트 컴포넌트 개발**
  - D3.js 및 ApexCharts를 활용한 실시간 가격 차트
  - 영역 차트, 파이 차트, 선형 그래프 등 다양한 시각화
  - 실시간 데이터에 따른 차트 자동 업데이트

- **상품 상세 정보 시스템**
  - ETF/펀드/예금 상품별 맞춤형 상세 페이지
  - 실시간 수익률 계산 및 시각화
  - 과거 성과 데이터 조회 및 분석

### 5. 매수/매도 시스템 구현
**개발 기간**: 상세 페이지 완료 후  
**담당 역할**: 실시간 거래 시스템 및 포트폴리오 관리

#### 핵심 구현 내용:
- **실시간 매수/매도 모달 시스템**
  - 현재 시세 기반 실시간 거래 금액 계산
  - 보유 자금 및 수량 검증 시스템
  - 거래 내역 실시간 반영

- **포트폴리오 관리 시스템**
  - 보유 자산 실시간 수익률 계산
  - 다양한 투자 성향별 포트폴리오 추천
  - 환율 연동을 통한 해외 자산 평가

---

## 📊 시스템 아키텍처

```
┌─────────────────┐    WebSocket     ┌─────────────────┐    STOMP WebSocket    ┌─────────────────┐
│   Trade Server  │ ────────────────→│   Backend API   │ ────────────────────→│   Frontend UI   │
│   (Node.js)     │                  │  (Spring Boot)  │                      │    (Vue 3)      │
└─────────────────┘                  └─────────────────┘                      └─────────────────┘
         │                                     │                                         │
         ▼                                     ▼                                         ▼
┌─────────────────┐                  ┌─────────────────┐                      ┌─────────────────┐
│    InfluxDB     │                  │   MySQL + MongoDB│                      │  Real-time UI   │
│ (시계열 데이터)    │                  │  (관계형 + 문서)   │                      │   Updates       │
└─────────────────┘                  └─────────────────┘                      └─────────────────┘
```

### 데이터 플로우:
1. **Trade Server**: 실시간 ETF/펀드 데이터 생성 → InfluxDB 저장
2. **Backend**: Trade Server에서 WebSocket으로 데이터 수신 → 사용자별 STOMP 채널로 재배포
3. **Frontend**: STOMP WebSocket으로 실시간 데이터 수신 → UI 즉시 업데이트

---

## 🎯 성과 및 학습 경험

### 기술적 성과
- **마이크로서비스 아키텍처**: Trade Server를 독립적인 서비스로 분리하여 확장성 확보
- **실시간 데이터 처리**: WebSocket + STOMP를 통한 효율적인 실시간 통신 구현
- **시계열 데이터베이스**: InfluxDB를 활용한 고성능 금융 데이터 처리
- **상태 관리**: Pinia를 활용한 복잡한 실시간 상태 관리 시스템 구축

### 학습 경험
- **WebSocket 통신**: Node.js, Spring Boot, Vue.js 간 복잡한 실시간 통신 구조 설계
- **시계열 데이터**: 금융 데이터 특성에 맞는 데이터베이스 선택 및 최적화
- **마이크로서비스**: 서비스 간 결합도를 낮추면서도 효율적인 데이터 교환 방법 학습
- **실시간 UI**: 사용자 경험을 해치지 않는 실시간 데이터 업데이트 최적화

---

## 🛠️ 설치 및 실행 방법

### 1. Trade Server 실행
```bash
cd trade
npm install
npm run dev
```

### 2. Backend 실행
```bash
cd backend
./gradlew bootRun
```

### 3. Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

### 4. 접속
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Trade Server**: http://localhost:3000

---

## 👥 팀 정보
- **팀명**: FINSIGHT
- **프로젝트 기간**: 2025년 1월 - 2월
- **팀원**: 5명 (풀스택 개발)

## 📝 주요 커밋 기록

커밋 분석을 통해 확인한 주요 개발 내용:
- `ETF 및 펀드 데이터 생성기 개선`: Trade Server의 핵심 데이터 생성 로직 구현
- `웹소켓 등 상세 페이지 관련 전체적인 수정`: Frontend-Backend 실시간 연동 시스템 구축
- `프론트와 백 웹소켓 STOMP /ws-etf`: STOMP 프로토콜 기반 실시간 통신 구현
- `외부서버랑 웹소켓 열기`: Trade Server와 Backend 간 WebSocket 연동
- `ETF 차트 데이터 처리 및 실시간 업데이트 개선`: 실시간 차트 시스템 구현

---

*이 프로젝트를 통해 실시간 금융 데이터 처리 시스템의 전체 아키텍처를 설계하고 구현하는 경험을 쌓았습니다. 특히 WebSocket 기반의 실시간 통신과 시계열 데이터베이스를 활용한 고성능 데이터 처리에 대한 깊은 이해를 얻었습니다.*