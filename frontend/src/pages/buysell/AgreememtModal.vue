<template>
  <!-- 모달 오버레이 -->
  <div
    v-if="isVisible"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click="closeModal">
    <div
      class="modal-dialog modal-dialog-centered modal-lg"
      @click.stop>
      <div class="modal-content">
        <!-- 모달 헤더 -->
        <div class="modal-header border-bottom">
          <h5 class="modal-title fw-bold">{{ getModalTitle() }}</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"></button>
        </div>

        <!-- 모달 바디 -->
        <div
          class="modal-body"
          style="max-height: 70vh; overflow-y: auto">
          <!-- 상품 정보 -->
          <div class="text-center mb-4 pb-4 border-bottom">
            <span
              class="badge rounded-pill mb-2 px-3 py-2"
              :class="getProductTypeBadgeClass()">
              {{ getProductTypeText() }}
            </span>
            <h4 class="fw-bold text-dark mb-2">{{ productName }}</h4>
            <p class="text-muted mb-0 fs-5">
              {{ transactionType === 'buy' ? '구매' : '판매' }}
            </p>
          </div>

          <!-- 약관 리스트 -->
          <div class="mb-4">
            <h5 class="fw-semibold text-dark mb-3">약관 동의</h5>

            <div class="list-group list-group-flush">
              <div
                v-for="term in getTermsForProduct()"
                :key="term.id"
                class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-start-0 border-end-0">
                <div class="form-check flex-grow-1">
                  <input
                    :id="`term-${term.id}`"
                    v-model="term.agreed"
                    class="form-check-input me-3"
                    type="checkbox"
                    @change="updateAgreementStatus" />
                  <label
                    class="form-check-label text-dark"
                    :for="`term-${term.id}`">
                    {{ term.title }}
                    <span
                      v-if="term.required"
                      class="text-danger ms-1 small"
                      >(필수)</span
                    >
                  </label>
                </div>
                <button
                  class="btn btn-outline-secondary btn-sm ms-2"
                  @click="showTermDetail(term)">
                  보기
                </button>
              </div>
            </div>

            <!-- 전체 동의 -->
            <div class="mt-4 pt-3 border-top">
              <div class="form-check">
                <input
                  id="allAgree"
                  v-model="allAgreed"
                  class="form-check-input me-3"
                  type="checkbox"
                  @change="toggleAllAgreement" />
                <label
                  class="form-check-label fw-semibold text-dark"
                  for="allAgree">
                  전체 약관에 동의합니다
                </label>
              </div>
            </div>
          </div>

          <!-- 주요 안내사항 -->
          <div class="mb-3">
            <h5 class="fw-semibold text-dark mb-3">주요 안내사항</h5>
            <div class="alert alert-light border">
              <ul class="mb-0 ps-3">
                <li
                  v-for="notice in getNoticesForProduct()"
                  :key="notice"
                  class="text-muted small mb-2">
                  {{ notice }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 모달 푸터 -->
        <div class="modal-footer border-top">
          <button
            type="button"
            class="btn btn-outline-secondary flex-fill me-2"
            @click="closeModal">
            취소
          </button>
          <button
            type="button"
            class="btn btn-primary flex-fill ms-2"
            :disabled="!canProceed"
            @click="handleConfirm">
            {{ transactionType === 'buy' ? '구매 진행' : '판매 진행' }}
          </button>
        </div>
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

// TermDetailModal 컴포넌트 정의
const TermDetailModal = {
  props: ['term'],
  emits: ['close'],
  template: `
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);" @click="$emit('close')">
      <div class="modal-dialog modal-dialog-centered modal-lg" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{ term.title }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
            <div class="text-muted" style="line-height: 1.6; white-space: pre-line;">
              {{ term.content }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary w-100" @click="$emit('close')">확인</button>
          </div>
        </div>
      </div>
    </div>
  `
};

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

// 약관 데이터
const depositTerms = ref([
  {
    id: 1,
    title: '예금거래 기본약관',
    required: true,
    agreed: false,
    content:
      '예금거래에 관한 기본적인 약관입니다...\n\n제1조 (목적)\n본 약관은 고객과 은행 간의 예금거래에 관한 기본적인 사항을 정함을 목적으로 합니다.\n\n제2조 (적용범위)\n본 약관은 모든 예금상품에 적용됩니다.'
  },
  {
    id: 2,
    title: '예금자보호법에 관한 사항',
    required: true,
    agreed: false,
    content:
      '예금자보호법 관련 내용입니다...\n\n예금보험공사는 예금자보호법에 따라 예금을 보호합니다.\n보호한도: 1인당 5천만원까지'
  },
  {
    id: 3,
    title: '금리변동 안내',
    required: true,
    agreed: false,
    content:
      '금리변동에 관한 안내사항입니다...\n\n시장금리 변동에 따라 예금금리가 변동될 수 있습니다.'
  },
  {
    id: 4,
    title: '세금 관련 안내',
    required: false,
    agreed: false,
    content: '세금 관련 안내사항입니다...\n\n이자소득에 대해서는 소득세법에 따라 세금이 부과됩니다.'
  }
]);

const fundTerms = ref([
  {
    id: 1,
    title: '집합투자규약',
    required: true,
    agreed: false,
    content:
      '집합투자규약 내용입니다...\n\n펀드의 운용방침, 투자대상, 수수료 등에 관한 사항을 규정합니다.'
  },
  {
    id: 2,
    title: '투자설명서',
    required: true,
    agreed: false,
    content:
      '투자설명서 내용입니다...\n\n펀드의 투자목적, 위험요소, 비용 등에 대한 상세한 설명입니다.'
  },
  {
    id: 3,
    title: '투자위험고지서',
    required: true,
    agreed: false,
    content:
      '투자위험에 관한 고지사항입니다...\n\n투자원금의 손실 가능성과 관련 위험요소들을 안내합니다.'
  },
  {
    id: 4,
    title: '펀드 수수료 안내',
    required: true,
    agreed: false,
    content:
      '펀드 수수료에 관한 안내입니다...\n\n판매수수료, 운용보수, 기타비용 등에 대한 안내입니다.'
  },
  {
    id: 5,
    title: '개인정보 수집·이용 동의',
    required: false,
    agreed: false,
    content: '개인정보 처리방침입니다...\n\n개인정보의 수집, 이용, 보관에 관한 사항을 안내합니다.'
  }
]);

const etfTerms = ref([
  {
    id: 1,
    title: 'ETF 투자설명서',
    required: true,
    agreed: false,
    content: 'ETF 투자설명서 내용입니다...\n\nETF의 투자목적, 기초지수, 운용방법 등을 설명합니다.'
  },
  {
    id: 2,
    title: '상장지수펀드 투자위험고지서',
    required: true,
    agreed: false,
    content:
      'ETF 투자위험 고지사항입니다...\n\n시장위험, 추적오차위험 등 ETF 투자시 발생할 수 있는 위험을 안내합니다.'
  },
  {
    id: 3,
    title: '거래수수료 안내',
    required: true,
    agreed: false,
    content: '거래수수료에 관한 안내입니다...\n\nETF 매매시 발생하는 수수료에 대한 안내입니다.'
  },
  {
    id: 4,
    title: '시장가격 변동 위험 안내',
    required: true,
    agreed: false,
    content: '시장가격 변동위험에 관한 내용입니다...\n\n시장상황에 따른 가격변동 위험을 안내합니다.'
  }
]);

// 컴퓨티드 속성
const canProceed = computed(() => {
  const terms = getTermsForProduct();
  return terms.filter(term => term.required).every(term => term.agreed);
});

// 메서드
function getModalTitle() {
  const typeText = getProductTypeText();
  const actionText = props.transactionType === 'buy' ? '구매' : '판매';
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

function getProductTypeBadgeClass() {
  const classMap = {
    deposit: 'text-bg-primary',
    fund: 'text-bg-warning',
    etf: 'text-bg-success'
  };
  return classMap[props.productType] || 'text-bg-secondary';
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

// 모달이 열릴 때 약관 상태 초기화
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
/* 부트스트랩 기본 스타일을 사용하므로 최소한의 커스텀 스타일만 추가 */
.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-input:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn:disabled {
  opacity: 0.65;
}

.list-group-item:last-child {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
</style>
