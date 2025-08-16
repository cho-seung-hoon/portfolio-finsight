<template>
  <dialog
    ref="modalRef"
    class="modal"
    @click="handleBackdropClick">
    <div
      class="modal-content"
      @click.stop>
      <div class="modal-header">
        <h2>예금 가입</h2>
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

        <div class="form-group">
          <label for="contractMonths">기간</label>
          <select
            id="contractMonths"
            v-model="formData.contractMonths"
            class="form-control"
            required>
            <option value="">기간을 선택하세요</option>
            <option
              v-for="option in availablePeriods"
              :key="option.value"
              :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="amount">예금액</label>
          <input
            id="amount"
            v-model="formData.amount"
            type="text"
            inputmode="numeric"
            pattern="[0-9,]*"
            class="form-control"
            :placeholder="`최소 ${formatCurrency(minAmount)} ~ 최대 ${formatCurrency(maxAmount)}`"
            required
            @input="handleAmountInput" />
          <div class="korean-number-wrapper">
            <div
              v-if="formData.amount && getKoreanNumber(formData.amount)"
              class="korean-number">
              {{ getKoreanNumber(formData.amount) }} 원
            </div>
            <div
              v-else
              class="korean-number">
              입력 대기 중
            </div>
          </div>
          <div class="available-amount">
            가입 가능한 금액: {{ formatCurrency(minAmount) }} ~ {{ formatCurrency(maxAmount) }}
          </div>
          <div
            v-if="minAmount && getKoreanNumber(minAmount)"
            class="korean-number">
            최소 {{ getKoreanNumber(minAmount) }} 원
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
          :disabled="!isFormValid || isSubmitting"
          @click="handleSubmit">
          {{ isSubmitting ? '처리중...' : '가입하기' }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  formatInputNumber,
  parseNumberFromComma,
  convertToKoreanNumber
} from '@/utils/numberUtils';
import { purchaseProduct } from '@/api/tradeApi';
import Decimal from 'decimal.js';

const props = defineProps({
  productInfo: {
    type: Object,
    default: () => ({})
  },
  minAmount: {
    type: Number,
    default: 100000
  },
  maxAmount: {
    type: Number,
    default: 10000000
  }
});

const emit = defineEmits(['close', 'submit']);

const modalRef = ref(null);
const isClosing = ref(null);

// 로딩 상태 관리
const isSubmitting = ref(false);

const formData = ref({
  contractMonths: '',
  amount: ''
});

const availablePeriods = computed(() => {
  if (props.productInfo?.doption && props.productInfo.doption.length > 0) {
    return props.productInfo.doption.map(option => ({
      value: option.doptionSaveTrm,
      label: `${option.doptionSaveTrm}개월 (${option.doptionIntrRate}%)`
    }));
  }
  // 기본 기간 옵션
  return [
    { value: '6', label: '6개월' },
    { value: '12', label: '12개월' },
    { value: '24', label: '24개월' },
    { value: '36', label: '36개월' }
  ];
});

const minAmount = computed(() => {
  return props.productInfo?.depositMinLimit || props.minAmount || 100000;
});

const maxAmount = computed(() => {
  return props.productInfo?.depositMaxLimit || props.maxAmount || 10000000;
});

const isFormValid = computed(() => {
  const amount = parseNumberFromComma(formData.value.amount);
  return (
    formData.value.contractMonths &&
    formData.value.amount &&
    new Decimal(amount).gte(minAmount.value) &&
    new Decimal(amount).lte(maxAmount.value)
  );
});

const formatCurrency = amount => {
  // 숫자가 아닌 값이나 빈 값 처리
  if (!amount || amount === '') return '0 원';

  // 이미 "원"이 포함된 문자열인 경우 숫자 부분만 추출
  if (typeof amount === 'string' && amount.includes('원')) {
    const numericPart = amount.replace(/[^0-9,]/g, '');
    const cleanNumber = parseNumberFromComma(numericPart);
    return new Intl.NumberFormat('ko-KR').format(cleanNumber.toNumber()) + ' 원';
  }

  // 일반적인 숫자 처리
  try {
    const decimalAmount = new Decimal(amount);
    return new Intl.NumberFormat('ko-KR').format(decimalAmount.toNumber()) + ' 원';
  } catch (error) {
    console.warn('formatCurrency error:', error, 'amount:', amount);
    return '0 원';
  }
};

const resetForm = () => {
  formData.value = {
    contractMonths: '',
    amount: ''
  };
};

const openModal = () => {
  resetForm(); // 모달 열기 전에 폼 초기화
  if (modalRef.value) {
    modalRef.value.showModal();
  }
};

const closeModal = () => {
  if (isClosing.value) return;

  isClosing.value = true;

  if (modalRef.value) {
    modalRef.value.close();
  }
  emit('close');

  // 100ms 후에 닫기 상태 초기화
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

  // 100ms 후에 닫기 상태 초기화
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
  if (!isFormValid.value) return;

  isSubmitting.value = true;

  // 현재 날짜를 동적으로 생성
  const today = new Date();
  const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식

  const tradeData = {
    productCode: props.productInfo?.productCode,
    productCategory: 'deposit',
    quantity: 1,
    amount: new Decimal(parseNumberFromComma(formData.value.amount)).toNumber(),
    contractMonths: parseInt(formData.value.contractMonths), // 선택된 기간을 contractMonths로 전달
    startDate: startDate
  };

  try {
    const result = await purchaseProduct(tradeData);
    if (result.success) {
      console.log('예금 가입 성공:', result.data);
      emit('submit', {
        success: true,
        data: result.data,
        amount: new Decimal(parseNumberFromComma(formData.value.amount)),
        startDate: startDate,
        code: props.productInfo?.productCode
      });
      closeModal();
    } else {
      console.error('예금 가입 실패:', result.error);
      emit('submit', {
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('예금 가입 중 오류 발생:', error);
    emit('submit', {
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleAmountInput = event => {
  if (!event || !event.target) return;
  let value = event.target.value;

  // 숫자와 쉼표만 허용
  value = value.replace(/[^0-9,]/g, '');

  let numValue = parseNumberFromComma(value);

  // 최대 금액 제한
  if (new Decimal(numValue).gt(maxAmount.value)) {
    numValue = maxAmount.value;
    value = String(numValue);
  }

  const formattedValue = formatInputNumber(value);
  formData.value.amount = formattedValue;
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
      resetForm();
    } else {
      formData.value.amount = formatInputNumber(String(minAmount.value));
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}

.modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.modal-content {
  background: var(--white);
  border-radius: 12px;
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
  border-radius: 12px 12px 0 0;
}

@media (min-width: 768px) {
  .modal-header {
    padding: 24px 24px 16px 24px;
  }
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
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

@media (min-width: 768px) {
  .modal-body {
    padding: 24px;
  }
}

.product-info {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--main05);
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

.info-row label {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--main01);
  flex-shrink: 0;
  width: 120px;
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
  word-wrap: break-word;
  overflow-wrap: break-word;
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

.available-amount {
  margin-top: 8px;
  font-size: var(--font-size-sm);
  color: var(--main02);
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

.korean-number-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  word-break: keep-all;
  word-wrap: break-word;
  white-space: normal;
  margin-top: 4px;
  max-width: 100%;
}

.info-value {
  font-size: var(--font-size-md);
  color: var(--main01);
  font-weight: var(--font-weight-medium);
  text-align: right;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--main04);
  border-radius: 0 0 12px 12px;
}

@media (min-width: 768px) {
  .modal-footer {
    padding: 16px 24px 24px 24px;
  }
}

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
