import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);
  const loadingText = ref('데이터를 불러오는 중...');

  const startLoading = (text = '데이터를 불러오는 중...') => {
    console.log('startLoading 호출됨 - text:', text);
    loadingText.value = text;
    isLoading.value = true;
    console.log('startLoading 완료 - isLoading:', isLoading.value);
  };

  const stopLoading = () => {
    console.log('stopLoading 호출됨');
    isLoading.value = false;
    console.log('stopLoading 완료 - isLoading:', isLoading.value);
  };

  const resetLoading = () => {
    console.log('resetLoading 호출됨');
    isLoading.value = false;
    loadingText.value = '데이터를 불러오는 중...';
    console.log('resetLoading 완료');
  };

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    resetLoading
  };
});
