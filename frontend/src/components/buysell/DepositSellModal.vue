<template>
  <dialog
    ref="modalRef"
    class="modal"
    @click="handleBackdropClick">
    <div
      class="modal-content"
      @click.stop>
      <div class="modal-header">
        <div class="modal-header-title">예금 해지하기</div>
        <button
          class="close-btn"
          @click="closeModal">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <div class="product-info">
          <h3>{{ productInfo?.productName || '상품명' }}</h3>
        </div>

        <div class="info-row">
          <label>현재 예치금액</label>
          <div class="info-value-wrapper">
            <div class="info-value">
              {{
                formatCurrency(
                  holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice || 0
                )
              }}
            </div>
            <div
              v-if="
                (holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice) &&
                getKoreanNumber(
                  holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice
                )
              "
              class="korean-number">
              {{
                getKoreanNumber(
                  holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice
                )
              }}
              원
            </div>
          </div>
        </div>

        <div class="info-row">
          <label>만기일</label>
          <div class="info-value">
            {{ formatDate(calculatedMaturityDate) }}
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary"
          @click="closeModal">
          취소
        </button>
        <button
          class="btn btn-primary"
          :disabled="isSubmitting"
          @click="handleSubmit">
          {{ isSubmitting ? '처리중...' : '해지하기' }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { convertToKoreanNumber, parseNumberFromComma } from '@/utils/numberUtils';
import { sellProduct } from '@/api/tradeApi';
import Decimal from 'decimal.js';

const props = defineProps({
  productInfo: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const modalRef = ref(null);
const isClosing = ref(false);
const isSubmitting = ref(false);

const holdingData = computed(() => {
  console.log('DepositSellModal - productInfo:', props.productInfo);
  console.log('DepositSellModal - holdingData:', props.productInfo?.holdingData);
  return props.productInfo?.holdingData || null;
});

const contractDate = computed(() => {
  return (
    props.productInfo?.contractDate ||
    holdingData.value?.contractDate ||
    holdingData.value?.history?.[0]?.historyTradeDate ||
    props.productInfo?.holdings?.history?.[0]?.historyTradeDate ||
    props.productInfo?.holding?.history?.[0]?.historyTradeDate ||
    null
  );
});

const contractMonths = computed(() => {
  return (
    holdingData.value?.contractMonths ||
    props.productInfo?.contractMonths ||
    props.productInfo?.holding?.contractMonths
  );
});

const calculatedMaturityDate = computed(() => {
  if (props.productInfo?.maturityDate || holdingData.value?.maturityDate) {
    return props.productInfo?.maturityDate || holdingData.value?.maturityDate;
  }

  if (contractDate.value && contractMonths.value) {
    try {
      const contract = new Date(contractDate.value);
      if (!isNaN(contract.getTime())) {
        contract.setMonth(contract.getMonth() + contractMonths.value);
        return contract.toISOString();
      }
    } catch (error) {
      console.error('Error calculating maturityDate:', error);
    }
  }

  return null;
});

const currentDateTime = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
});

const formatCurrency = amount => {
  if (!amount || amount === '') return '0 원';

  if (typeof amount === 'string' && amount.includes('원')) {
    const numericPart = amount.replace(/[^0-9,]/g, '');
    const cleanNumber = parseNumberFromComma(numericPart);
    return new Intl.NumberFormat('ko-KR').format(cleanNumber.toNumber()) + ' 원';
  }

  try {
    const decimalAmount = new Decimal(amount);
    return new Intl.NumberFormat('ko-KR').format(decimalAmount.toNumber()) + ' 원';
  } catch (error) {
    console.warn('formatCurrency error:', error, 'amount:', amount);
    return '0 원';
  }
};

const formatDate = dateString => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const openModal = () => {
  if (modalRef.value) {
    modalRef.value.show();
  }
};

const closeModal = () => {
  if (isClosing.value) return;

  isClosing.value = true;

  if (modalRef.value) {
    modalRef.value.close();
  }
  emit('close');

  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

const closeModalSilently = () => {
  if (isClosing.value) return;

  isClosing.value = true;

  if (modalRef.value) {
    modalRef.value.close();
  }

  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

const handleBackdropClick = event => {
  if (event.target === modalRef.value) {
    closeModal();
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  const tradeData = {
    productCode: props.productInfo?.productCode,
    productCategory: 'deposit',
    quantity: 1,
    amount: holdingData.value?.holdingsTotalPrice || 0,
    saleDate: currentDateTime.value
  };

  try {
    const result = await sellProduct(tradeData);
    if (result.success) {
      console.log('예금 해지 성공:', result.data);
      emit('submit', {
        success: true,
        data: result.data,
        code: props.productInfo?.productCode,
        category: 'DEPOSIT'
      });
      closeModal();
    } else {
      console.error('예금 해지 실패:', result.error);
      emit('submit', {
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('예금 해지 중 오류 발생:', error);
    emit('submit', {
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const getKoreanNumber = value => {
  return convertToKoreanNumber(value);
};

defineExpose({
  openModal,
  closeModal,
  closeModalSilently
});

watch(
  () => modalRef.value?.open,
  isOpen => {
    if (!isOpen) {
    }
  }
);
</script>

<style scoped>
.modal {
  border: none;
  border-radius: 12px;
  padding: 0;
  background: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  max-width: 100%;
  max-height: 100dvh;
  overflow: hidden;
}

/*
.modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}
*/

.modal-content {
  background: var(--white);
  border-radius: 8px;
  width: calc(90vw - 32px);
  max-width: 408px;
  min-width: 288px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  margin: 0 16px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px 16px;
  border-bottom: 1px solid var(--main04);
  background: var(--main01);
  border-radius: 8px 8px 0 0;
}

/*@media (min-width: 768px) {
  .modal-header {
    padding: 24px 24px 16px 24px;
  }
}*/

.modal-header .modal-header-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--white);
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-xxl);
  color: var(--white);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--sub01);
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  max-height: 50vh;
  overscroll-behavior: contain;
}

/*@media (min-width: 768px) {
  .modal-body {
    padding: 24px;
  }
}*/

.product-info {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--main05);
  border:1px solid var(--main04);
  border-radius: 8px;
}

.product-info h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--main01);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--main01);
  text-align: left;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--main04);
  border-radius: 8px;
  font-size: var(--font-size-md);
  color: var(--main01);
  background: var(--white);
  box-sizing: border-box;
  text-align: right;
}

.form-control:focus {
  outline: none;
  border-color: var(--sub01);
  box-shadow: 0 0 0 2px rgba(250, 135, 114, 0.1);
}

.form-control.readonly {
  background: var(--main05);
  color: var(--main02);
  cursor: not-allowed;
}

.info-value {
  font-size: var(--font-size-md);
  color: var(--main01);
  font-weight: var(--font-weight-medium);
  text-align: right;
}

.korean-number {
  margin-top: 4px;
  font-size: var(--font-size-sm);
  color: var(--main02);
  font-style: italic;
  text-align: right;
  word-break: keep-all;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.4;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--main05);
}

.info-row:last-of-type {
  border-bottom: none;
}

.info-row.highlight {
  background: var(--main05);
  margin: 16px -16px;
  padding: 16px;
  border-radius: 8px;
  border-bottom: none;
}

.info-row label {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--main01);
  flex-shrink: 0;
  width: 120px;
  text-align: left;
}

.info-value-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  word-break: keep-all;
  word-wrap: break-word;
  white-space: normal;
  max-width: 100%;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--main04);
  border-radius: 0 0 8px 8px;
}

/*@media (min-width: 768px) {
  .modal-footer {
    padding: 16px 24px 24px 24px;
  }
}*/

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--sub01);
  color: var(--white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--main01);
}

.btn-primary:disabled {
  background: var(--main04);
  color: var(--main02);
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--main04);
  color: var(--main01);
}

.btn-secondary:hover {
  background: var(--main03);
}
</style>
