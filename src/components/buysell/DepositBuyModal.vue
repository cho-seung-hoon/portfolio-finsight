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
        <!-- 상품 정보 -->
        <div class="product-info">
          <h3>{{ productInfo?.productName || '상품명' }}</h3>
        </div>

        <!-- 기간 선택 -->
        <div class="form-group">
          <label for="period">기간</label>
          <select
            id="period"
            v-model="formData.period"
            class="form-control"
            required>
            <option value="">기간을 선택하세요</option>
            <option value="3">3개월</option>
            <option value="6">6개월</option>
            <option value="12">12개월</option>
            <option value="24">24개월</option>
            <option value="36">36개월</option>
          </select>
        </div>

        <!-- 예금 시작일 -->
        <div class="form-group">
          <label>예금 시작일</label>
          <div class="form-control readonly">{{ todayDate }}</div>
        </div>

        <!-- 예금액 입력 -->
        <div class="form-group">
          <label for="amount">예금액</label>
          <input
            id="amount"
            v-model="formData.amount"
            type="text"
            class="form-control"
            :placeholder="`최소 ${formatCurrency(minAmount)} ~ 최대 ${formatCurrency(maxAmount)}`"
            @input="handleAmountInput"
            required />
          <div class="korean-number-wrapper">
            <div
              class="korean-number"
              v-if="formData.amount && getKoreanNumber(formData.amount)">
              {{ getKoreanNumber(formData.amount) }} 원
            </div>
            <div
              class="korean-number"
              v-else>
              입력 대기 중
            </div>
          </div>
          <div class="available-amount">
            가입 가능한 금액: {{ formatCurrency(minAmount) }} ~ {{ formatCurrency(maxAmount) }}
          </div>
          <div
            class="korean-number"
            v-if="minAmount && getKoreanNumber(minAmount)">
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
          @click="handleSubmit"
          :disabled="!isFormValid || isLoading">
          {{ isLoading ? '처리중...' : '가입하기' }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBuyStore } from '@/stores/buy';
import {
  formatInputNumber,
  parseNumberFromComma,
  convertToKoreanNumber
} from '@/utils/numberUtils';

const props = defineProps({
  productInfo: {
    type: Object,
    default: () => ({})
  },
  minAmount: {
    type: Number,
    default: 1000000
  },
  maxAmount: {
    type: Number,
    default: 10000000
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const modalRef = ref(null);
const buyStore = useBuyStore();

// 중복 close 이벤트 방지
const isClosing = ref(false);

const formData = ref({
  period: '',
  amount: ''
});

// 오늘 날짜 포맷팅
const todayDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
});

// 폼 유효성 검사
const isFormValid = computed(() => {
  const amount = parseNumberFromComma(formData.value.amount);
  return (
    formData.value.period &&
    formData.value.amount &&
    amount >= props.minAmount &&
    amount <= props.maxAmount
  );
});

// 통화 포맷팅
const formatCurrency = amount => {
  return new Intl.NumberFormat('ko-KR').format(amount) + ' 원';
};

// 폼 초기화 함수
const resetForm = () => {
  formData.value = {
    period: '',
    amount: ''
  };
};

// 모달 열기
const openModal = () => {
  resetForm(); // 모달 열기 전에 폼 초기화
  if (modalRef.value) {
    modalRef.value.showModal();
  }
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
    period: formData.value.period,
    amount: parseNumberFromComma(formData.value.amount),
    startDate: todayDate.value,
    code: props.productInfo?.productCode
  });
};

// 입력값 처리 함수
const handleAmountInput = event => {
  if (!event || !event.target) return;
  let value = event.target.value;
  let numValue = parseNumberFromComma(value);

  // 최대 금액 제한
  if (numValue > props.maxAmount) {
    numValue = props.maxAmount;
    value = String(numValue);
  }

  const formattedValue = formatInputNumber(value);
  formData.value.amount = formattedValue;
};

// 한글 숫자 변환 함수
const getKoreanNumber = value => {
  return convertToKoreanNumber(value);
};

// 외부에서 모달 열기 메서드 노출
defineExpose({
  openModal,
  closeModal
});

// 모달이 열릴 때와 닫힐 때 폼 초기화
watch(
  () => modalRef.value?.open,
  isOpen => {
    if (!isOpen) {
      // 모달이 닫힐 때 폼 초기화
      resetForm();
    } else {
      // 모달이 열릴 때 최소 금액을 기본값으로 설정
      formData.value.amount = formatInputNumber(String(props.minAmount));
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
}

.modal::backdrop {
  display: none;
}

.modal-content {
  background: var(--white);
  border-radius: 12px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid var(--main04);
  background: var(--main01);
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
  padding: 24px;
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
  padding: 16px 24px 24px 24px;
  border-top: 1px solid var(--main04);
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
