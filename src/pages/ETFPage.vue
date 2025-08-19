<template>
  <div
    class="page-container"
    :class="{ 'modal-open': isModalOpen }">
    <div
      v-if="error"
      class="error-message">
      {{ error }}
    </div>
    <div
      v-else-if="productInfo"
      class="in-container">
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
        class="detail-section"
        :tab-data="tabData"
        :selected-tab="selectedTab"
        category="etf"
        :realtime-data="realtimeData" />
      <div class="button-container">
        <DetailActionButton
          :product-info="productInfo"
          @buy-click="handleBuyClick"
          @sell-click="handleSellClick" />
      </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEtfStore } from '@/stores/etf';
import { storeToRefs } from 'pinia';
import { useProductSubscription } from '@/composables/useProductSubscription';
import { useToastStore } from '@/stores/toast';

import DetailMainEtf from '@/components/detail/DetailMainEtf.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import FundEtfBuyModal from '@/components/buysell/FundEtfBuyModal.vue';
import FundEtfSellModal from '@/components/buysell/FundEtfSellModal.vue';

const route = useRoute();

const etfStore = useEtfStore();
const toastStore = useToastStore();
const { productInfo, error, isYieldHistoryLoaded, isYieldHistoryLoading } = storeToRefs(etfStore);

const isModalOpen = ref(false);

const buyModalRef = ref(null);
const sellModalRef = ref(null);

const isClosing = ref(false);

const isTransactionInProgress = ref(false);

const realtimeData = ref(null);

const {
  isSubscribed,
  currentSubscription,
  subscribeToSingleProduct,
  unsubscribeFromSingleProduct
} = useProductSubscription();

onMounted(() => {
  const productCode = route.params.productCode;
  if (productCode) {
    console.log('[ETF DETAIL] 상품 코드:', productCode);
    etfStore.fetchProduct(productCode);
  }
});

watch(productInfo, async (newProductInfo, oldProductInfo) => {
  if (oldProductInfo && newProductInfo?.productCode !== oldProductInfo?.productCode) {
    selectedTab.value = 'info';
  }

  if (newProductInfo?.productCode && !isSubscribed.value) {
    try {
      await startWebSocketSubscription(newProductInfo.productCode);
    } catch (error) {
      console.error('[ETF DETAIL] 웹소켓 구독 실패:', error);
    }
  }
});

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

const handleWebSocketData = data => {
  if (data && data.currentPrice !== undefined && data.currentVolume !== undefined) {
    // 이전 데이터와 비교하여 실제로 변경된 경우에만 업데이트
    if (
      !realtimeData.value ||
      realtimeData.value.currentPrice !== data.currentPrice ||
      realtimeData.value.currentVolume !== data.currentVolume
    ) {
      realtimeData.value = { ...data };
      // etfStore의 updateRealtimeData 호출하여 yieldHistory 업데이트
      etfStore.updateRealtimeData(data);
    }
  }
};

onUnmounted(() => {
  if (currentSubscription.value && isSubscribed.value) {
    unsubscribeFromSingleProduct(currentSubscription.value.code);
    isSubscribed.value = false;
    currentSubscription.value = null;
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

  if (tab === 'yield') {
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
  if (!etfStore.productInfo) return {};

  let yieldTabData = [];
  if (etfStore.yieldHistory && etfStore.yieldHistory.length > 0) {
    const chartDataForChart = etfStore.yieldHistory.map(item => ({
      time: Math.floor(item.timestamp / 1000),
      price: Number(item.currentPrice) || 0,
      volume: Number(item.currentVolume) || 0
    }));

    yieldTabData = [
      { type: 'areachart', title: 'ETF 가격/거래량 그래프', desc: chartDataForChart }
    ];
  }

  const baseTabData = {
    info: etfStore.productInfo.info,
    yield: yieldTabData,
    composition: etfStore.productInfo.composition,
    news: etfStore.productInfo.news
  };

  if (
    etfStore.productInfo.isHolding &&
    (etfStore.productInfo.holding || etfStore.productInfo.holdings) &&
    (etfStore.productInfo.holdings?.holdingsTotalQuantity > 0 ||
      etfStore.productInfo.holding?.holdingsTotalQuantity > 0) &&
    (etfStore.productInfo.holdings?.holdingsStatus !== 'zero' ||
      etfStore.productInfo.holding?.holdingsStatus !== 'zero')
  ) {
    const holdingData = etfStore.productInfo.holding || etfStore.productInfo.holdings;
    if (holdingData && holdingData.length > 0) {
      const holdingsSummary = holdingData.find(item => item.type === 'holdingsummary')?.desc || {};
      const currentPrice =
        realtimeData.value?.currentPrice ||
        etfStore.productInfo.currentNav ||
        etfStore.productInfo.price?.currentPrice ||
        etfStore.productInfo.currentPrice ||
        0;
      const holdingsQuantity = holdingsSummary.holdingsTotalQuantity || 0;
      const totalValue = holdingsQuantity * currentPrice;

      const enhancedHoldingsSummary = {
        ...holdingsSummary,
        currentPricePerUnit: currentPrice,
        currentTotalValue: totalValue
      };

      baseTabData.holding = [
        {
          type: 'holdingsummary',
          title: '보유 현황',
          desc: enhancedHoldingsSummary
        },
        {
          type: 'holdinghistory',
          title: '투자 기록',
          desc: holdingData.find(item => item.type === 'holdinghistory')?.desc || []
        }
      ];
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
      await etfStore.fetchProduct(productCode);
      await etfStore.fetchYieldHistory(productCode);

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
      toastStore.success('ETF 구매가 완료되었습니다.');

      await refreshProductData();
    } else {
      toastStore.error(`ETF 구매에 실패했습니다: ${formData.error}`);
    }
  } catch (error) {
    toastStore.error('ETF 구매 처리 중 오류가 발생했습니다.');
  } finally {
    isTransactionInProgress.value = false;
  }
};

const handleSellSubmit = async formData => {
  try {
    isTransactionInProgress.value = true;

    if (formData.success) {
      handleModalClose();
      toastStore.success('ETF 판매가 완료되었습니다.');

      await refreshProductData();
    } else {
      toastStore.error(`ETF 판매에 실패했습니다: ${formData.error}`);
    }
  } catch (error) {
    toastStore.error('ETF 판매 처리 중 오류가 발생했습니다.');
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
