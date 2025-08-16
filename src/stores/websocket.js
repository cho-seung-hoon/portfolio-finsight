import { defineStore } from 'pinia';
import { ref } from 'vue';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useSessionStore } from '@/stores/session.js';

export const useWebSocketStore = defineStore('websocket', () => {
  const sessionStore = useSessionStore();

  const client = ref(null);
  const isConnected = ref(false);
  const subscriptions = ref(new Map());
  const connectionAttempts = ref(0);
  const maxReconnectAttempts = 5;
  const isConnecting = ref(false);
  const connectionPromise = ref(null);

  const getConnectionStatus = () => isConnected.value;

  const connect = () => {
    const token = sessionStore.accessToken;

    if (!token) {
      console.warn('토큰이 없어 웹소켓 연결을 건너뜁니다.');
      return Promise.reject('No token');
    }

    if (isConnected.value) {
      console.log('이미 웹소켓에 연결되어 있습니다.');
      return Promise.resolve();
    }

    if (isConnecting.value && connectionPromise.value) {
      console.log('웹소켓 연결 중입니다. 기존 연결 대기 중...');
      return connectionPromise.value;
    }

    return new Promise((resolve, reject) => {
      try {
        isConnecting.value = true;
        connectionPromise.value = new Promise((innerResolve, innerReject) => {
          const socket = new SockJS(`http://localhost:8080/ws-etf`);

          client.value = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
              Authorization: `Bearer ${token}`
            },
            onConnect: () => {
              console.log('WebSocket 연결 성공');
              isConnected.value = true;
              isConnecting.value = false;
              connectionAttempts.value = 0;
              connectionPromise.value = null;
              innerResolve();
              resolve();
            },
            onDisconnect: () => {
              console.log('WebSocket 연결 해제');
              isConnected.value = false;
              isConnecting.value = false;
              connectionPromise.value = null;

              if (connectionAttempts.value < maxReconnectAttempts) {
                connectionAttempts.value++;
                console.log(`재연결 시도 ${connectionAttempts.value}/${maxReconnectAttempts}`);
                setTimeout(() => {
                  connect();
                }, 3000);
              }
            },
            onStompError: frame => {
              console.error('STOMP 에러:', frame);
              isConnected.value = false;
              isConnecting.value = false;
              connectionPromise.value = null;
              innerReject(frame);
              reject(frame);
            }
          });

          client.value.activate();
        });
      } catch (error) {
        isConnecting.value = false;
        connectionPromise.value = null;
        console.error('웹소켓 연결 실패:', error);
        reject(error);
      }
    });
  };

  const disconnect = () => {
    if (client.value) {
      unsubscribeAll();
      client.value.deactivate();
      client.value = null;
      isConnected.value = false;
      isConnecting.value = false;
      connectionAttempts.value = 0;
      connectionPromise.value = null;
      console.log('WebSocket 연결 해제 완료');
    }
  };

  const subscribe = (topic, callback, options = {}) => {
    if (!isConnected.value) {
      console.warn('웹소켓이 연결되지 않았습니다. 먼저 연결해주세요.');
      return null;
    }

    try {
      const subscription = client.value.subscribe(
        topic,
        message => {
          if (message.body) {
            const data = JSON.parse(message.body);
            callback(data);
          }
        },
        options
      );

      subscriptions.value.set(topic, { subscription, callback, options });
      console.log(`구독 성공: ${topic}`);
      return subscription;
    } catch (error) {
      console.error(`구독 실패: ${topic}`, error);
      return null;
    }
  };

  const unsubscribe = topic => {
    const subscriptionInfo = subscriptions.value.get(topic);

    if (subscriptionInfo && subscriptionInfo.subscription) {
      subscriptionInfo.subscription.unsubscribe();
      subscriptions.value.delete(topic);
      console.log(`구독 해제: ${topic}`);
    }
  };

  const unsubscribeAll = () => {
    subscriptions.value.forEach((subscriptionInfo, topic) => {
      if (subscriptionInfo.subscription) {
        subscriptionInfo.subscription.unsubscribe();
      }
    });
    subscriptions.value.clear();
    console.log('모든 구독 해제 완료');
  };

  const subscribeToEtf = async (productCode, callback) => {
    try {
      if (!isConnected.value) {
        console.log('웹소켓 연결이 안 되어 있습니다. 연결을 시도합니다.');
        await ensureConnection();
        
        if (!isConnected.value) {
          console.error('웹소켓 연결에 실패했습니다.');
          return null;
        }
      }

      return subscribe(`/topic/etf/${productCode}`, callback);
    } catch (error) {
      console.error('ETF 구독 실패:', error);
      return null;
    }
  };

  const ensureConnection = async () => {
    if (isConnected.value) {
      return Promise.resolve();
    }

    if (isConnecting.value && connectionPromise.value) {
      return connectionPromise.value;
    }

    return connect();
  };

  return {
    isConnected,
    subscriptions,
    getConnectionStatus,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    unsubscribeAll,
    subscribeToEtf,
    ensureConnection
  };
});
