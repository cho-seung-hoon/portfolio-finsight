<template>
  <div class="holding-history">
    <div class="history-list">
      <div
        v-for="(record, index) in data"
        :key="index"
        class="history-item">
        <div class="history-header">
          <span class="date">{{ record.historyTradeDate }}</span>
          <span
            class="quantity"
            :class="{
              positive: record.historyQuantity > 0,
              negative: record.historyQuantity < 0
            }">
            {{ record.historyQuantity > 0 ? '+' : ''
            }}{{ new Decimal(record.historyQuantity || 0).toNumber().toLocaleString() }}좌
          </span>
        </div>
        <div class="history-details">
          <span class="price-per-unit"
            >1좌당
            {{
              new Decimal(record.historyAmount || 0)
                .dividedBy(record.historyQuantity || 1)
                .toNumber()
                .toLocaleString()
            }}원</span
          >
          <span
            class="total-amount"
            :class="{
              positive: record.historyAmount > 0,
              negative: record.historyAmount < 0
            }">
            {{ record.historyAmount > 0 ? '+' : ''
            }}{{ new Decimal(record.historyAmount || 0).toNumber().toLocaleString() }}원
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Decimal from 'decimal.js';

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
</script>

<style scoped>
.holding-history {
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
  padding: 16px;
  background-color: var(--white);
  border: 1px solid var(--main03);
  border-radius: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  color: var(--black);
  font-size: 16px;
  font-weight: 500;
}

.quantity {
  color: var(--black);
  font-size: 16px;
  font-weight: 500;
  text-align: right;
}

.history-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-per-unit {
  color: var(--main02);
  font-size: 14px;
  font-weight: 400;
}

.total-amount {
  color: var(--main02);
  font-size: 14px;
  font-weight: 400;
  text-align: right;
}

.positive {
  color: var(--black);
}

.negative {
  color: var(--main02);
}
</style>
