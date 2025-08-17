<template>
  <div class="etf-page">
    <div
      v-if="error"
      class="error-message">
      {{ error }}
    </div>
    <div
      v-else-if="productInfo"
      class="etf-content">
      <DetailMainEtf
        :product-info="productInfo"
        :realtime-data="realtimeData"
        :change-rate-from-prev-day="
          productInfo?.price?.priceChangePercent || productInfo?.changeRateFromPrevDay
        "
        :product-code="productInfo?.productCode"
        :is-watched="productInfo?.isWatched || false" />
      <DetailTabs
        :tabs="tabs"
        :selected-tab="selectedTab"
        @update:selected-tab="selectTab" />
      <DetailSection
        :tab-data="tabData"
        :selected-tab="selectedTab"
        category="etf"
        :realtime-data="realtimeData" />
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
import { storeToRefs } from 'pinia';
import { useProductSubscription } from '@/composables/useProductSubscription';

import DetailMainEtf from '@/components/detail/DetailMainEtf.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import FundEtfBuyModal from '@/components/buysell/FundEtfBuyModal.vue';
import FundEtfSellModal from '@/components/buysell/FundEtfSellModal.vue';
import ToastMessage from '@/components/common/ToastMessage.vue';

const route = useRoute();

const etfStore = useEtfStore();
const { productInfo, error, isYieldHistoryLoaded, isYieldHistoryLoading } = storeToRefs(etfStore);

// 모달 상태 관리
const isModalOpen = ref(false);

// 모달 refs
const buyModalRef = ref(null);
const sellModalRef = ref(null);

// 모달 닫기 중복 방지
const isClosing = ref(false);

// 거래 진행 중 플래그 (중복 거래 방지)
const isTransactionInProgress = ref(false);

// 실시간 웹소켓 데이터
const realtimeData = ref(null);

// 웹소켓 구독 상태
const {
  isSubscribed,
  currentSubscription,
  subscribeToSingleProduct,
  unsubscribeFromSingleProduct
} = useProductSubscription();

// 토스트 설정
const toastConfig = ref({
  show: false,
  message: '',
  type: 'success'
});

onMounted(() => {
  const productCode = route.params.productCode;
  if (productCode) {
    console.log('[ETF DETAIL] 상품 코드:', productCode);
    etfStore.fetchProduct(productCode);
    etfStore.fetchYieldHistory(productCode);
  }
});

// 상품 정보 로드 시 웹소켓 구독 시작
watch(productInfo, async newProductInfo => {
  if (newProductInfo?.productCode && !isSubscribed.value) {
    try {
      await startWebSocketSubscription(newProductInfo.productCode);
    } catch (error) {
      console.error('[ETF DETAIL] 웹소켓 구독 실패:', error);
    }
  }
});

// 웹소켓 구독 시작
async function startWebSocketSubscription(productCode) {
  try {
    if (isSubscribed.value) return;

    const subscription = await subscribeToSingleProduct(productCode, handleWebSocketData);
    if (subscription) {
      currentSubscription.value = subscription;
      isSubscribed.value = true;
    }
  } catch (error) {
    console.error(`[ETF DETAIL] 웹소켓 구독 실패:`, error);
  }
}

// 웹소켓 데이터 처리
const handleWebSocketData = data => {
  if (data) {
    realtimeData.value = data;
    etfStore.updateRealtimeData(data);
  }
};

// 컴포넌트 언마운트 시 웹소켓 구독 해제
onUnmounted(() => {
  if (currentSubscription.value && isSubscribed.value) {
    unsubscribeFromSingleProduct(currentSubscription.value.code);
    isSubscribed.value = false;
    currentSubscription.value = null;
  }
});

// 토스트 메시지 표시 함수
const showToast = (message, type = 'success', timestamp = null) => {
  toastConfig.value.show = false;

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
  if (!productInfo.value) {
    return [
      { key: 'info', label: '상품안내' },
      { key: 'yield', label: '수익률' },
      { key: 'composition', label: '구성종목' },
      { key: 'news', label: '뉴스' }
    ];
  }

  // 보유 수량이 있으면 보유기록 탭 추가
  const hasHoldings =
    productInfo.value.isHolding &&
    productInfo.value.holding?.length > 0 &&
    productInfo.value.holdingsTotalQuantity > 0;

  if (hasHoldings) {
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

  if (tab === 'yield' && !isYieldHistoryLoaded.value && !isYieldHistoryLoading.value) {
    const productCode = route.params.productCode;
    console.log('Fetching yield history for productCode:', productCode);
    if (productCode) {
      try {
        await etfStore.fetchYieldHistory(productCode);
        console.log('Yield history fetched successfully');
      } catch (error) {
        console.error('Failed to fetch yield history:', error);
      }
    }
  }
};

// 보유기록이 생기면 자동으로 보유기록 탭 선택
watch(productInfo, (newProductInfo, oldProductInfo) => {
  const hasNewHoldings =
    newProductInfo?.isHolding &&
    newProductInfo.holding?.length > 0 &&
    newProductInfo.holdingsTotalQuantity > 0;

  const hadOldHoldings = oldProductInfo?.isHolding;

  if (hasNewHoldings && !hadOldHoldings && selectedTab.value === 'info') {
    selectedTab.value = 'holding';
  }
});

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

  isTransactionInProgress.value = false;

  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

// 상품 데이터 새로고침
const refreshProductData = async () => {
  try {
    const productId = route.params.id;
    if (productId) {
      await etfStore.fetchProduct(productId);
      await etfStore.fetchYieldHistory(productId);

      // 보유 수량에 따라 탭 선택
      const hasHoldings =
        productInfo.value?.isHolding &&
        (productInfo.value?.holdings || productInfo.value?.holding)?.holdingsTotalQuantity > 0;

      selectedTab.value = hasHoldings ? 'holding' : 'info';
    }
  } catch (error) {
    console.error('상품 데이터 새로고침 중 오류 발생:', error);
  }
};

// 구매 제출 처리
const handleBuySubmit = async formData => {
  try {
    isTransactionInProgress.value = true;

    if (formData.success) {
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

      await refreshProductData();
    } else {
      showToast(`ETF 구매에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('ETF 구매 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    isTransactionInProgress.value = false;
  }
};

// 판매 제출 처리
const handleSellSubmit = async formData => {
  try {
    isTransactionInProgress.value = true;

    if (formData.success) {
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

      await refreshProductData();
    } else {
      showToast(`ETF 판매에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('ETF 판매 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    isTransactionInProgress.value = false;
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
  font-size: var(--font-size-md);
}
</style>
