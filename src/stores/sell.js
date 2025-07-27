import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // axios 임포트

export const useSellStore = defineStore('sell', () => {
  const isLoading = ref(false);
  const error = ref(null);
  const sellResult = ref(null);

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
          historyId: `history-${Date.now()}`,
          holdingsId: `holding-${payload.code}`,
          historyTradeType: 'sell',
          historyTradeDate: new Date().toISOString().split('T')[0],
          historyQuantity: payload.quantity,
          historyAmount: payload.quantity * (payload.price || 0),
          remainingQuantity: Math.max(0, (payload.quantity && 100 - payload.quantity) || 0)
        };
      } else if (payload.category === 'DEPOSIT') {
        dummy = {
          message: '매도 성공',
          historyId: `history-${Date.now()}`,
          holdingsId: `holding-${payload.code}`,
          historyTradeType: 'deposit',
          historyTradeDate: new Date().toISOString().split('T')[0],
          historyQuantity: 1,
          historyAmount: payload.amount || 0,
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
    sellProduct
  };
});
