<template>
  <dialog
    ref="modalRef"
    class="modal"
    @click="handleBackdropClick">
    <div
      class="modal-content"
      @click.stop>
      <div class="modal-header">
        <h2>예금 해지하기</h2>
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

        <!-- 현재 예치금액 -->
        <div class="info-row">
          <label>현재 예치금액</label>
          <div class="info-value-wrapper">
            <div class="info-value">
              {{ formatCurrency(holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice || 0) }}
            </div>
            <div
              v-if="
                (holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice) && 
                getKoreanNumber(holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice)
              "
              class="korean-number">
              {{ getKoreanNumber(holdingData?.holdingsTotalPrice || productInfo?.holding?.holdingsTotalPrice) }} 원
            </div>
          </div>
        </div>

        <!-- 만기일 -->
        <div class="info-row">
          <label>만기일</label>
          <div class="info-value">
            {{ formatDate(holdingData?.maturityDate || productInfo?.holding?.maturityDate) }}
          </div>
        </div>



        <!-- 해지 시 수령금액 예상 -->
        <!-- <div class="info-row highlight">
          <label>해지 시 수령금액 예상</label>
          <div class="info-value-wrapper">
            <div class="info-value">{{ formatCurrency(estimatedAmount) }}</div>
            <div
              class="korean-number"
              v-if="estimatedAmount && getKoreanNumber(estimatedAmount)">
              {{ getKoreanNumber(estimatedAmount) }}
            </div>
          </div>
        </div> -->
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

// 중복 close 이벤트 방지
const isClosing = ref(false);

// 로딩 상태 관리
const isSubmitting = ref(false);

// 보유 데이터
const holdingData = computed(() => {
  console.log('DepositSellModal - productInfo:', props.productInfo);
  console.log('DepositSellModal - holdingData:', props.productInfo?.holdingData);
  return props.productInfo?.holdingData || null;
});

// 현재 날짜 포맷팅
const currentDateTime = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
});


// 통화 포맷팅
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

// 날짜 포맷팅
const formatDate = dateString => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 모달 열기
const openModal = () => {
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

// 외부에서 모달을 닫을 때 close 이벤트를 보내지 않는 메서드
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

// 배경 클릭 처리
const handleBackdropClick = event => {
  if (event.target === modalRef.value) {
    closeModal();
  }
};

// 제출 처리
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
      // API 호출 결과를 포함하여 부모에게 전달
      emit('submit', {
        success: true,
        data: result.data,
        code: props.productInfo?.productCode,
        category: 'DEPOSIT'
      });
      closeModal();
    } else {
      console.error('예금 해지 실패:', result.error);
      // 실패 결과도 부모에게 전달
      emit('submit', {
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('예금 해지 중 오류 발생:', error);
    // 에러 결과도 부모에게 전달
    emit('submit', {
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.'
    });
  } finally {
    isSubmitting.value = false;
  }
};

// 한글 숫자 변환 함수
const getKoreanNumber = value => {
  return convertToKoreanNumber(value);
};

// 외부에서 모달 열기 메서드 노출
defineExpose({
  openModal,
  closeModal,
  closeModalSilently
});

// 모달이 닫힐 때 폼 초기화 (일관성을 위해 추가)
watch(
  () => modalRef.value?.open,
  isOpen => {
    if (!isOpen) {
      // 현재는 읽기 전용이지만, 향후 입력 필드가 추가될 수 있으므로 초기화 로직 유지
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
