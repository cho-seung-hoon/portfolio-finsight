<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click="closeModal">
    <div
      class="modal-container"
      @click.stop>
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h2 class="modal-title">{{ getModalTitle() }}</h2>
      </div>

      <!-- 모달 콘텐츠 -->
      <div class="modal-content">
        <!-- 상품 정보 -->
        <div class="product-info">
          <div
            class="product-type-badge"
            :class="getProductTypeClass()">
            {{ getProductTypeText() }}
          </div>
          <h3 class="product-name">{{ productName }}</h3>
          <p class="transaction-type">{{ transactionType === 'buy' ? '매수' : '매도' }}</p>
        </div>

        <!-- 약관 리스트 -->
        <div class="terms-section">
          <h4 class="terms-title">약관 동의</h4>
          <div class="terms-list">
            <div
              v-for="term in getTermsForProduct()"
              :key="term.id"
              class="term-item">
              <label class="term-checkbox">
                <input
                  type="checkbox"
                  v-model="term.agreed"
                  @change="updateAgreementStatus" />
                <span class="checkmark"></span>
                <span class="term-text">{{ term.title }}</span>
                <span
                  v-if="term.required"
                  class="required-mark"
                  >(필수)</span
                >
              </label>
              <button
                class="view-detail-button"
                @click="showTermDetail(term)">
                보기
              </button>
            </div>
          </div>

          <!-- 전체 동의 -->
          <div class="all-agree-section">
            <label class="term-checkbox all-agree">
              <input
                type="checkbox"
                v-model="allAgreed"
                @change="toggleAllAgreement" />
              <span class="checkmark"></span>
              <span class="term-text">전체 약관에 동의합니다</span>
            </label>
          </div>
        </div>

        <!-- 주요 안내사항 -->
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

      <!-- 모달 푸터 -->
      <div class="modal-footer">
        <button
          class="cancel-button"
          @click="closeModal">
          취소
        </button>
        <button
          class="confirm-button"
          :disabled="!canProceed"
          @click="handleConfirm">
          {{ transactionType === 'buy' ? '매수 진행' : '매도 진행' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 약관 상세 모달 -->
  <TermDetailModal
    v-if="selectedTerm"
    :term="selectedTerm"
    @close="selectedTerm = null" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import TermDetailModal from './TermDetailModal.vue';

const props = defineProps({
  isVisible: Boolean,
  productType: {
    type: String,
    required: true,
    validator: value => ['deposit', 'fund', 'etf'].includes(value)
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

const selectedTerm = ref(null);
const allAgreed = ref(false);

const depositTerms = ref([
  {
    id: 1,
    title: '예금거래 기본약관',
    required: true,
    agreed: false,
    content: '예금거래에 관한 기본적인 약관입니다...'
  },
  {
    id: 2,
    title: '예금자보호법에 관한 사항',
    required: true,
    agreed: false,
    content: '예금자보호법 관련 내용입니다...'
  },
  {
    id: 3,
    title: '금리변동 안내',
    required: true,
    agreed: false,
    content: '금리변동에 관한 안내사항입니다...'
  },
  {
    id: 4,
    title: '세금 관련 안내',
    required: false,
    agreed: false,
    content: '세금 관련 안내사항입니다...'
  }
]);

const fundTerms = ref([
  {
    id: 1,
    title: '집합투자규약',
    required: true,
    agreed: false,
    content: '집합투자규약 내용입니다...'
  },
  {
    id: 2,
    title: '투자설명서',
    required: true,
    agreed: false,
    content: '투자설명서 내용입니다...'
  },
  {
    id: 3,
    title: '투자위험고지서',
    required: true,
    agreed: false,
    content: '투자위험에 관한 고지사항입니다...'
  },
  {
    id: 4,
    title: '펀드 수수료 안내',
    required: true,
    agreed: false,
    content: '펀드 수수료에 관한 안내입니다...'
  },
  {
    id: 5,
    title: '개인정보 수집·이용 동의',
    required: false,
    agreed: false,
    content: '개인정보 처리방침입니다...'
  }
]);

const etfTerms = ref([
  {
    id: 1,
    title: 'ETF 투자설명서',
    required: true,
    agreed: false,
    content: 'ETF 투자설명서 내용입니다...'
  },
  {
    id: 2,
    title: '상장지수펀드 투자위험고지서',
    required: true,
    agreed: false,
    content: 'ETF 투자위험 고지사항입니다...'
  },
  {
    id: 3,
    title: '거래수수료 안내',
    required: true,
    agreed: false,
    content: '거래수수료에 관한 안내입니다...'
  },
  {
    id: 4,
    title: '시장가격 변동 위험 안내',
    required: true,
    agreed: false,
    content: '시장가격 변동위험에 관한 내용입니다...'
  }
]);

const canProceed = computed(() => {
  const terms = getTermsForProduct();
  return terms.filter(term => term.required).every(term => term.agreed);
});

function getModalTitle() {
  const typeText = getProductTypeText();
  const actionText = props.transactionType === 'buy' ? '매수' : '매도';
  return `${typeText} ${actionText} 약관 동의`;
}

function getProductTypeText() {
  const typeMap = {
    deposit: '예금 상품',
    fund: '펀드 상품',
    etf: 'ETF 상품'
  };
  return typeMap[props.productType] || '투자 상품';
}

function getProductTypeClass() {
  return `product-type-${props.productType}`;
}

function getTermsForProduct() {
  switch (props.productType) {
    case 'deposit':
      return depositTerms.value;
    case 'fund':
      return fundTerms.value;
    case 'etf':
      return etfTerms.value;
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
    ],
    fund: [
      '투자원금의 손실이 발생할 수 있으며, 그 손실은 투자자에게 귀속됩니다.',
      '과거의 운용실적이 미래의 수익률을 보장하지 않습니다.',
      '판매수수료, 운용보수 등의 비용이 발생합니다.'
    ],
    etf: [
      'ETF는 상장된 펀드로 주식처럼 거래됩니다.',
      '시장가격과 순자산가치 간에 괴리가 발생할 수 있습니다.',
      '거래소 운영시간에만 매매가 가능합니다.'
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
}

function closeModal() {
  resetAgreements();
  emit('close');
}

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

watch(
  () => props.isVisible,
  newValue => {
    if (newValue) {
      resetAgreements();
    }
  }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.product-info {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
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

.product-type-fund {
  background-color: #fef3c7;
  color: #d97706;
}

.product-type-etf {
  background-color: #d1fae5;
  color: #059669;
}

.product-name {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 8px 0;
}

.transaction-type {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.terms-section {
  margin-bottom: 32px;
}

.terms-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.terms-list {
  space-y: 12px;
}

.term-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f9fafb;
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
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.2s;
}

.term-checkbox input[type='checkbox']:checked + .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
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
  color: #374151;
  flex: 1;
}

.required-mark {
  color: #ef4444;
  font-size: 12px;
  margin-left: 4px;
}

.view-detail-button {
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-detail-button:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.all-agree-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.all-agree .checkmark {
  border-color: #3b82f6;
}

.all-agree .term-text {
  font-weight: 600;
  color: #1f2937;
}

.notice-section {
  margin-bottom: 24px;
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.notice-content {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.notice-list {
  margin: 0;
  padding-left: 20px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.notice-list li {
  margin-bottom: 8px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-button {
  flex: 1;
  padding: 12px 24px;
  background: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #f9fafb;
}

.confirm-button {
  flex: 2;
  padding: 12px 24px;
  background: #3b82f6;
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-button:hover:not(:disabled) {
  background: #2563eb;
}

.confirm-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.term-detail-modal {
  max-width: 600px;
}

.term-content {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  white-space: pre-line;
}
</style>
