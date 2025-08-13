<template>
  <div class="holdings-summary-deposit">
    <div class="summary-card">
      <div class="summary-info">
        <div class="info-row">
          <span class="label">예금 체결일</span>
          <span class="value">{{ formatDate(data.contractDate) }}</span>
        </div>
        <div class="info-row">
          <span class="label">예금 만료일</span>
          <span class="value">{{ formatDate(data.maturityDate) }}</span>
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
