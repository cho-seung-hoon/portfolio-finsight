<template>
  <div
    class="page-container"
    :class="{ 'modal-open': isModalOpen }">
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="productInfo">
      <DetailMainFund
        :product-info="productInfo"
        :bank="productInfo.productCompanyName"
        :title="productInfo.productName"
        :yield="productInfo.yield"
        :price-arr="productInfo.priceArr"
        :current-price="productInfo.currentPrice"
        :price-change="productInfo.priceChange"
        :price-change-percent="productInfo.priceChangePercent" />

      <DetailTabs
        :tabs="tabs"
        :selected-tab="selectedTab"
        @update:selected-tab="selectTab" />

      <DetailSection
        :tab-data="tabData"
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
      :is-loading="isBuyLoading"
      @close="handleModalClose"
      @submit="handleBuySubmit" />

    <FundEtfSellModal
      ref="sellModalRef"
      :product-info="productInfo"
      :product-type="'FUND'"
      :is-loading="isSellLoading"
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
import { useBuyStore } from '@/stores/buy';
import { useSellStore } from '@/stores/sell';
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
const buyStore = useBuyStore();
const sellStore = useSellStore();
const { productInfo, isLoading, error, isYieldHistoryLoaded, isYieldHistoryLoading } =
  storeToRefs(fundStore);
const { isLoading: isBuyLoading } = storeToRefs(buyStore);
const { isLoading: isSellLoading } = storeToRefs(sellStore);

// 모달 상태 관리
const isModalOpen = ref(false);

// 모달 refs
const buyModalRef = ref(null);
const sellModalRef = ref(null);

// 모달 닫기 처리 중복 방지
const isClosing = ref(false);

// 토스트 설정
const toastConfig = ref({
  show: false,
  message: '',
  type: 'success'
});

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    fundStore.fetchProduct(productId);
    // 페이지 새로고침 시 수익률 히스토리 초기화
    fundStore.resetYieldHistory();
  } else {
    // 상품 ID가 URL에 없습니다.
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
  if (productInfo.value?.isHolding) {
    return [
      { key: 'holding', label: '보유기록' },
      { key: 'info', label: '상품안내' },
      { key: 'price', label: '수익률' },
      { key: 'composition', label: '구성종목' },
      { key: 'news', label: '뉴스' }
    ];
  }
  return [
    { key: 'info', label: '상품안내' },
    { key: 'price', label: '수익률' },
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
  if (tab === 'price' && !isYieldHistoryLoaded.value && !isYieldHistoryLoading.value) {
    const productId = route.params.id;
    console.log('Fetching yield history for productId:', productId);
    if (productId) {
      try {
        await fundStore.fetchYieldHistory(productId);
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
  newProductInfo => {
    if (newProductInfo?.isHolding) {
      selectedTab.value = 'holding';
    }
  },
  { immediate: true }
);

// tabData를 computed로 변경하여 productId를 전달
const tabData = computed(() => {
  return fundStore.tabData;
});

// 매수 버튼 클릭 처리
const handleBuyClick = async data => {
  isModalOpen.value = true;
  buyModalRef.value?.openModal();
};

// 매도 버튼 클릭 처리
const handleSellClick = async data => {
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

  // 100ms 후에 닫기 상태 초기화
  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

// 매수 제출 처리
const handleBuySubmit = async formData => {
  try {
    await buyStore.buyProduct(formData);
    handleModalClose();
    const timestamp = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    showToast('펀드 매수가 완료되었습니다.', 'success', timestamp);
  } catch (error) {
    showToast('펀드 매수에 실패했습니다. 다시 시도해주세요.', 'error');
  }
};

// 매도 제출 처리
const handleSellSubmit = async formData => {
  try {
    await sellStore.sellProduct(formData);
    handleModalClose();
    const timestamp = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    showToast('펀드 매도가 완료되었습니다.', 'success', timestamp);
  } catch (error) {
    showToast('펀드 매도에 실패했습니다. 다시 시도해주세요.', 'error');
    handleModalClose(); // 실패 시에도 모달 닫기
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
  z-index: 999;
  pointer-events: none;
}
</style>
