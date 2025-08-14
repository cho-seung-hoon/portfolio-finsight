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
        :max-rate="productInfo?.doptionIntrRate2"
        :base-rate="productInfo?.doptionIntrRate" />

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
      :min-amount="100000"
      :max-amount="maxAmountNumber"
      @close="handleModalClose"
      @submit="handleBuySubmit" />

    <DepositSellModal
      ref="sellModalRef"
      :product-info="{ ...productInfo, holdingData: sellModalHoldingData }"
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
import { storeToRefs } from 'pinia';
import { purchaseProduct, sellProduct } from '@/api/tradeApi';
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
const { productInfo, isLoading, error, isWatched } = storeToRefs(depositStore);

// 모달 상태 관리
const isModalOpen = ref(false);

// 중복 매수 방지 플래그
const isTransactionInProgress = ref(false);

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
  const hasValidHoldings = productInfo.value?.isHolding &&
    (productInfo.value?.holdings || productInfo.value?.holding) &&
    (productInfo.value?.holdings?.holdingsTotalQuantity > 0 || productInfo.value?.holding?.holdingsTotalQuantity > 0) &&
    productInfo.value?.holdings?.holdingsStatus !== 'zero';
  
  if (hasValidHoldings) {
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

watch(
  productInfo,
  newProductInfo => {
    const hasValidHoldings = newProductInfo?.isHolding &&
      (newProductInfo?.holdings || newProductInfo?.holding) &&
      (newProductInfo?.holdings?.holdingsTotalQuantity > 0 || newProductInfo?.holding?.holdingsTotalQuantity > 0) &&
      newProductInfo?.holdings?.holdingsStatus !== 'zero';
    
    if (hasValidHoldings) {
      selectedTab.value = 'holding';
    } else if (!newProductInfo?.isHolding) {
      selectedTab.value = 'info';
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

// 디버깅용
const debugInfo = computed(() => {
  console.log('DepositPage - productInfo:', productInfo.value);
  console.log('DepositPage - holding:', productInfo.value?.holding);
  return {
    productInfo: productInfo.value,
    holding: productInfo.value?.holding
  };
});

// DepositSellModal에 전달할 holdingData
const sellModalHoldingData = computed(() => {
  // holdings 객체에서 필요한 데이터를 추출하여 전달
  if (productInfo.value?.holdings) {
    return {
      holdingsTotalPrice: productInfo.value.holdings.holdingsTotalPrice,
      holdingsTotalQuantity: productInfo.value.holdings.holdingsTotalQuantity,
      maturityDate: productInfo.value.holdings.maturityDate || productInfo.value.holding?.maturityDate,
      contractDate: productInfo.value.holdings.contractDate || productInfo.value.holding?.contractDate
    };
  }
  return productInfo.value?.holding || null;
});

// 구매 버튼 클릭 처리
const handleBuyClick = async data => {
  // 중복 매수 방지
  if (isTransactionInProgress.value) {
    showToast('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.', 'warning');
    return;
  }
  
  currentTransactionType.value = 'buy';
  isModalOpen.value = true;
  await nextTick();
  termsModalRef.value?.openModal();
};

// 판매 버튼 클릭 처리
const handleSellClick = async data => {
  // 중복 매수 방지
  if (isTransactionInProgress.value) {
    showToast('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.', 'warning');
    return;
  }
  
  currentTransactionType.value = 'sell';
  isModalOpen.value = true;
  await nextTick();
  // 판매는 약관 동의 없이 바로 판매 모달 열기
  sellModalRef.value?.openModal();
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

  // 거래 진행 중 플래그 해제
  isTransactionInProgress.value = false;

  // 100ms 후에 닫기 상태 초기화
  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

// 약관 동의 확인 처리
const handleTermsConfirm = async agreementData => {
  // 거래 시작 플래그 설정
  isTransactionInProgress.value = true;
  
  if (currentTransactionType.value === 'buy') {
    // 구매인 경우 상품 가입 모달로 이어짐
    // 약관 동의 모달은 닫지만 전체 모달 상태는 유지
    // isModalOpen은 그대로 유지하여 검정색 배경 유지
    termsModalRef.value?.closeModalSilently();
    await nextTick();
    buyModalRef.value?.openModal();
  } else {
    // 판매인 경우 약관 동의 없이 바로 판매 모달 열기
    termsModalRef.value?.closeModalSilently();
    await nextTick();
    sellModalRef.value?.openModal();
  }
};



// 상품 데이터 새로고침 함수
const refreshProductData = async () => {
  try {
    const productId = route.params.id;
    if (productId) {
      await depositStore.fetchProduct(productId, 'deposit');
      // 새로고침 후 보유기록 탭이 있으면 해당 탭으로, 없으면 상품안내 탭으로
      if (productInfo.value?.isHolding && 
          (productInfo.value?.holdings || productInfo.value?.holding) && 
          (productInfo.value?.holdings?.holdingsTotalQuantity > 0 || productInfo.value?.holding?.holdingsTotalQuantity > 0) && 
          productInfo.value?.holdings?.holdingsStatus !== 'zero') {
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
      showToast('예금 가입이 완료되었습니다.', 'success', timestamp);

      // 상품 데이터 새로고침
      await refreshProductData();
    } else {
      // 실패인 경우
      showToast(`예금 가입에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('예금 가입 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    // 거래 완료 플래그 해제
    isTransactionInProgress.value = false;
  }
};

// 판매 제출 처리
const handleSellSubmit = async formData => {
  try {
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
      showToast('예금 해지가 완료되었습니다.', 'success', timestamp);

      // 상품 데이터 새로고침
      await refreshProductData();
    } else {
      // 실패인 경우
      showToast(`예금 해지에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('예금 해지에 실패했습니다. 다시 시도해주세요.', 'error');
  } finally {
    // 거래 완료 플래그 해제
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
  z-index: 10000;
  pointer-events: none;
}
</style>
