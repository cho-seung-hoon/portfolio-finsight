<template>
  <div class="etf-page">
    <LoadingSpinner v-if="isLoading" />
    <div
      v-else-if="error"
      class="error-message">
      {{ error }}
    </div>
    <div
      v-else-if="productInfo"
      class="etf-content">
      <DetailMainEtf :product-info="productInfo" />
      <DetailTabs
        :tabs="tabs"
        :selected-tab="selectedTab"
        @update:selected-tab="selectTab" />
      <DetailSection
        :tab-data="tabData"
        :selected-tab="selectedTab"
        category="etf" />
      <DetailActionButton
        :product-info="productInfo"
        @buy-click="handleBuyClick"
        @sell-click="handleSellClick" />
    </div>

    <!-- 모달 컴포넌트들 -->
    <FundEtfBuyModal
      ref="buyModalRef"
      :product-info="productInfo"
      @submit="handleBuySubmit"
      @close="handleModalClose" />
    <FundEtfSellModal
      ref="sellModalRef"
      :product-info="productInfo"
      @submit="handleSellSubmit"
      @close="handleModalClose" />

    <!-- 토스트 메시지 -->
    <ToastMessage
      v-if="toastConfig.show"
      :key="toastConfig.message + (toastConfig.timestamp || '')"
      :message="toastConfig.message"
      :type="toastConfig.type"
      :timestamp="toastConfig.timestamp"
      :duration="3000" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEtfStore } from '@/stores/etf';
import { purchaseProduct, sellProduct } from '@/api/tradeApi';
import { useProductSubscription } from '@/composables/useProductSubscription';
import { storeToRefs } from 'pinia';

import DetailMainEtf from '@/components/detail/DetailMainEtf.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import FundEtfBuyModal from '@/components/buysell/FundEtfBuyModal.vue';
import FundEtfSellModal from '@/components/buysell/FundEtfSellModal.vue';
import ToastMessage from '@/components/common/ToastMessage.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const route = useRoute();

const etfStore = useEtfStore();
const { productInfo, isLoading, error, isYieldHistoryLoaded, isYieldHistoryLoading } =
  storeToRefs(etfStore);

// 웹소켓 구독 관련
const { subscribeToSingleProduct, unsubscribeFromSingleProduct, isConnected } =
  useProductSubscription();
const isWebSocketConnected = ref(false);
const currentSubscription = ref(null);
const isSubscribed = ref(false); // 구독 상태 추적

// 모달 상태 관리
const isModalOpen = ref(false);

// 모달 refs
const buyModalRef = ref(null);
const sellModalRef = ref(null);

// 모달 닫기 중복 방지
const isClosing = ref(false);

// 거래 진행 중 플래그 (중복 거래 방지)
const isTransactionInProgress = ref(false);

// 토스트 설정
const toastConfig = ref({
  show: false,
  message: '',
  type: 'success'
});

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    etfStore.fetchProduct(productId);
    // 페이지 새로고침 시 수익률 히스토리 초기화
    etfStore.resetYieldHistory();
  } else {
    // 상품 ID가 URL에 없습니다.
  }
});

// 웹소켓 연결 상태 모니터링
watch(isConnected, connected => {
  isWebSocketConnected.value = connected;
});

// 상품 정보가 로드되면 웹소켓 구독 시작
watch(
  productInfo,
  async newProductInfo => {
    if (newProductInfo?.productCode && !isSubscribed.value) {
      console.log('[ETF DETAIL] 웹소켓 구독 시작');
      await startWebSocketSubscription(newProductInfo.productCode);
    }
  },
  { immediate: true }
);

// 웹소켓 구독 시작 (함수 선언으로 호이스팅 보장)
async function startWebSocketSubscription(productCode) {
  try {
    // 이미 구독 중이면 중복 구독 방지
    if (isSubscribed.value) {
      console.log(`[ETF DETAIL] 이미 구독 중: ${productCode}`);
      return;
    }

    // 새로운 구독 시작
    const subscription = await subscribeToSingleProduct(productCode, handleWebSocketData);
    if (subscription) {
      currentSubscription.value = subscription;
      isSubscribed.value = true;
      console.log(`[ETF DETAIL] 상품 ${productCode} 웹소켓 구독 시작`);
    }
  } catch (error) {
    console.error(`[ETF DETAIL] 웹소켓 구독 실패:`, error);
  }
}

