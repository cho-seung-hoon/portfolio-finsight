<template>
  <div class="holdings-summary-deposit">
    <div class="summary-card">
      <div class="summary-info">
        <div class="info-row">
          <span class="label">예금 체결일</span>
          <span class="value">{{ formatDate(calculatedContractDate) }}</span>
        </div>
        <div class="info-row">
          <span class="label">예금 만료일</span>
          <span class="value">{{ formatDate(calculatedMaturityDate) }}</span>
        </div>
        <div class="info-row">
          <span class="label">예금액</span>
          <span class="value current-value"
            >{{ new Decimal(data.holdingsTotalPrice || 0).toNumber().toLocaleString() }}원</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Decimal from 'decimal.js';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: value => {
      // contractDate와 maturityDate는 undefined일 수 있음 (해지된 상품 등)
      // holdingsTotalPrice는 0을 포함한 모든 숫자값 허용
      return value && 
             typeof value === 'object' && 
             (value.holdingsTotalPrice !== undefined && value.holdingsTotalPrice !== null);
    }
  }
});

// contract_months (백엔드에서 받은 실제 값 사용)
const contractMonths = computed(() => {
  return props.data?.contractMonths || props.data?.desc?.contractMonths;
});

// 체결일 계산 (이미 계산된 값 우선, 없으면 history에서 계산)
const calculatedContractDate = computed(() => {
  return props.data?.contractDate || 
         props.data?.desc?.contractDate || 
         props.data?.history?.[0]?.historyTradeDate || 
         props.data?.desc?.history?.[0]?.historyTradeDate || 
         null;
});

// 만료일 계산 (이미 계산된 값 우선, 없으면 계산)
const calculatedMaturityDate = computed(() => {
  // 이미 계산된 maturityDate가 있으면 사용
  if (props.data?.maturityDate || props.data?.desc?.maturityDate) {
    return props.data?.maturityDate || props.data?.desc?.maturityDate;
  }
  
  // contractDate가 있으면 contract_months를 더해서 계산
  if (calculatedContractDate.value && contractMonths.value) {
    try {
      const contract = new Date(calculatedContractDate.value);
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

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};
</script>

<style scoped>
.holdings-summary-deposit {
  margin-bottom: 20px;
}

.summary-card {
  background-color: var(--white);
  border: 1px solid var(--main03);
  border-radius: 8px;
  padding: 20px;
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 24px;
}

.label {
  color: var(--main02);
  font-size: 16px;
  font-weight: 400;
}

.value {
  color: var(--black);
  font-size: 16px;
  font-weight: 500;
  text-align: right;
}

.current-value {
  color: var(--sub01);
  font-weight: 700;
}
</style>
