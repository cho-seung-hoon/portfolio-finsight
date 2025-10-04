<template>
  <div class="holding-history-deposit">
    <div class="history-list">
      <div
        v-for="(record, index) in latestRecord"
        :key="index"
        class="history-item">
        <div class="history-header">
          <span class="date">{{ formatDate(record.historyTradeDate) }}</span>
          <span
            class="quantity"
            :class="{ positive: record.historyQuantity > 0, negative: record.historyQuantity < 0 }">
            {{
              record.displayQuantity ||
              (record.historyQuantity > 0 ? '+' : '') +
                formatNumberWithComma(new Decimal(record.historyQuantity || 0).toNumber())
            }}주
          </span>
        </div>
        <div class="history-details">
          <span
            class="total-amount"
            :class="{ positive: record.historyAmount > 0, negative: record.historyAmount < 0 }">
            {{
              record.displayAmount ||
              (record.historyAmount > 0 ? '+' : '') +
                formatNumberWithComma(new Decimal(record.historyAmount || 0).toNumber())
            }}원
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Decimal from 'decimal.js';
import { formatNumberWithComma } from '@/utils/numberUtils';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    validator: value => {
      return value.every(
        item =>
          item.historyTradeDate !== undefined &&
          item.historyQuantity !== undefined &&
          item.historyAmount !== undefined
      );
    }
  }
});

const latestRecord = computed(() => {
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) {
    return [];
  }
  
  console.log('DetailHoldingHistoryDeposit - props.data:', props.data);
  
  const sortedData = [...props.data].sort((a, b) => {
    const dateA = new Date(a.historyTradeDate || 0);
    const dateB = new Date(b.historyTradeDate || 0);
    return dateB - dateA;
  });
  
  console.log('DetailHoldingHistoryDeposit - sortedData:', sortedData);
  console.log('DetailHoldingHistoryDeposit - latestRecord:', sortedData[0]);
  
  return [sortedData[0]];
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  } catch (error) {
    console.error('Error formatting date:', error, 'dateString:', dateString);
    return '-';
  }
};
</script>

<style scoped>
.holding-history-deposit {
  margin-bottom: 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background-color: var(--white);
  border: 1px solid var(--main04);
  border-radius: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  color: var(--black);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

.quantity {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  text-align: right;
}

.history-details {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.total-amount {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-align: right;
  color: var(--main01);
}

.quantity.positive,
.total-amount.positive {
  color: var(--text-blue);
}

.quantity.negative,
.total-amount.negative {
  color: var(--text-red);
}
</style>
