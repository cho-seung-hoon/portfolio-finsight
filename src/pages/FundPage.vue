<template>
  <div
    class="page-container"
    :class="{ 'modal-open': isModalOpen }">
    <div v-if="error">{{ error }}</div>
    <div
      v-else-if="productInfo"
      class="in-container">
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
        class="detail-section"
        :tab-data="tabData"
        category="fund"
        :selected-tab="selectedTab" />
      <div class="button-container">
        <DetailActionButton
          :product-info="productInfo"
          :id="productInfo.productCode"
          :active="productInfo.isHolding"
          :category="'fund'"
          @buy-click="handleBuyClick"
          @sell-click="handleSellClick" />
      </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFundStore } from '@/stores/fund';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast';

import DetailMainFund from '@/components/detail/DetailMainFund.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import FundEtfBuyModal from '@/components/buysell/FundEtfBuyModal.vue';
import FundEtfSellModal from '@/components/buysell/FundEtfSellModal.vue';

const route = useRoute();

const fundStore = useFundStore();
const toastStore = useToastStore();
const { productInfo, error, isYieldHistoryLoaded, isYieldHistoryLoading } = storeToRefs(fundStore);

// 모달 상태 관리
const isModalOpen = ref(false);

// 모달 refs
const buyModalRef = ref(null);
const sellModalRef = ref(null);

// 모달 닫기 처리 중복 방지
const isClosing = ref(false);

// 거래 진행 중 플래그 (중복 거래 방지)
const isTransactionInProgress = ref(false);

onMounted(() => {
  const productCode = route.params.productCode;
  if (productCode) {
    console.log('[FUND DETAIL] 상품 코드:', productCode);
    fundStore.fetchProduct(productCode);
    fundStore.resetYieldHistory();
  }
});

const tabs = computed(() => {
  if (!productInfo.value) {
    return [
      { key: 'info', label: '상품안내' },
      { key: 'yield', label: '수익률' },
      { key: 'composition', label: '구성종목' },
      { key: 'news', label: '뉴스' }
    ];
  }

  const hasHoldings =
    productInfo.value.isHolding &&
    (productInfo.value.holdings || productInfo.value.holding)?.holdingsTotalQuantity > 0;

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
        await fundStore.fetchYieldHistory(productCode);
        console.log('Yield history fetched successfully');
      } catch (error) {
        console.error('Failed to fetch yield history:', error);
      }
    }
  }
};

watch(
  productInfo,
  (newProductInfo, oldProductInfo) => {
    const hasValidHoldings =
      newProductInfo?.isHolding &&
      (newProductInfo?.holdings || newProductInfo?.holding) &&
      (newProductInfo?.holdings?.holdingsTotalQuantity > 0 ||
        newProductInfo?.holding?.holdingsTotalQuantity > 0) &&
      (newProductInfo?.holdings?.holdingsStatus !== 'zero' ||
        newProductInfo?.holding?.holdingsStatus !== 'zero');

    if (hasValidHoldings) {
      selectedTab.value = 'holding';
    } else if (!hasValidHoldings && selectedTab.value === 'holding') {
      selectedTab.value = 'info';
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

  if (
    fundStore.product.isHolding &&
    (fundStore.product.holding || fundStore.product.holdings) &&
    (fundStore.product.holdings?.holdingsTotalQuantity > 0 ||
      fundStore.product.holding?.holdingsTotalQuantity > 0) &&
    (fundStore.product.holdings?.holdingsStatus !== 'zero' ||
      fundStore.product.holding?.holdingsStatus !== 'zero')
  ) {
    const holdingData = fundStore.generateHoldingTab(fundStore.product.holdings, fundStore.product);
    if (holdingData && holdingData.length > 0) {
      baseTabData.holding = holdingData;
    }
  }

  return baseTabData;
});

const handleBuyClick = async data => {
  if (isTransactionInProgress.value) {
    toastStore.warning('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.');
    return;
  }
  isModalOpen.value = true;
  buyModalRef.value?.openModal();
};

const handleSellClick = async data => {
  if (isTransactionInProgress.value) {
    toastStore.warning('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.');
    return;
  }
  isModalOpen.value = true;
  sellModalRef.value?.openModal();
};

const handleModalClose = () => {
  if (isClosing.value) {
    return;
  }
  isClosing.value = true;

  isModalOpen.value = false;
  buyModalRef.value?.closeModal();
  sellModalRef.value?.closeModal();
  toastStore.cancel('거래가 취소되었습니다.');

  isTransactionInProgress.value = false;

  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

const refreshProductData = async () => {
  try {
    const productCode = route.params.productCode;
    if (productCode) {
      await fundStore.fetchProduct(productCode);
      if (
        productInfo.value?.isHolding &&
        (productInfo.value?.holdings || productInfo.value?.holding) &&
        (productInfo.value?.holdings?.holdingsTotalQuantity > 0 ||
          productInfo.value?.holding?.holdingsTotalQuantity > 0) &&
        (productInfo.value?.holdings?.holdingsStatus !== 'zero' ||
          productInfo.value?.holding?.holdingsStatus !== 'zero')
      ) {
        selectedTab.value = 'holding';
      } else {
        selectedTab.value = 'info';
      }
    }
  } catch (error) {
    console.error('상품 데이터 새로고침 중 오류 발생:', error);
  }
};

const handleBuySubmit = async formData => {
  try {
    isTransactionInProgress.value = true;

    if (formData.success) {
      handleModalClose();
      toastStore.success('펀드 구매가 완료되었습니다.');

      await refreshProductData();
    } else {
      toastStore.error(`펀드 구매에 실패했습니다: ${formData.error}`);
    }
  } catch (error) {
    toastStore.error('펀드 구매 처리 중 오류가 발생했습니다.');
  } finally {
    isTransactionInProgress.value = false;
  }
};

const handleSellSubmit = async formData => {
  try {
    isTransactionInProgress.value = true;

    if (formData.success) {
      handleModalClose();

      toastStore.success('펀드 판매가 완료되었습니다.');

      await refreshProductData();
    } else {
      toastStore.error(`펀드 판매에 실패했습니다: ${formData.error}`);
    }
  } catch (error) {
    toastStore.error('펀드 판매 처리 중 오류가 발생했습니다.');
  } finally {
    isTransactionInProgress.value = false;
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.page-container.modal-open::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 50;
  pointer-events: auto;
}

.in-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 110px;
}

.detail-section {
  flex: 1;
}

.button-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: var(--off-white);
  padding: 16px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 5;
}

.button-container::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(
    to bottom,
    rgb(from var(--off-white) r g b / 0),
    rgb(from var(--off-white) r g b / 0.85),
    var(--off-white)
  );
  pointer-events: none;
}
</style>