// 웹소켓 데이터 처리
const handleWebSocketData = (data, productCode) => {
  console.log(`[ETF DETAIL] 웹소켓 데이터 수신:`, data);

  // 실시간 데이터로 store 업데이트
  if (data) {
    etfStore.updateRealtimeData(data);
  }
};

// 컴포넌트 언마운트 시 웹소켓 구독 해제
onUnmounted(() => {
  if (currentSubscription.value && isSubscribed.value) {
    unsubscribeFromSingleProduct(currentSubscription.value.code);
    isSubscribed.value = false;
    currentSubscription.value = null;
    console.log(`[ETF DETAIL] 웹소켓 구독 해제`);
  }
});

// 토스트 메시지 표시 함수
const showToast = (message, type = 'success', timestamp = null) => {
  // 기존 토스트를 먼저 숨김
  toastConfig.value.show = false;

  // 다음 틱에서 새로운 토스트 표시
  nextTick(() => {
    toastConfig.value = {
      show: true,
      message,
      type,
      timestamp
    };
  });
};

const tabs = computed(() => {
  if (
    productInfo.value?.isHolding &&
    productInfo.value?.holding &&
    productInfo.value?.holding.length > 0 &&
    productInfo.value?.holdingsTotalQuantity > 0
  ) {
    return [
      { key: 'holding', label: '보유기록' },
      { key: 'info', label: '상품안내' },
      { key: 'yield', label: '수익률' },
      { key: 'composition', label: '구성종목' },
      { key: 'news', label: '뉴스' }
    ];
  }
  return [
    { key: 'info', label: '상품안내' },
    { key: 'yield', label: '수익률' },
    { key: 'composition', label: '구성종목' },
    { key: 'news', label: '뉴스' }
  ];
});

const selectedTab = ref('info');
const selectTab = async tab => {
  console.log('selectTab called with tab:', tab);
  console.log('isYieldHistoryLoaded:', isYieldHistoryLoaded.value);
  console.log('isYieldHistoryLoading:', isYieldHistoryLoading.value);

  selectedTab.value = tab;

  // 수익률 탭을 처음 클릭할 때만 API 호출
  if (tab === 'yield' && !isYieldHistoryLoaded.value && !isYieldHistoryLoading.value) {
    const productId = route.params.id;
    console.log('Fetching yield history for productId:', productId);
    if (productId) {
      try {
        await etfStore.fetchYieldHistory(productId);
        console.log('Yield history fetched successfully');
      } catch (error) {
        console.error('Failed to fetch yield history:', error);
      }
    }
  }
};

// productInfo가 변경될 때 보유기록 탭이 있으면 자동으로 첫 번째 탭 선택
watch(
  productInfo,
  (newProductInfo, oldProductInfo) => {
    // 보유 중인 상품이고 보유수량이 0보다 크고 holdingsStatus가 "zero"가 아닐 때만 holding으로 변경
    if (
      newProductInfo?.isHolding &&
      (newProductInfo?.holdings || newProductInfo?.holding) &&
      (newProductInfo?.holdings?.holdingsTotalQuantity > 0 || newProductInfo?.holding?.holdingsTotalQuantity > 0) &&
      (newProductInfo?.holdings?.holdingsStatus !== 'zero' || newProductInfo?.holding?.holdingsStatus !== 'zero') &&
      (!oldProductInfo || !oldProductInfo.isHolding) &&
      selectedTab.value === 'info'
    ) {
      selectedTab.value = 'holding';
    }
  },
  { immediate: true }
);

// tabData를 computed로 변경하여 productId를 전달
const tabData = computed(() => {
  return etfStore.tabData;
});

