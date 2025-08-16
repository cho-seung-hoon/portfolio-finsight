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
        :change-rate-from-prev-day="productInfo?.price?.priceChangePercent || productInfo?.changeRateFromPrevDay" />
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
const { productInfo, error, isYieldHistoryLoaded, isYieldHistoryLoading } =
  storeToRefs(etfStore);

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
  const productId = route.params.id;
  if (productId) {
    etfStore.fetchProduct(productId);
    etfStore.fetchYieldHistory(productId);
  }
});

// 상품 정보가 로드되면 웹소켓 구독 시작
watch(
  productInfo,
  async (newProductInfo, oldProductInfo) => {
    if (newProductInfo && newProductInfo.productCode && !isSubscribed.value) {
      console.log('[ETF DETAIL] 웹소켓 구독 시작');
      try {
        await startWebSocketSubscription(newProductInfo.productCode);
      } catch (error) {
        console.error('[ETF DETAIL] 웹소켓 구독 실패:', error);
      }
    }
  }
);

// 웹소켓 구독 시작
async function startWebSocketSubscription(productCode) {
  try {
    if (isSubscribed.value) {
      console.log(`[ETF DETAIL] 이미 구독 중: ${productCode}`);
      return;
    }

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

  if (data) {
    // 실시간 데이터를 저장하여 DetailMainEtf에 전달
    realtimeData.value = data;
    
    // 스토어에도 업데이트
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
  // productInfo가 아직 로드되지 않았으면 기본 탭만 반환
  if (!productInfo.value) {
    return [
      { key: 'info', label: '상품안내' },
      { key: 'yield', label: '수익률' },
      { key: 'composition', label: '구성종목' },
      { key: 'news', label: '뉴스' }
    ];
  }

  // productInfo.value가 존재하는지 확인
  if (!productInfo.value.isHolding || 
      !productInfo.value.holding || 
      !Array.isArray(productInfo.value.holding) ||
      productInfo.value.holding.length === 0 ||
      !productInfo.value.holdingsTotalQuantity ||
      productInfo.value.holdingsTotalQuantity <= 0) {
    return [
      { key: 'info', label: '상품안내' },
      { key: 'yield', label: '수익률' },
      { key: 'composition', label: '구성종목' },
      { key: 'news', label: '뉴스' }
    ];
  }

  return [
    { key: 'holding', label: '보유기록' },
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
    if (!newProductInfo || 
        !newProductInfo.isHolding ||
        !newProductInfo.holding ||
        !Array.isArray(newProductInfo.holding) ||
        newProductInfo.holding.length === 0 ||
        !newProductInfo.holdingsTotalQuantity ||
        newProductInfo.holdingsTotalQuantity <= 0) {
      return;
    }

    if ((!oldProductInfo || !oldProductInfo.isHolding) &&
        selectedTab.value === 'info') {
      selectedTab.value = 'holding';
    }
  }
);

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

// 상품 데이터 새로고침 함수
const refreshProductData = async () => {
  try {
    const productId = route.params.id;
    if (productId) {
      await etfStore.fetchProduct(productId);
      await etfStore.fetchYieldHistory(productId);
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

// 하트 토글 처리
const handleHeartToggle = async isActive => {
  try {
    const message = isActive ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.';
    showToast(message, 'success');
  } catch (error) {
    showToast('찜 상태 변경에 실패했습니다. 다시 시도해주세요.', 'error');
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
