import { useWebSocketStore } from '@/stores/websocket';

export function useProductSubscription() {
  const webSocketStore = useWebSocketStore();

  // 상품코드 정규화 함수
  const normalizeProductCode = code => {
    if (!code) return '';
    return code.toString().toLowerCase().replace(/\s/g, '').trim();
  };

  /**
   * 백엔드에서 받은 상품 리스트로 웹소켓 구독
   * @param {Array<string>} productCodes - 상품 코드 배열
   * @param {Function} callback - 데이터 수신 시 호출될 콜백 함수
   * @returns {Promise<Array>} 구독 정보 배열
   */
  const subscribeToProducts = async (productCodes, callback) => {
    const subscriptions = [];

    try {
      // 구독 시도 시 연결 상태 확인 및 대기
      await webSocketStore.ensureConnection();

      for (const code of productCodes) {
        try {
          const subscription = webSocketStore.subscribeToEtf(code, data => {
            callback(data, code);
          });

          if (subscription) {
            subscriptions.push({ code, subscription });
            console.log(`[SUBSCRIBE SUCCESS] 상품 ${code}`);
          }
        } catch (error) {
          console.error(`[SUBSCRIBE FAIL] 상품 ${code}:`, error);
        }
      }
    } catch (error) {
      console.error('[SUBSCRIBE ERROR] 웹소켓 연결 실패:', error);
    }

    return subscriptions;
  };

  /**
   * 단일 상품 구독
   * @param {string} productCode - 상품 코드
   * @param {Function} callback - 데이터 수신 시 호출될 콜백 함수
   * @returns {Promise<Object|null>} 구독 정보
   */
  const subscribeToSingleProduct = async (productCode, callback) => {
    try {
      await webSocketStore.ensureConnection();

      const subscription = webSocketStore.subscribeToEtf(productCode, data => {
        callback(data, productCode);
      });

      if (subscription) {
        console.log(`[SINGLE SUBSCRIBE SUCCESS] 상품 ${productCode}`);
        return { code: productCode, subscription };
      }
    } catch (error) {
      console.error(`[SINGLE SUBSCRIBE FAIL] 상품 ${productCode}:`, error);
    }

    return null;
  };

  /**
   * 상품 리스트에 웹소켓 데이터 연결
   * @param {Array} productList - 상품 리스트 배열
   * @param {Function} updateCallback - 상품 데이터 업데이트 콜백
   * @returns {Promise<Array>} 구독 정보 배열
   */
  const connectProductsToWebSocket = async (productList, updateCallback) => {
    const subscriptions = [];

    try {
      await webSocketStore.ensureConnection();

      for (const product of productList) {
        if (product.product_code) {
          try {
            const subscription = webSocketStore.subscribeToEtf(product.product_code, data => {
              // 상품 데이터에 웹소켓 데이터 병합
              const updatedProduct = {
                ...product,
                currentPrice: data?.current_price || data?.price || product.currentPrice,
                changeRate: data?.change_rate1s || data?.changeRate || product.changeRate,
                volume: data?.current_volume || data?.volume || product.volume,
                tradeAmount: data?.trade_amount || data?.tradeAmount || product.tradeAmount,
                marketCap: data?.market_cap || data?.marketCap || product.marketCap,
                lastUpdate: data?.timestamp || data?.time || new Date().toISOString()
              };

              updateCallback(updatedProduct, product.product_code);
            });

            if (subscription) {
              subscriptions.push({ code: product.product_code, subscription });
              console.log(`[CONNECT SUCCESS] 상품 ${product.product_code}`);
            }
          } catch (error) {
            console.error(`[CONNECT FAIL] 상품 ${product.product_code}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('[CONNECT ERROR] 웹소켓 연결 실패:', error);
    }

    return subscriptions;
  };

  /**
   * 새로운 상품들 추가 시 구독 연결
   * @param {Array} newProducts - 새로 추가된 상품 리스트
   * @param {Function} updateCallback - 상품 데이터 업데이트 콜백
   * @returns {Promise<Array>} 새로 추가된 구독 정보 배열
   */
  const addProductsSubscription = async (newProducts, updateCallback) => {
    return await connectProductsToWebSocket(newProducts, updateCallback);
  };

  /**
   * 상품코드로 상품 찾기 (안전한 비교)
   * @param {Array} productList - 상품 리스트
   * @param {string} productCode - 찾을 상품 코드
   * @returns {number} 상품 인덱스 (-1이면 찾지 못함)
   */
  const findProductIndex = (productList, productCode) => {
    if (!productCode) return -1;

    const normalizedCode = normalizeProductCode(productCode);

    return productList.findIndex(
      product => normalizeProductCode(product.product_code) === normalizedCode
    );
  };

  /**
   * 특정 상품들의 구독 해제
   * @param {Array<string>} productCodes
   */
  const unsubscribeFromProducts = productCodes => {
    productCodes.forEach(code => {
      webSocketStore.unsubscribe(`/topic/etf/${code}`);
      console.log(`[UNSUBSCRIBE] 상품 ${code}`);
    });
  };

  /**
   * 단일 상품 구독 해제
   * @param {string} productCode
   */
  const unsubscribeFromSingleProduct = productCode => {
    webSocketStore.unsubscribe(`/topic/etf/${productCode}`);
    console.log(`[SINGLE UNSUBSCRIBE] 상품 ${productCode}`);
  };

  /**
   * 모든 구독 해제
   */
  const unsubscribeAll = () => {
    webSocketStore.unsubscribeAll();
    console.log('[UNSUBSCRIBE ALL]');
  };

  /**
   * 웹소켓 연결 상태 확인
   */
  const isConnected = () => {
    return webSocketStore.isConnected;
  };

  /**
   * 연결 상태 확인 및 대기
   */
  const ensureConnection = async () => {
    return await webSocketStore.ensureConnection();
  };

  return {
    subscribeToProducts,
    subscribeToSingleProduct,
    connectProductsToWebSocket,
    addProductsSubscription,
    findProductIndex,
    unsubscribeFromProducts,
    unsubscribeFromSingleProduct,
    unsubscribeAll,
    isConnected,
    ensureConnection
  };
}
