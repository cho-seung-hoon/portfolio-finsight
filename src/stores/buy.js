import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useBuyStore = defineStore('buy', () => {
  const isLoading = ref(false);
  const error = ref(null);
  const buyResult = ref(null);
  const productInfo = ref(null);

  // 더미 상품 데이터
  const mockProducts = {
    'fund-001': {
      title: 'KODEX 200',
      price: 10000,
      code: 'fund-001',
      date: '2025-07-12T09:30:00'
    },
    'fund-002': {
      title: 'TIGER 미국S&P500',
      price: 25000,
      code: 'fund-002',
      date: '2025-07-13T15:45:00'
    },
    'etf-001': {
      title: 'TIGER 미국S&P500',
      price: 12000,
      code: 'etf-001',
      date: '2025-07-14T11:20:00'
    },
    'etf-002': {
      title: 'KODEX 200',
      price: 11000,
      code: 'etf-002',
      date: '2025-07-15T13:10:00'
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
   * 매수 요청 (더미 데이터 반환)
   */
  async function buyProduct(payload) {
    isLoading.value = true;
    error.value = null;
    buyResult.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const dummy = {
        message: '매수 성공',
        holdingId: 'HOLDING-5678'
      };
      buyResult.value = dummy;
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
    buyResult,
    productInfo,
    fetchProduct,
    buyProduct
  };
});
