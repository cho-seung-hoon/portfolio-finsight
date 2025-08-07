<template>
  <dialog
    ref="modalRef"
    class="modal"
    @click="handleBackdropClick">
    <div
      class="modal-content"
      @click.stop>
      <div class="modal-header">
        <h2>{{ productType === 'ETF' ? 'ETF 판매' : '펀드 판매' }}</h2>
        <button
          class="close-btn"
          @click="closeModal">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <!-- 상품 정보 -->
        <div class="product-info">
          <h3>{{ productInfo?.productName || '상품명' }}</h3>
        </div>

        <!-- 한 주당 가격 -->
        <div class="info-row">
          <label>한 주당 가격</label>
          <div class="info-value-wrapper">
            <div class="info-value">
              {{ formatCurrency(productInfo?.price?.currentPrice || 0) }}
            </div>
            <div
              v-if="
                productInfo?.price?.currentPrice && getKoreanNumber(productInfo.price.currentPrice)
              "
              class="korean-number">
              {{ getKoreanNumber(productInfo.price.currentPrice) }} 원
            </div>
          </div>
        </div>

        <!-- 현재 보유 수량 -->
        <div class="info-row">
          <label>현재 보유 수량</label>
          <div class="info-value-wrapper">
            <div class="info-value">{{ formatQuantity(productInfo?.holdingQuantity || 0) }}</div>
            <div
              v-if="productInfo?.holdingQuantity && getKoreanNumber(productInfo.holdingQuantity)"
              class="korean-number">
              {{ getKoreanNumber(productInfo.holdingQuantity) }} 주
            </div>
          </div>
        </div>

        <!-- 판매량 입력 -->
        <div class="form-group">
          <label for="quantity">판매량</label>
          <input
            id="quantity"
            v-model="formData.quantity"
            type="text"
            inputmode="numeric"
            pattern="[0-9,]*"
            class="form-control"
            :placeholder="`판매할 주 수를 입력하세요`"
            required
            @input="handleQuantityInput" />
          <div class="korean-number-wrapper">
            <div
              v-if="formData.quantity && getKoreanNumber(formData.quantity)"
              class="korean-number">
              {{ getKoreanNumber(formData.quantity) }} 주
            </div>
            <div
              v-else
              class="korean-number">
              입력 대기 중
            </div>
          </div>
          <div class="input-hint">
            최소 1주 이상, 최대
            {{ formatQuantity(productInfo?.holdingQuantity || 0) }}까지 판매 가능 (최대 10억원까지)
          </div>
        </div>

        <!-- 판매일 -->
        <div class="form-group">
          <label>판매일</label>
          <div class="form-control readonly">{{ currentDateTime }}</div>
        </div>

        <!-- 예상 판매 금액 -->
        <div class="info-row highlight">
          <label>예상 판매 금액</label>
          <div class="info-value-wrapper">
            <div class="info-value">{{ formatCurrency(totalAmount) }}</div>
            <div class="korean-number">{{ getKoreanNumber(totalAmount) }} 원</div>
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
          :disabled="!isFormValid || isLoading"
          @click="handleSubmit">
          {{ isLoading ? '처리중...' : '판매하기' }}
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
import Decimal from 'decimal.js';

