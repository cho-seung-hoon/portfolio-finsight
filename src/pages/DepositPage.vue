<template>
  <div
    class="page-container"
    :class="{ 'modal-open': isModalOpen }">
    <div v-if="error">{{ error }}</div>
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

const route = useRoute();
const depositStore = useDepositStore();
const { productInfo, error, isWatched } = storeToRefs(depositStore);

const isModalOpen = ref(false);
const isTransactionInProgress = ref(false);
const termsModalRef = ref(null);
const buyModalRef = ref(null);
const sellModalRef = ref(null);
const currentTransactionType = ref('buy');

const isClosing = ref(false);
const toastConfig = ref({
  show: false,
  message: '',
  type: 'success'
});

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
  }
});

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

const tabData = computed(() => {
  return depositStore.tabData;
});

const sellModalHoldingData = computed(() => {
  if (productInfo.value?.holdings) {
    const holdings = productInfo.value.holdings;
    const history = holdings.history?.[0];
    
    const contractDate = holdings.contractDate || history?.historyTradeDate;
    const contractMonths = holdings.contractMonths || history?.contractMonths;
    
    let maturityDate = holdings.maturityDate;
    if (!maturityDate && contractDate && contractMonths) {
      try {
        const contract = new Date(contractDate);
        if (!isNaN(contract.getTime())) {
          contract.setMonth(contract.getMonth() + contractMonths);
          maturityDate = contract.toISOString();
        }
      } catch (error) {
        console.error('Error calculating maturityDate:', error);
      }
    }

    return {
      holdingsTotalPrice: holdings.holdingsTotalPrice,
      holdingsTotalQuantity: holdings.holdingsTotalQuantity,
      maturityDate,
      contractDate,
      contractMonths,
      history: holdings.history || []
    };
  }
  
  if (productInfo.value?.holding) {
    const holding = productInfo.value.holding;
    const history = holding.history?.[0];
    
    const contractDate = holding.contractDate || history?.historyTradeDate;
    const contractMonths = holding.contractMonths || history?.contractMonths;
    
    let maturityDate = holding.maturityDate;
    if (!maturityDate && contractDate && contractMonths) {
      try {
        const contract = new Date(contractDate);
        if (!isNaN(contract.getTime())) {
          contract.setMonth(contract.getMonth() + contractMonths);
          maturityDate = contract.toISOString();
        }
      } catch (error) {
        console.error('Error calculating maturityDate:', error);
      }
    }

    return {
      holdingsTotalPrice: holding.holdingsTotalPrice,
      holdingsTotalQuantity: holding.holdingsTotalQuantity,
      maturityDate,
      contractDate,
      contractMonths,
      history: holding.history || []
    };
  }
  
  return null;
});

const handleBuyClick = async data => {
  if (isTransactionInProgress.value) {
    showToast('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.', 'warning');
    return;
  }
  
  currentTransactionType.value = 'buy';
  isModalOpen.value = true;
  await nextTick();
  termsModalRef.value?.openModal();
};

const handleSellClick = async data => {
  if (isTransactionInProgress.value) {
    showToast('이미 진행 중인 거래가 있습니다. 잠시만 기다려주세요.', 'warning');
    return;
  }
  
  currentTransactionType.value = 'sell';
  isModalOpen.value = true;
  await nextTick();
  sellModalRef.value?.openModal();
};

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

  isTransactionInProgress.value = false;

  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

const handleTermsConfirm = async agreementData => {
  isTransactionInProgress.value = true;
  
  if (currentTransactionType.value === 'buy') {
    termsModalRef.value?.closeModalSilently();
    await nextTick();
    buyModalRef.value?.openModal();
  } else {
    termsModalRef.value?.closeModalSilently();
    await nextTick();
    sellModalRef.value?.openModal();
  }
};

const refreshProductData = async () => {
  try {
    const productId = route.params.id;
    if (productId) {
      await depositStore.fetchProduct(productId, 'deposit');
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

const handleBuySubmit = async formData => {
  try {
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
      showToast('예금 가입이 완료되었습니다.', 'success', timestamp);

      await refreshProductData();
    } else {
      showToast(`예금 가입에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('예금 가입 처리 중 오류가 발생했습니다.', 'error');
  } finally {
    isTransactionInProgress.value = false;
  }
};

const handleSellSubmit = async formData => {
  try {
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
      showToast('예금 해지가 완료되었습니다.', 'success', timestamp);

      await refreshProductData();
    } else {
      showToast(`예금 해지에 실패했습니다: ${formData.error}`, 'error');
    }
  } catch (error) {
    showToast('예금 해지에 실패했습니다. 다시 시도해주세요.', 'error');
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
