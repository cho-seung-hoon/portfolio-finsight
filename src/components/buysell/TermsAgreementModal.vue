<template>
  <dialog
    ref="modalRef"
    class="modal"
    @click="handleBackdropClick">
    <div
      class="modal-content"
      @click.stop>
      <div class="modal-header">
        <h2>{{ getModalTitle() }}</h2>
        <button
          class="close-btn"
          @click="closeModal">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <div class="product-info">
          <h3>{{ productName }}</h3>
        </div>

        <div class="terms-section">
          <h4 class="terms-title">약관 동의</h4>
          <div class="terms-list">
            <div
              v-for="term in getTermsForProduct()"
              :key="term.id"
              class="term-item">
              <label class="term-checkbox">
                <input
                  v-model="term.agreed"
                  type="checkbox"
                  @change="updateAgreementStatus" />
                <span class="checkmark"></span>
                <span class="term-text">{{ term.title }}</span>
                <span
                  v-if="term.required"
                  class="required-mark"
                  >(필수)&nbsp;
                </span>
              </label>
              <button
                class="view-detail-button"
                @click="showTermDetail(term)">
                보기
              </button>
            </div>
          </div>

          <div class="all-agree-section">
            <label class="term-checkbox all-agree">
              <input
                v-model="allAgreed"
                type="checkbox"
                @change="toggleAllAgreement" />
              <span class="checkmark"></span>
              <span class="term-text">전체 약관에 동의합니다</span>
            </label>
          </div>
        </div>

        <div class="notice-section">
          <h4 class="notice-title">주요 안내사항</h4>
          <div class="notice-content">
            <ul class="notice-list">
              <li
                v-for="notice in getNoticesForProduct()"
                :key="notice">
                {{ notice }}
              </li>
            </ul>
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
          :disabled="!canProceed"
          @click="handleConfirm">
          {{ transactionType === 'buy' ? '가입 진행' : '해지 진행' }}
        </button>
      </div>
    </div>
  </dialog>

  <TermDetailModal
    v-if="selectedTerm"
    ref="termDetailModalRef"
    :term="selectedTerm"
    @close="selectedTerm = null" />
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import TermDetailModal from './TermDetailModal.vue';

const props = defineProps({
  productType: {
    type: String,
    required: true,
    validator: value => ['deposit'].includes(value)
  },
  productName: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    required: true,
    validator: value => ['buy', 'sell'].includes(value)
  }
});

const emit = defineEmits(['close', 'confirm']);

const modalRef = ref(null);
const selectedTerm = ref(null);
const allAgreed = ref(false);
const termDetailModalRef = ref(null);
const isClosing = ref(false);

const depositTerms = ref([
  {
    id: 1,
    title: '예금거래 기본약관',
    required: true,
    agreed: false,
    content: '예금거래에 관한 기본적인 약관입니다...',
    pdfUrl: null
  },
  {
    id: 2,
    title: '예금자보호법에 관한 사항',
    required: true,
    agreed: false,
    content: '예금자보호법 관련 내용입니다...',
    pdfUrl: null
  },
  {
    id: 3,
    title: '금리변동 안내',
    required: true,
    agreed: false,
    content: '금리변동에 관한 안내사항입니다...',
    pdfUrl: null
  },
  {
    id: 4,
    title: '세금 관련 안내',
    required: false,
    agreed: false,
    content: '세금 관련 안내사항입니다...',
    pdfUrl: null
  }
]);

const canProceed = computed(() => {
  const terms = getTermsForProduct();
  return terms.filter(term => term.required).every(term => term.agreed);
});

function getModalTitle() {
  const typeText = getProductTypeText();
  const actionText = props.transactionType === 'buy' ? '가입' : '해지';
  return `${typeText} ${actionText} 약관 동의`;
}

function getProductTypeText() {
  const typeMap = {
    deposit: '예금'
  };
  return typeMap[props.productType] || '투자';
}

function getProductTypeClass() {
  return `product-type-${props.productType}`;
}

function getTermsForProduct() {
  switch (props.productType) {
    case 'deposit':
      return depositTerms.value;
    default:
      return [];
  }
}

function getNoticesForProduct() {
  const notices = {
    deposit: [
      '예금자보호법에 따라 예금보험공사가 보호합니다.',
      '중도해지 시 약정금리보다 낮은 금리가 적용될 수 있습니다.',
      '세금 관련 사항은 세무전문가와 상담하시기 바랍니다.'
    ]
  };
  return notices[props.productType] || [];
}

function updateAgreementStatus() {
  const terms = getTermsForProduct();
  allAgreed.value = terms.every(term => term.agreed);
}

function toggleAllAgreement() {
  const terms = getTermsForProduct();
  terms.forEach(term => {
    term.agreed = allAgreed.value;
  });
}

function showTermDetail(term) {
  selectedTerm.value = term;
  nextTick(() => {
    if (termDetailModalRef.value) {
      termDetailModalRef.value.openModal();
    }
  });
}

const openModal = () => {
  resetAgreements();
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

function handleConfirm() {
  if (canProceed.value) {
    emit('confirm', {
      productType: props.productType,
      productName: props.productName,
      transactionType: props.transactionType,
      agreedTerms: getTermsForProduct().filter(term => term.agreed)
    });
    closeModal();
  }
}

function resetAgreements() {
  const terms = getTermsForProduct();
  terms.forEach(term => {
    term.agreed = false;
  });
  allAgreed.value = false;
}

defineExpose({
  openModal,
  closeModal,
  closeModalSilently
});
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
  overscroll-behavior: contain;
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
  max-height: 60vh;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
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
  text-align: left;
}

.product-type-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-type-deposit {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.product-info h3 {
  margin: 8px 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--main01);
}

.transaction-type {
  font-size: 16px;
  color: var(--main02);
  margin: 0;
}

.terms-section {
  margin-bottom: 32px;
}

.terms-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--main01);
  margin-bottom: 16px;
}

.terms-list {
  margin-bottom: 20px;
}

.term-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--main05);
}

.term-checkbox {
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
}

.term-checkbox input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--main04);
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.2s;
}

.term-checkbox input[type='checkbox']:checked + .checkmark {
  background-color: var(--sub01);
  border-color: var(--sub01);
}

.term-checkbox input[type='checkbox']:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.term-text {
  font-size: 14px;
  color: var(--main01);
  flex: 1;
}

.required-mark {
  color: #ef4444;
  font-size: 12px;
  margin-left: 4px;
}

.view-detail-button {
  background: none;
  border: 1px solid var(--main04);
  color: var(--main02);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-detail-button:hover {
  background-color: var(--main05);
  border-color: var(--main03);
}

.all-agree-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--main04);
}

.all-agree .checkmark {
  border-color: var(--sub01);
}

.all-agree .term-text {
  font-weight: 600;
  color: var(--main01);
}

.notice-section {
  margin-bottom: 24px;
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--main01);
  margin-bottom: 12px;
}

.notice-content {
  background-color: var(--main05);
  border-radius: 8px;
  padding: 16px;
}

.notice-list {
  margin: 0;
  padding-left: 20px;
  color: var(--main02);
  font-size: 14px;
  line-height: 1.6;
}

.notice-list li {
  margin-bottom: 8px;
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
