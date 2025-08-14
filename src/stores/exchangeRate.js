import { defineStore } from 'pinia';
import { ref } from 'vue';
import { exchangeRate } from '@/api/exchangeRate.js';
import { useLoadingStore } from '@/stores/loading';

export const useExchangeRateStore = defineStore('exchangeRate', () => {
  const processedData = ref([]);
  const displayDate = ref('');
  const lastFetchTimestamp = ref(null);

  function isDataStale() {
    const now = new Date(); // 현재 시간

    if (!lastFetchTimestamp.value) {
      return true;
    }

    const lastFetch = lastFetchTimestamp.value;

    if (lastFetch.getDate() !== now.getDate()) {
      return true;
    }

    const KST_CUTOFF_HOUR = 11;

    if (lastFetch.getHours() < KST_CUTOFF_HOUR && now.getHours() >= KST_CUTOFF_HOUR) {
      return true;
    }

    return false;
  }

  async function fetchExchangeData() {
    if (!isDataStale()) {
      return;
    }

    const loadingStore = useLoadingStore();
    loadingStore.startLoading('환율 정보를 불러오는 중...');

    try {
      const responseData = await exchangeRate();

      processedData.value.splice(0, processedData.value.length, ...responseData.rates);
      displayDate.value = responseData.displayDate;

      lastFetchTimestamp.value = new Date();

    } catch (error) {
      console.error('환율 데이터 처리 중 오류 발생:', error);
    } finally {
      loadingStore.stopLoading();
    }
  }

  return { processedData, displayDate, fetchExchangeData };
});