const props = defineProps({
  productInfo: {
    type: Object,
    default: () => ({})
  },
  productType: {
    type: String,
    default: 'ETF', // 'ETF' 또는 'FUND'
    validator: value => ['ETF', 'FUND'].includes(value)
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const modalRef = ref(null);

// 중복 close 이벤트 방지
const isClosing = ref(false);

const formData = ref({
  quantity: ''
});

// 현재 날짜 포맷팅
const currentDateTime = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
});

// 총 판매 금액 계산
const totalAmount = computed(() => {
  const price = props.productInfo?.price?.currentPrice || 0;
  const quantity = parseNumberFromComma(formData.value.quantity) || 0;
  const calculatedAmount = new Decimal(price).times(quantity);

  // 10억 제한 (1,000,000,000원)
  const maxAllowedAmount = new Decimal(1000000000);
  return calculatedAmount.gt(maxAllowedAmount) ? maxAllowedAmount : calculatedAmount;
});

// 폼 유효성 검사
const isFormValid = computed(() => {
  const quantity = parseNumberFromComma(formData.value.quantity);
  const maxQuantity = props.productInfo?.holdingQuantity || 0;
  const price = props.productInfo?.price?.currentPrice || 0;
  const totalAmountValue = new Decimal(quantity).times(price);

  // 10억 제한 확인
  if (totalAmountValue.gt(1000000000)) {
    return false;
  }

  return formData.value.quantity && quantity >= 1 && quantity <= maxQuantity;
});

// 통화 포맷팅
const formatCurrency = amount => {
  // amount가 이미 Decimal 객체인지 확인
  const decimalAmount = amount instanceof Decimal ? amount : new Decimal(amount || 0);
  return new Intl.NumberFormat('ko-KR').format(decimalAmount.toNumber()) + ' 원';
};

// 수량 포맷팅
const formatQuantity = quantity => {
  return (
    new Intl.NumberFormat('ko-KR').format(quantity) + (props.productType === 'ETF' ? '주' : '좌')
  );
};

// 폼 초기화 함수
const resetForm = () => {
  formData.value = {
    quantity: ''
  };
};

// 모달 열기
const openModal = () => {
  resetForm(); // 모달 열기 전에 폼 초기화
  // 약간의 지연 후 모달 열기 (폼 초기화가 완료되도록)
  setTimeout(() => {
    if (modalRef.value) {
      modalRef.value.showModal();
    }
  }, 10);
};

// 모달 닫기
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

// 배경 클릭 처리
const handleBackdropClick = event => {
  if (event.target === modalRef.value) {
    closeModal();
  }
};

// 제출 처리
const handleSubmit = () => {
  if (!isFormValid.value) return;

  emit('submit', {
    quantity: new Decimal(parseNumberFromComma(formData.value.quantity)),
    price: props.productInfo?.price?.currentPrice,
    saleDate: currentDateTime.value,
    code: props.productInfo?.productCode,
    category: props.productType
  });
};

// 입력값 처리 함수
const handleQuantityInput = event => {
  if (!event || !event.target) return;
  let value = event.target.value;

  // 숫자와 쉼표만 허용
  value = value.replace(/[^0-9,]/g, '');

  let numValue = parseNumberFromComma(value);
  const maxQuantity = props.productInfo?.holdingQuantity || 0;
  const price = props.productInfo?.price?.currentPrice || 0;

  // 보유 수량 제한
  if (numValue > maxQuantity) {
    numValue = maxQuantity;
    value = String(numValue);
  }

  // 10억 제한 확인
  const maxQuantityFor10Billion = Math.floor(1000000000 / price);
  if (numValue > maxQuantityFor10Billion) {
    numValue = maxQuantityFor10Billion;
    value = String(numValue);
  }

  const formattedValue = formatInputNumber(value);
  formData.value.quantity = formattedValue;
};

// 한글 숫자 변환 함수
const getKoreanNumber = value => {
  // value가 null, undefined, 빈 문자열인 경우 빈 문자열 반환
  if (!value) return '';

  // Decimal 객체인 경우 toNumber() 사용
  if (value instanceof Decimal) {
    return convertToKoreanNumber(value.toNumber());
  }

  return convertToKoreanNumber(value);
};

// 외부에서 모달 열기 메서드 노출
defineExpose({
  openModal,
  closeModal
});

// 모달이 닫힐 때 폼 초기화
watch(
  () => modalRef.value?.open,
  isOpen => {
    if (!isOpen) {
      // 모달이 닫힐 때 폼 초기화
      resetForm();
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
  display: none;
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

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--main05);
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

.info-value {
  font-size: var(--font-size-md);
  color: var(--main01);
  font-weight: var(--font-weight-medium);
  text-align: right;
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

.input-hint {
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
