<template>
  <div class="holdings-summary">
    <div class="summary-card">
      <div class="summary-info">
        <div class="info-row">
          <span class="label">나의 투자 총 금액</span>
          <span class="value"
            >{{
              formatNumberWithComma(new Decimal(data.holdingsTotalPrice || 0).toNumber())
            }}원</span
          >
        </div>
        <div class="info-row">
          <span class="label">나의 현재 보유량</span>
          <span class="value"
            >{{
              formatNumberWithComma(new Decimal(data.holdingsTotalQuantity || 0).toNumber())
            }}주</span
          >
        </div>
        <div class="info-row">
          <span class="label">현재 1주당 금액</span>
          <span class="value"
            >{{
              formatNumberWithComma(new Decimal(data.currentPricePerUnit || 0).toNumber())
            }}원</span
          >
        </div>
        <div class="info-row">
          <span class="label">나의 현재 보유대금 (평가액)</span>
          <span class="value current-value"
            >{{
              formatNumberWithComma(new Decimal(data.currentTotalValue || 0).toNumber())
            }}원</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Decimal from 'decimal.js';
import { formatNumberWithComma } from '@/utils/numberUtils';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: value => {
      return (
        value.holdingsTotalPrice !== undefined &&
        value.holdingsTotalQuantity !== undefined &&
        value.currentPricePerUnit !== undefined &&
        value.currentTotalValue !== undefined
      );
    }
  }
});
</script>

<style scoped>
.holdings-summary {
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
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
}

.value {
  color: var(--black);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-align: right;
}

.current-value {
  color: var(--sub01);
  font-weight: var(--font-weight-bold);
}
</style>
