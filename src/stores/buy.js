import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import Decimal from 'decimal.js';

export const useBuyStore = defineStore('buy', () => {
  const isLoading = ref(false);
  const error = ref(null);
  const buyResult = ref(null);

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
        historyId: `history-${Date.now()}`,
        holdingsId: `holding-${payload.code}`,
        historyTradeType: 'buy',
        historyTradeDate: new Date().toISOString().split('T')[0],
        historyQuantity: payload.quantity || 1,
        historyAmount:
          payload.amount || new Decimal(payload.quantity || 0).times(payload.price || 0).toNumber()
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
    buyProduct
  };
});
