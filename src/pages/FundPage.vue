<template>
  <div
    class="page-container"
    :class="{ 'modal-open': isModalOpen }">
    <div v-if="error">{{ error }}</div>
    <div v-else-if="productInfo">
      <DetailMainFund
        :product-info="productInfo"
        :bank="productInfo.productCompanyName"
        :title="productInfo.productName"
        :yield="productInfo.yield3Months"
        :price-arr="productInfo.priceArr"
        :current-price="productInfo.currentPrice"
        :price-change="productInfo.priceChange"
        :price-change-percent="productInfo.priceChangePercent"
        :product-code="productInfo.productCode"
        :is-watched="productInfo?.isWatched || false" />

      <DetailTabs
        :tabs="tabs"
        :selected-tab="selectedTab"
        @update:selected-tab="selectTab" />

      <DetailSection
        :tab-data="tabData"
        category="fund"
        :selected-tab="selectedTab" />

      <DetailActionButton
        :product-info="productInfo"
        :id="productInfo.productCode"
        :active="productInfo.isHolding"
        :category="'fund'"
        @buy-click="handleBuyClick"
        @sell-click="handleSellClick" />
    </div>

    <!-- 모달 컴포넌트들 -->
    <FundEtfBuyModal
      ref="buyModalRef"
      :product-info="productInfo"
      :product-type="'FUND'"
      @close="handleModalClose"
      @submit="handleBuySubmit" />

    <FundEtfSellModal
      ref="sellModalRef"
      :product-info="productInfo"
      :product-type="'FUND'"
      @close="handleModalClose"
      @submit="handleSellSubmit" />

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
import { useFundStore } from '@/stores/fund';
import { purchaseProduct, sellProduct } from '@/api/tradeApi';
import { useProductSubscription } from '@/composables/useProductSubscription';
import { storeToRefs } from 'pinia';

import DetailMainFund from '@/components/detail/DetailMainFund.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import FundEtfBuyModal from '@/components/buysell/FundEtfBuyModal.vue';
import FundEtfSellModal from '@/components/buysell/FundEtfSellModal.vue';
import ToastMessage from '@/components/common/ToastMessage.vue';

const route = useRoute();

const fundStore = useFundStore();
const { productInfo, error, isYieldHistoryLoaded, isYieldHistoryLoading } =
  storeToRefs(fundStore);

// 모달 상태 관리
const isModalOpen = ref(false);

// 모달 refs
const buyModalRef = ref(null);
const sellModalRef = ref(null);

// 모달 닫기 처리 중복 방지
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
  const productCode = route.params.productCode;
  if (productCode) {
    console.log('[FUND DETAIL] 상품 코드:', productCode);
    fundStore.fetchProduct(productCode);
    fundStore.resetYieldHistory();
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
  const hasValidHoldings = productInfo.value?.isHolding &&
    (productInfo.value?.holdings || productInfo.value?.holding) &&
    (productInfo.value?.holdings?.holdingsTotalQuantity > 0 || productInfo.value?.holding?.holdingsTotalQuantity > 0) &&
    (productInfo.value?.holdings?.holdingsStatus !== 'zero' || productInfo.value?.holding?.holdingsStatus !== 'zero');
  
  if (hasValidHoldings) {
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
        await fundStore.fetchYieldHistory(productCode);
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

const tabData = computed(() => {
  if (!fundStore.product) return {};

  const baseTabData = {
    info: fundStore.generateInfoTab(fundStore.product),
    yield: fundStore.generateYieldTab(fundStore.product, fundStore.yieldHistory),
    composition: fundStore.generateCompositionTab(fundStore.product),
    news: fundStore.generateNewsTab(fundStore.product)
  };

  if (fundStore.product.isHolding && 
      (fundStore.product.holding || fundStore.product.holdings) &&
      (fundStore.product.holdings?.holdingsTotalQuantity > 0 || fundStore.product.holding?.holdingsTotalQuantity > 0) &&
      (fundStore.product.holdings?.holdingsStatus !== 'zero' || fundStore.product.holding?.holdingsStatus !== 'zero')) {
    
    const holdingData = fundStore.generateHoldingTab(fundStore.product.holdings, fundStore.product);
    if (holdingData && holdingData.length > 0) {
      baseTabData.holding = holdingData;
    }
  }

  return baseTabData;
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
    const productCode = route.params.productCode;
    if (productCode) {
      await fundStore.fetchProduct(productCode);
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
      showToast('펀드 구매가 완료되었습니다.', 'success', timestamp);

      await refreshProductData();
    } else {
      showToast(`펀드 구매에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('펀드 구매 처리 중 오류가 발생했습니다.', 'error');
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
      showToast('펀드 판매가 완료되었습니다.', 'success', timestamp);

      await refreshProductData();
    } else {
      showToast(`펀드 판매에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('펀드 판매 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    isTransactionInProgress.value = false;
  }
};


</script>

<style scoped>
.page-container {
  position: relative;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.page-container.modal-open::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1999;
  pointer-events: auto;
}
</style>
