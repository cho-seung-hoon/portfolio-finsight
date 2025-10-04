<template>
  <div class="holding-history">
    <div class="history-list">
      <div
        v-for="(record, index) in data"
        :key="index"
        class="history-item">
        <div class="history-header">
          <span class="date">{{ record.displayDate || record.historyTradeDate }}</span>
          <span
            class="quantity"
            :class="{ buy: record.isBuy, sell: record.isSell }">
            {{
              record.displayQuantity ||
              (record.historyQuantity > 0 ? '+' : '-') +
                formatNumberWithComma(new Decimal(record.historyQuantity || 0).toNumber())
            }}주
          </span>
        </div>
        <div class="history-details">
          <span class="price-per-unit"
            >1주당
            {{
              formatNumberWithComma(
                new Decimal(record.historyAmount || 0)
                  .dividedBy(record.historyQuantity || 1)
                  .toNumber()
              )
            }}원</span
          >
          <span
            class="total-amount"
            :class="{ buy: record.isBuy, sell: record.isSell }">
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
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

.quantity {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-align: right;
}

.history-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-per-unit {
  color: var(--main02);
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
}

.total-amount {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  text-align: right;
}

.quantity.buy,
.total-amount.buy {
  color: var(--text-blue);
}

.quantity.sell,
.total-amount.sell {
  color: var(--text-red);
}
</style>
