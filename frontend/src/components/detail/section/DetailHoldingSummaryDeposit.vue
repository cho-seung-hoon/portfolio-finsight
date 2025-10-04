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
            >{{ formatCurrency(calculatedAmount) }}</span
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
      return value && 
             typeof value === 'object';
    }
  }
});

const contractMonths = computed(() => {
  return props.data?.contractMonths || props.data?.desc?.contractMonths;
});

const calculatedContractDate = computed(() => {
  return props.data?.contractDate || 
         props.data?.desc?.contractDate || 
         props.data?.history?.[0]?.historyTradeDate || 
         props.data?.desc?.history?.[0]?.historyTradeDate || 
         null;
});

const calculatedMaturityDate = computed(() => {
  if (props.data?.maturityDate || props.data?.desc?.maturityDate) {
    return props.data?.maturityDate || props.data?.desc?.maturityDate;
  }
  
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

const calculatedAmount = computed(() => {
  // 여러 경로에서 예금액을 찾아보기
  const amount = props.data?.holdingsTotalPrice || 0;
                  // props.data?.desc?.holdingsTotalPrice ||;
                  // props.data?.holdingsTotalPrice || 0;
  return amount;
});

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '0원';
  
  try {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('ko-KR').format(numAmount) + '원';
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '0원';
  }
};

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
  border: 1px solid var(--main04);
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
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
}

.value {
  color: var(--main01);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-align: right;
}

.current-value {
  color: var(--sub01);
  font-weight: var(--font-weight-bold);
}
</style>