// 구매 버튼 클릭 처리
const handleBuyClick = async data => {
  if (isTransactionInProgress.value) {
    showToast('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.', 'warning');
    return;
  }
  isModalOpen.value = true;
  buyModalRef.value?.openModal();
};

// 판매 버튼 클릭 처리
const handleSellClick = async data => {
  if (isTransactionInProgress.value) {
    showToast('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.', 'warning');
    return;
  }
  isModalOpen.value = true;
  sellModalRef.value?.openModal();
};

// 모달 닫기 처리
const handleModalClose = () => {
  if (isClosing.value) {
    return;
  }
  isClosing.value = true;

  isModalOpen.value = false;
  buyModalRef.value?.closeModal();
  sellModalRef.value?.closeModal();
  showToast('거래가 취소되었습니다.', 'cancel');

  // 거래 진행 중 플래그 초기화
  isTransactionInProgress.value = false;

  // 100ms 후에 닫기 상태 초기화
  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

// 상품 데이터 새로고침 함수
const refreshProductData = async () => {
  try {
    const productId = route.params.id;
    if (productId) {
      await etfStore.fetchProduct(productId);
      // 새로고침 후 보유기록 탭이 있으면 해당 탭으로, 없으면 상품안내 탭으로
      if (productInfo.value?.isHolding && 
          (productInfo.value?.holdings || productInfo.value?.holding) && 
          (productInfo.value?.holdings?.holdingsTotalQuantity > 0 || productInfo.value?.holding?.holdingsTotalQuantity > 0) && 
          (productInfo.value?.holdings?.holdingsStatus !== 'zero' || productInfo.value?.holding?.holdingsStatus !== 'zero')) {
        selectedTab.value = 'holding';
      } else {
        selectedTab.value = 'info';
      }
    }
  } catch (error) {
    console.error('상품 데이터 새로고침 중 오류 발생:', error);
  }
};

// 구매 제출 처리
const handleBuySubmit = async formData => {
  try {
    // 거래 진행 중 플래그 설정
    isTransactionInProgress.value = true;
    
    // 모달에서 API 호출 결과를 받아서 처리
    if (formData.success) {
      // 성공인 경우
      handleModalClose();
      const timestamp = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      showToast('ETF 구매가 완료되었습니다.', 'success', timestamp);

      // 상품 데이터 새로고침
      await refreshProductData();
    } else {
      // 실패인 경우
      showToast(`ETF 구매에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('ETF 구매 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    // 거래 진행 중 플래그 초기화
    isTransactionInProgress.value = false;
  }
};

// 판매 제출 처리
const handleSellSubmit = async formData => {
  try {
    // 거래 진행 중 플래그 설정
    isTransactionInProgress.value = true;
    
    // 모달에서 API 호출 결과를 받아서 처리
    if (formData.success) {
      // 성공인 경우
      handleModalClose();
      const timestamp = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      showToast('ETF 판매가 완료되었습니다.', 'success', timestamp);

      // 상품 데이터 새로고침
      await refreshProductData();
    } else {
      // 실패인 경우
      showToast(`ETF 판매에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('ETF 판매 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    // 거래 진행 중 플래그 초기화
    isTransactionInProgress.value = false;
  }
};

// 하트 토글 처리
const handleHeartToggle = async isActive => {
  try {
    // TODO: API 호출하여 찜 상태 변경
    // await etfStore.toggleWatch(productInfo.value.productCode, isActive);

    const message = isActive ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.';
    showToast(message, 'success');
  } catch (error) {
    showToast('찜 상태 변경에 실패했습니다. 다시 시도해주세요.', 'error');
    showToast('ETF 매도에 실패했습니다. 다시 시도해주세요.', 'error');
  }
};
</script>

<style scoped>
.etf-page {
  min-height: 100vh;
  background: var(--main05);
}

.etf-content {
  position: relative;
}

.error-message {
  text-align: center;
  padding: 40px;
  color: var(--error);
  font-size: 16px;
}
</style>
