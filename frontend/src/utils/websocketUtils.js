import { useWebSocketStore } from '@/stores/websocket';

/**
 * ETF 실시간 데이터 구독 (연결 상태 확인 후 구독)
 * @param {string} productCode - 상품 코드
 * @param {function} callback - 데이터 수신 시 호출될 콜백 함수
 * @returns {Promise<object|null>} 구독 객체 또는 null
 */
export const subscribeToEtfPrice = async (productCode, callback) => {
  const webSocketStore = useWebSocketStore();

  try {
    // 구독 시도 시 연결 상태 확인 및 대기
    await webSocketStore.ensureConnection();
    return webSocketStore.subscribeToEtf(productCode, callback);
  } catch (err) {
    console.warn('ETF 구독 실패:', err);
    return null;
  }
};

/**
 * 특정 토픽 구독
 * @param {string} topic - 예: "/topic/etf/269530"
 * @param {function} callback - 메시지 수신 시 콜백
 * @param {object} options - STOMP subscribe 옵션 (선택)
 * @returns {Promise<object|null>} 구독 객체 또는 null
 */
export const subscribeToTopic = async (topic, callback, options = {}) => {
  const webSocketStore = useWebSocketStore();

  try {
    // 구독 시도 시 연결 상태 확인 및 대기
    await webSocketStore.ensureConnection();
    return webSocketStore.subscribe(topic, callback, options);
  } catch (err) {
    console.warn(`토픽 구독 실패: ${topic}`, err);
    return null;
  }
};

// 특정 토픽 구독 해제
export const unsubscribeFromTopic = topic => {
  const webSocketStore = useWebSocketStore();
  webSocketStore.unsubscribe(topic);
};

// 모든 구독 해제
export const unsubscribeAll = () => {
  const webSocketStore = useWebSocketStore();
  webSocketStore.unsubscribeAll();
};

// 웹소켓 연결 상태 확인
export const isWebSocketConnected = () => {
  const webSocketStore = useWebSocketStore();
  return webSocketStore.isConnected;
};

// 웹소켓 수동 연결
export const connectWebSocket = async () => {
  const webSocketStore = useWebSocketStore();
  await webSocketStore.connect();
};

// 웹소켓 연결 해제
export const disconnectWebSocket = () => {
  const webSocketStore = useWebSocketStore();
  webSocketStore.disconnect();
};

// 연결 상태 확인 및 대기
export const ensureWebSocketConnection = async () => {
  const webSocketStore = useWebSocketStore();
  return await webSocketStore.ensureConnection();
};
