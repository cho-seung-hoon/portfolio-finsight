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
        :id="productInfo.productCode"
        :active="productInfo.isHolding"
        :category="'deposit'"
        @buy="handleBuyClick"
        @sell="handleSellClick" />
    </div>

    <!-- 모달 컴포넌트들 -->
    <TermsAgreementModal
      ref="termsModalRef"
      :productType="'deposit'"
      :productName="productInfo?.productName || ''"
      :transactionType="currentTransactionType"
      @close="handleModalClose"
      @confirm="handleTermsConfirm" />

    <DepositBuyModal
      ref="buyModalRef"
      :productInfo="productInfo"
      :minAmount="new Decimal(1000000)"
      :maxAmount="productInfo?.depositMaxLimit || new Decimal(0)"
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

  <button @click="showModal == true">버튼</button>
  <!-- 모달 컴포넌트 -->
  <AgreememtModal
    v-if="showModal"
    @close="showModal = false" />
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useDepositStore } from '@/stores/deposit';
import { useBuyStore } from '@/stores/buy';
import { useSellStore } from '@/stores/sell';
import { storeToRefs } from 'pinia';
import Decimal from 'decimal.js';

import DetailMainDeposit from '@/components/detail/DetailMainDeposit.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import TermsAgreementModal from '@/components/buysell/TermsAgreementModal.vue';
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
const termsModalRef = ref(null);
const buyModalRef = ref(null);
const sellModalRef = ref(null);

// 현재 거래 타입 (buy/sell)
const currentTransactionType = ref('buy');

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
  currentTransactionType.value = 'buy';
  isModalOpen.value = true;
  await nextTick();
  termsModalRef.value?.openModal();
};

// 매도 버튼 클릭 처리
const handleSellClick = async data => {
  currentTransactionType.value = 'sell';
  isModalOpen.value = true;
  await nextTick();
  termsModalRef.value?.openModal();
};

// 모달 닫기 처리
const handleModalClose = () => {
  if (isClosing.value) {
    return;
  }
  isClosing.value = true;

  isModalOpen.value = false;
  termsModalRef.value?.closeModalSilently();
  buyModalRef.value?.closeModalSilently();
  sellModalRef.value?.closeModalSilently();
  showToast('거래가 취소', 'cancel');

  // 100ms 후에 닫기 상태 초기화
  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

// 약관 동의 확인 처리
const handleTermsConfirm = async agreementData => {
  if (currentTransactionType.value === 'buy') {
    // 매수인 경우 상품 가입 모달로 이어짐
    // 약관 동의 모달은 닫지만 전체 모달 상태는 유지
    // isModalOpen은 그대로 유지하여 검정색 배경 유지
    termsModalRef.value?.closeModalSilently();
    await nextTick();
    buyModalRef.value?.openModal();
  } else {
    // 매도인 경우 바로 매도 처리
    try {
      await sellStore.sellProduct({
        code: productInfo.value?.productCode,
        category: 'DEPOSIT'
      });
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
      handleModalClose();
    }
  }
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
  z-index: 10000;
  pointer-events: none;
}
</style>
