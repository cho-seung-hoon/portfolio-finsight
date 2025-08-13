<template>
  <div class="holding-history-deposit">
    <div class="history-list">
      <div
        v-for="(record, index) in latestRecord"
        :key="index"
        class="history-item">
        <div class="history-header">
          <span class="date">{{ formatDate(record.displayDate || record.historyTradeDate) }}</span>
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
                  .dividedBy(Math.abs(record.historyQuantity || 1))
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
import { computed } from 'vue';

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

// 최신 기록 하나만 보여주기
const latestRecord = computed(() => {
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) {
    return [];
  }
  // 가장 최신 기록을 맨 위에 표시 (날짜 기준으로 정렬)
  const sortedData = [...props.data].sort((a, b) => {
    const dateA = new Date(a.historyTradeDate || a.displayDate || 0);
    const dateB = new Date(b.historyTradeDate || b.displayDate || 0);
    return dateB - dateA; // 내림차순 (최신이 위)
  });
  return [sortedData[0]]; // 최신 기록 하나만 반환
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
  font-size: 14px;
  font-weight: 400;
  text-align: right;
}

/* Buy/Sell 색상 스타일 */
.quantity.buy,
.total-amount.buy {
  color: #007aff; /* 파란색 */
}

.quantity.sell,
.total-amount.sell {
  color: #ff3b30; /* 빨간색 */
}
</style>
