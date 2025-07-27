<template>
  <div
    class="page-container"
    :class="{ 'modal-open': isModalOpen }">
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="productInfo">
      <DetailMainDeposit
        :bank="productInfo.productCompanyName"
        :title="productInfo.productName"
        :maxRate="productInfo.depositMtrtInt"
        :maxRateDesc="'(12개월 세전)'"
        :baseRate="productInfo.depositMtrtInt" />

      <DetailTabs
        :tabs="tabs"
        :selectedTab="selectedTab"
        :indicatorPosition="indicatorPosition"
        @update:selectedTab="selectTab" />

      <DetailSection
        :tabData="tabData"
        :selectedTab="selectedTab" />

      <DetailActionButton
        :active="productInfo.isHolding"
        :category="'deposit'"
        :id="productInfo.productCode"
        @buy="handleBuyClick"
        @sell="handleSellClick" />
    </div>

    <!-- 모달 컴포넌트들 -->
    <DepositBuyModal
      ref="buyModalRef"
      :productInfo="productInfo"
      :minAmount="1000000"
      :maxAmount="productInfo?.depositMaxLimit || 0"
      :isLoading="isBuyLoading"
      @close="handleModalClose"
      @submit="handleBuySubmit" />

    <DepositSellModal
      ref="sellModalRef"
      :productInfo="{ ...productInfo, holdingData: depositStore.holdingData }"
      :isLoading="isSellLoading"
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
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useDepositStore } from '@/stores/deposit';
import { useBuyStore } from '@/stores/buy';
import { useSellStore } from '@/stores/sell';
import { storeToRefs } from 'pinia';

// DetailMainSection: 예금/ETF 등 상품의 주요 정보를 보여주는 상단 섹션 컴포넌트
// DetailTabs: 상품 상세 정보의 탭 네비게이션 컴포넌트
// DetailSection: 선택된 탭에 따라 상세 내용을 보여주는 컴포넌트
// DetailActionButton: 상품 가입/신청 등 주요 액션 버튼 컴포넌트
import DetailMainDeposit from '@/components/detail/DetailMainDeposit.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import DepositBuyModal from '@/components/buysell/DepositBuyModal.vue';
import DepositSellModal from '@/components/buysell/DepositSellModal.vue';
import ToastMessage from '@/components/common/ToastMessage.vue';

const route = useRoute();

const depositStore = useDepositStore();
const buyStore = useBuyStore();
const sellStore = useSellStore();
const { productInfo, isLoading, error } = storeToRefs(depositStore);
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
    depositStore.fetchProduct(productId);
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

// 탭 관련 데이터
const tabs = computed(() => {
  if (productInfo.value?.isHolding) {
    return [
      { key: 'holding', label: '보유기록' },
      { key: 'info', label: '상품안내' },
      { key: 'rate', label: '금리안내' },
      { key: 'notice', label: '유의사항' },
      { key: 'news', label: '뉴스' }
    ];
  }
  return [
    { key: 'info', label: '상품안내' },
    { key: 'rate', label: '금리안내' },
    { key: 'notice', label: '유의사항' },
    { key: 'news', label: '뉴스' }
  ];
});

const selectedTab = ref('info');
const selectTab = tab => {
  selectedTab.value = tab;
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

const indicatorPosition = {
  info: '0px',
  rate: '147px',
  notice: '294px',
  news: '441px'
};

// tabData를 computed로 변경하여 productId를 전달
const tabData = computed(() => {
  return depositStore.getTabDataWithHolding(productInfo.value.productCode);
});

// 매수 버튼 클릭 처리
const handleBuyClick = async data => {
  isModalOpen.value = true;
  await nextTick();
  buyModalRef.value?.openModal();
};

// 매도 버튼 클릭 처리
const handleSellClick = async data => {
  isModalOpen.value = true;
  await nextTick();
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
  showToast('거래가 취소', 'cancel');

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
    showToast('예금 가입이 완료되었습니다.', 'success', timestamp);
  } catch (error) {
    showToast('예금 가입에 실패했습니다. 다시 시도해주세요.', 'error');
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
    showToast('예금 해지가 완료되었습니다.', 'success', timestamp);
  } catch (error) {
    showToast('예금 해지에 실패했습니다. 다시 시도해주세요.', 'error');
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
