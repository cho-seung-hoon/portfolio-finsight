const WebSocket = require('ws');

let wss;

function startWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('WebSocket connected');

    // 연결 메시지 전송
    ws.send(
      JSON.stringify({
        type: 'connection',
        message: 'Connected to WebSocket',
        timestamp: new Date().toISOString()
      })
    );

    // 클라이언트 연결 해제 시 처리
    ws.on('close', () => {
      console.log('WebSocket disconnected');
    });

    ws.on('error', error => {
      console.error('WebSocket error:', error);
    });
  });
}

// ETF 데이터 브로드캐스트 (시세와 거래량만 전송)
function broadcastETFData(etfDataArray) {
  if (!wss) return;

  // 시세와 거래량만 포함한 데이터 생성
  const simplifiedData = etfDataArray.map(etf => ({
    product_code: etf.product_code,
    price: etf.price,
    volume: etf.volume,
    timestamp: etf.timestamp
  }));

  const message = JSON.stringify({
    type: 'etf_data',
    data: simplifiedData,
    timestamp: new Date().toISOString()
  });

  // 모든 연결된 클라이언트에게 전송
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 기존 broadcastData 함수 (하위 호환성 유지)
function broadcastData(data) {
  if (!wss) return;

  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 연결된 클라이언트 수 조회
function getConnectedClientsCount() {
  return wss ? wss.clients.size : 0;
}

module.exports = {
  startWebSocketServer,
  broadcastData, // 기존 함수 (하위 호환성)
  broadcastETFData, // ETF 데이터 브로드캐스트 (시세와 거래량만)
  getConnectedClientsCount
};
