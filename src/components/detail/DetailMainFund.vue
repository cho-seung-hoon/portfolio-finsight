<template>
  <div class="main-section">
    <div class="product-bank">{{ bank }}</div>
    <div class="product-title-row">
      <div class="product-title">{{ title }}</div>
      <HeartToggle @toggle="handleHeartToggle" />
    </div>
    <div class="rate-box">
      <div class="rate-info left">
        <div class="rate-label">수익률 ({{ yieldMonths }}개월)</div>
        <div
          :class="yieldChangeColor"
          class="rate-value">
          <template v-if="yieldValue > 0">▲</template>
          <template v-else-if="yieldValue < 0">▼</template>
          {{ formattedYield }}%
        </div>
      </div>
      <div class="rate-divider"></div>
      <div class="rate-info right">
        <div class="rate-label">기준가(전일대비)</div>
        <div class="rate-value">{{ priceValue }}</div>
        <div
          :class="priceChangeColor"
          class="price-change">
          <template v-if="priceChange > 0">▲</template>
          <template v-else-if="priceChange < 0">▼</template>
          {{ Math.abs(priceChange).toLocaleString() }} ({{ priceChangeRate }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import HeartToggle from '@/components/common/HeartToggle.vue';

const props = defineProps({
  bank: String,
  title: String,
  yield: [String, Number], // 수익률 (3개월 고정)
  priceArr: Array, // [오늘 기준가, 전일 기준가]
  currentPrice: [Number, String], // 현재가
  priceChange: [Number, String], // 전일대비 변동금액
  priceChangePercent: [Number, String] // 전일대비 변동률
});

const yieldMonths = computed(() => {
  return 3; // 3개월로 고정
});

const yieldValue = computed(() => {
  if (!props.yield) return 0;

  if (typeof props.yield === 'string') {
    return parseFloat(props.yield);
  } else if (typeof props.yield === 'number') {
    return props.yield;
  } else {
    return 0;
  }
});

const formattedYield = computed(() => {
  if (!props.yield) return '-';
  return Math.abs(yieldValue.value).toFixed(2);
});

const yieldChangeColor = computed(() => {
  if (yieldValue.value > 0) return 'up';
  if (yieldValue.value < 0) return 'down';
  return '';
});

const todayPrice = computed(() => {
  if (!props.priceArr || props.priceArr.length === 0) return null;
  const price = props.priceArr[0];
  // Decimal 객체인 경우 toNumber() 사용, 아니면 그대로 사용
  return price && typeof price === 'object' && price.toNumber ? price.toNumber() : price;
});

const prevPrice = computed(() => {
  if (!props.priceArr || props.priceArr.length < 2) return null;
  const price = props.priceArr[1];
  // Decimal 객체인 경우 toNumber() 사용, 아니면 그대로 사용
  return price && typeof price === 'object' && price.toNumber ? price.toNumber() : price;
});

const priceValue = computed(() => {
  // 새로운 props가 있으면 사용, 없으면 기존 방식 사용
  if (props.currentPrice !== undefined && props.currentPrice !== null) {
    const price =
      typeof props.currentPrice === 'string' ? parseFloat(props.currentPrice) : props.currentPrice;
    return price.toLocaleString() + '원';
  }

  if (todayPrice.value === null) return '-';
  return todayPrice.value.toLocaleString() + '원';
});

const priceChange = computed(() => {
  // 새로운 props가 있으면 사용, 없으면 기존 방식 사용
  if (props.priceChange !== undefined && props.priceChange !== null) {
    const change =
      typeof props.priceChange === 'string' ? parseFloat(props.priceChange) : props.priceChange;
    return isNaN(change) ? 0 : +change.toFixed(2);
  }

  if (todayPrice.value === null || prevPrice.value === null) return 0;
  const change = todayPrice.value - prevPrice.value;
  return isNaN(change) ? 0 : +change.toFixed(2);
});

const priceChangeRate = computed(() => {
  // 새로운 props가 있으면 사용, 없으면 기존 방식 사용
  if (props.priceChangePercent !== undefined && props.priceChangePercent !== null) {
    const rate =
      typeof props.priceChangePercent === 'string'
        ? parseFloat(props.priceChangePercent)
        : props.priceChangePercent;
    return isNaN(rate) ? '' : rate.toFixed(2) + '%';
  }

  if (todayPrice.value === null || prevPrice.value === null || prevPrice.value === 0) return '';
  const rate = (priceChange.value / prevPrice.value) * 100;
  return isNaN(rate) ? '' : rate.toFixed(2) + '%';
});
const priceChangeColor = computed(() => {
  if (priceChange.value > 0) return 'up';
  if (priceChange.value < 0) return 'down';
  return '';
});

const handleHeartToggle = isActive => {
  // 하트 상태 변경 처리 (필요시 추가 로직 구현)
};
</script>

<style scoped>
.main-section {
  background: var(--main01);
  padding: 32px 32px 24px 32px;
  text-align: left;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}
.product-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  justify-content: space-between;
}
.product-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--main05);
}

.product-bank {
  font-size: 18px;
  font-weight: 500;
  color: var(--main05);
  margin-bottom: 4px;
}
.rate-box {
  background: var(--main05);
  border-radius: 20px;
  padding: 16px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}
.rate-info {
  text-align: center;
  flex: 1;
}
.rate-divider {
  width: 1px;
  height: 48px;
  background: #e0e0e0;
  margin: 0 30px;
}
.rate-label {
  font-size: 12px;
  color: var(--main02);
  margin-bottom: 2px;
}
.rate-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--main01);
}
.price-change {
  margin-left: 8px;
  font-size: 12px;
}
.up {
  color: var(--red01);
}
.down {
  color: var(--text-blue);
}
</style>
