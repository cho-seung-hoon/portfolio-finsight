import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);
  const loadingText = ref('데이터를 불러오는 중...');
  const requestCount = ref(0);

  const startLoading = (text = '데이터를 불러오는 중...') => {
    requestCount.value++;

    if (requestCount.value === 1) {
      loadingText.value = text;
      isLoading.value = true;
    }
  };

  const stopLoading = () => {
    if (requestCount.value > 0) {
      requestCount.value--;
    }

    if (requestCount.value === 0) {
      isLoading.value = false;
    }
  };

  const resetLoading = () => {
    requestCount.value = 0;
    isLoading.value = false;
    loadingText.value = '데이터를 불러오는 중...';
  };

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    resetLoading
  };
});