const WebSocket = require('ws');
const { generateAllETFData } = require('../data/dataGenerator');

class WebSocketServer {
  constructor(port = 3001) {
    this.port = port;
    this.wss = null;
    this.clients = new Set();
    this.dataInterval = null;
    this.subscriptions = new Map(); // ← 클라이언트별 구독 종목
  }

  // WebSocket 서버 시작
  start() {
    this.wss = new WebSocket.Server({ port: this.port });

    console.log(`FINSIGHT-TRADE WebSocket 서버가 포트 ${this.port}에서 시작되었습니다.`);

    this.wss.on('connection', (ws, req) => {
      console.log(`새로운 클라이언트 연결: ${req.socket.remoteAddress}`);

      // 클라이언트 추가
      this.clients.add(ws);

      // 연결 확인 메시지 전송
      ws.send(
        JSON.stringify({
          type: 'connection',
          message: 'FINSIGHT-TRADE WebSocket 연결이 성공적으로 설정되었습니다.',
          timestamp: new Date().toISOString()
        })
      );

      // 클라이언트로부터 메시지 수신
      ws.on('message', message => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      });

      // 클라이언트 연결 해제
      ws.on('close', () => {
        console.log('클라이언트 연결 해제');
        this.clients.delete(ws);
        this.subscriptions.delete(ws); // ← 추가
      });

      // 오류 처리
      ws.on('error', error => {
        console.error('WebSocket 오류:', error);
        this.clients.delete(ws);
        this.subscriptions.delete(ws); // ← 추가
      });
    });

    // 실시간 데이터 전송 시작
    this.startRealTimeData();
  }

  // 메시지 처리
  handleMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        console.log(`클라이언트가 ${data.product_code || 'all'} 구독 요청`);

        // 클라이언트의 구독 심볼을 저장 (product_code 사용)
        if (data.product_code === 'all') {
          this.subscriptions.set(ws, 'all');
        } else {
          const current = this.subscriptions.get(ws) || new Set();
          current.add(data.product_code);
          this.subscriptions.set(ws, current);
        }

        // 응답 메시지 전송
        ws.send(
          JSON.stringify({
            type: 'subscription',
            product_code: data.product_code || 'all',
            message: '구독이 성공적으로 설정되었습니다.',
            timestamp: new Date().toISOString()
          })
        );
        break;

      case 'unsubscribe': {
        console.log(`클라이언트가 ${data.product_code} 구독 해제 요청`);

        const currentSub = this.subscriptions.get(ws);
        if (currentSub instanceof Set) {
          currentSub.delete(data.product_code);
          if (currentSub.size === 0) {
            this.subscriptions.delete(ws);
          }
        }

        ws.send(
          JSON.stringify({
            type: 'unsubscription',
            product_code: data.product_code,
            message: '구독이 해제되었습니다.',
            timestamp: new Date().toISOString()
          })
        );
        break;
      }

      case 'ping':
        ws.send(
          JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          })
        );
        break;

      default:
        console.log('알 수 없는 메시지 타입:', data.type);
    }
  }

  // 실시간 데이터 전송 시작
  startRealTimeData() {
    console.log('실시간 ETF 데이터 전송 시작...');

    this.dataInterval = setInterval(() => {
      const etfData = generateAllETFData();

      // 모든 연결된 클라이언트에게 데이터 전송
      this.broadcast({
        type: 'etf_data',
        data: etfData,
        timestamp: new Date().toISOString()
      });
    }, 1000); // 1초마다 업데이트 (ETF 시세는 1초마다 변동)
  }

  // 모든 클라이언트에게 메시지 브로드캐스트
  broadcast(message) {
    const fullData = message.data; // 전체 ETF 데이터
    const timestamp = message.timestamp;

    this.clients.forEach(client => {
      if (client.readyState !== WebSocket.OPEN) {
        this.clients.delete(client);
        this.subscriptions.delete(client); // 구독 정보도 제거
        return;
      }

      const sub = this.subscriptions.get(client);

      let filteredData;

      if (sub === 'all') {
        filteredData = fullData; // 전체 전송
      } else if (sub instanceof Set) {
        // 구독한 종목만 필터링 (product_code 기준)
        filteredData = fullData.filter(etf => sub.has(etf.product_code));
      } else {
        filteredData = []; // 구독 정보 없으면 전송 안 함
      }

      client.send(
        JSON.stringify({
          type: 'etf_data',
          data: filteredData,
          timestamp
        })
      );
    });
  }

  // 특정 클라이언트에게 메시지 전송
  sendToClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // 서버 중지
  stop() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
      console.log('실시간 데이터 전송 중지');
    }

    if (this.wss) {
      this.wss.close(() => {
        console.log('FINSIGHT-TRADE WebSocket 서버가 종료되었습니다.');
      });
    }
  }

  // 연결된 클라이언트 수 반환
  getClientCount() {
    return this.clients.size;
  }

  // 구독 정보 조회 (디버깅용)
  getSubscriptionInfo() {
    const info = {};
    this.subscriptions.forEach((sub, client) => {
      const clientId = client._socket?.remoteAddress || 'unknown';
      info[clientId] = sub === 'all' ? 'all' : Array.from(sub);
    });
    return info;
  }
}

module.exports = WebSocketServer;
