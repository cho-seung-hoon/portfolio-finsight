<template>
  <div
    class="page-container"
    :class="{ 'modal-open': isModalOpen }">
<!--    <LoadingSpinner
      v-if="isLoading"
      text="상품 정보를 불러오는 중..." />-->
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="productInfo">
      <DetailMainDeposit
        :bank="productInfo?.productCompanyName"
        :title="productInfo?.productName"
        :max-rate="productInfo?.maxRate"
        :max-rate-desc="'(12개월 세전)'"
        :base-rate="productInfo?.baseRate" />

      <DetailTabs
        :tabs="tabs"
        :selected-tab="selectedTab"
        :indicator-position="indicatorPosition"
        @update:selected-tab="selectTab" />

      <DetailSection
        :tab-data="tabData"
        :selected-tab="selectedTab" />

      <DetailActionButton
        :product-info="productInfo"
        :id="productInfo?.productCode"
        :active="productInfo?.isHolding || false"
        :category="'deposit'"
        @buy-click="handleBuyClick"
        @sell-click="handleSellClick" />
    </div>

    <!-- 모달 컴포넌트들 -->
    <TermsAgreementModal
      ref="termsModalRef"
      :product-type="'deposit'"
      :product-name="productInfo?.productName || ''"
      :transaction-type="currentTransactionType"
      @close="handleModalClose"
      @confirm="handleTermsConfirm" />

    <DepositBuyModal
      ref="buyModalRef"
      :product-info="productInfo"
      :min-amount="1000000"
      :max-amount="maxAmountNumber"
      :is-loading="isBuyLoading"
      @close="handleModalClose"
      @submit="handleBuySubmit" />

    <DepositSellModal
      ref="sellModalRef"
      :product-info="{ ...productInfo, holdingData: productInfo?.holding || null }"
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const route = useRoute();
const depositStore = useDepositStore();
const buyStore = useBuyStore();
const sellStore = useSellStore();
const { productInfo, isLoading, error, isWatched } = storeToRefs(depositStore);
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

// 숫자형 최대 금액 계산 (Decimal, 문자열("만원") 모두 대응)
const maxAmountNumber = computed(() => {
  const val = productInfo.value?.depositMaxLimit;
  if (val instanceof Decimal) return val.toNumber();
  if (typeof val === 'string') {
    const hasManwon = /만원$/.test(val.trim());
    const digits = val.replace(/[^0-9]/g, '');
    if (!digits) return 0;
    const num = parseInt(digits, 10);
    return hasManwon ? num * 10000 : num;
  }
  return Number(val || 0);
});

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    depositStore.fetchProduct(productId, 'deposit');
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
  if (
    productInfo.value?.isHolding &&
    productInfo.value?.holding &&
    productInfo.value?.holding.length > 0
  ) {
    return [
      { key: 'holding', label: '보유기록' },
      { key: 'info', label: '상품안내' },
      { key: 'rate', label: '금리안내' },
      { key: 'notice', label: '유의사항' }
    ];
  }
  return [
    { key: 'info', label: '상품안내' },
    { key: 'rate', label: '금리안내' },
    { key: 'notice', label: '유의사항' }
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
    if (
      newProductInfo?.isHolding &&
      newProductInfo?.holding &&
      newProductInfo?.holding.length > 0
    ) {
      selectedTab.value = 'holding';
    }
  },
  { immediate: true }
);

const indicatorPosition = {
  info: '0px',
  rate: '147px',
  notice: '294px'
};

// tabData를 computed로 변경하여 실제 API 데이터 사용
const tabData = computed(() => {
  return depositStore.tabData;
});

// 구매 버튼 클릭 처리
const handleBuyClick = async data => {
  currentTransactionType.value = 'buy';
  isModalOpen.value = true;
  await nextTick();
  termsModalRef.value?.openModal();
};

// 판매 버튼 클릭 처리
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
    // 구매인 경우 상품 가입 모달로 이어짐
    // 약관 동의 모달은 닫지만 전체 모달 상태는 유지
    // isModalOpen은 그대로 유지하여 검정색 배경 유지
    termsModalRef.value?.closeModalSilently();
    await nextTick();
    buyModalRef.value?.openModal();
  } else {
    // 판매인 경우 바로 판매 처리
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

// 구매 제출 처리
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

    // 상품체결 성공 후 상세페이지 데이터 새로고침
    const productId = route.params.id;
    if (productId) {
      await depositStore.fetchProduct(productId, 'deposit');
    }
  } catch (error) {
    showToast('예금 가입에 실패했습니다. 다시 시도해주세요.', 'error');
  }
};

// 판매 제출 처리
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

    // 상품체결 성공 후 상세페이지 데이터 새로고침
    const productId = route.params.id;
    if (productId) {
      await depositStore.fetchProduct(productId, 'deposit');
    }
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
