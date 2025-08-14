import { defineStore } from 'pinia';
import { ref } from 'vue';
import { exchangeRate } from '@/api/exchangeRate.js';
import { useLoadingStore } from '@/stores/loading';

export const useExchangeRateStore = defineStore('exchangeRate', () => {
  const processedData = ref([]);
  const displayDate = ref('');

  async function fetchExchangeData() {
    if (processedData.value.length > 0) {
      return;
    }

    const loadingStore = useLoadingStore(); // 2. 로딩 스토어 인스턴스를 가져옵니다.
    loadingStore.startLoading('환율 정보를 불러오는 중...');

    try {
      const responseData = await exchangeRate();

      processedData.value.splice(0, processedData.value.length, ...responseData.rates);
      displayDate.value = responseData.displayDate;

    } catch (error) {
      console.error('환율 데이터 처리 중 오류 발생:', error);
    } finally {
      loadingStore.stopLoading();
    }
  }

  return { processedData, displayDate, fetchExchangeData };
});