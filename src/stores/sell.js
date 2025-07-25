import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // axios 임포트

export const useSellStore = defineStore('sell', () => {
  const isLoading = ref(false);
  const error = ref(null);
  const sellResult = ref(null);
  const productInfo = ref(null);

  // 더미 상품 데이터
  const mockProducts = {
    'fund-001': {
      title: 'KODEX 200',
      price: 10000,
      code: 'fund-001',
      date: '2025-07-12T09:30:00',
      holdingQuantity: 30
    },
    'fund-002': {
      title: 'TIGER 미국S&P500',
      price: 25000,
      code: 'fund-002',
      date: '2025-07-13T15:45:00',
      holdingQuantity: 15
    },
    'etf-001': {
      title: 'TIGER 미국S&P500',
      price: 12000,
      code: 'etf-001',
      date: '2025-07-14T11:20:00',
      holdingQuantity: 20
    },
    'etf-002': {
      title: 'KODEX 200',
      price: 11000,
      code: 'etf-002',
      date: '2025-07-15T13:10:00',
      holdingQuantity: 10
    },
    'deposit-001': {
      title: '신한 정기예금',
      amount: 5000000,
      code: 'deposit-001',
      date: '2025-08-01',
      maturityDate: '2026-08-01'
    }
  };

  // 상품 정보 fetch (종목코드로)
  async function fetchProduct(productId) {
    isLoading.value = true;
    error.value = null;
    try {
      // 실제 API 연동 코드 (주석처리)
      // const response = await axios.get(`/api/products/${productId}`);
      // productInfo.value = response.data;

      // 더미 데이터로 동작
      await new Promise(resolve => setTimeout(resolve, 200));
      if (mockProducts[productId]) {
        productInfo.value = {
          ...mockProducts[productId]
        };
      } else {
        throw new Error('상품을 찾을 수 없습니다.');
      }
    } catch (e) {
      error.value = e.message;
      productInfo.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 매도 요청 (더미 데이터 반환)
   */
  async function sellProduct(payload) {
    isLoading.value = true;
    error.value = null;
    sellResult.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      let dummy;
      if (payload.category === 'FUND' || payload.category === 'ETF') {
        dummy = {
          message: '매도 성공',
          holdingId: 'HOLDING-1234',
          remainingQuantity: Math.max(0, (payload.quantity && 100 - payload.quantity) || 0)
        };
      } else if (payload.category === 'DEPOSIT') {
        dummy = {
          message: '매도 성공',
          holdingId: 'HOLDING-5678',
          remainingAmount: Math.max(0, (payload.amount && 5000000 - payload.amount) || 0)
        };
      }
      sellResult.value = dummy;
      return dummy;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    sellResult,
    productInfo,
    fetchProduct,
    sellProduct
  };
});
