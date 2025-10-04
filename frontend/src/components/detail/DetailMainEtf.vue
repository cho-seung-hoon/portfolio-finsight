<template>
  <div class="main-section">
    <div class="product-bank">{{ productInfo?.productCompanyName || bank }}</div>
    <div class="product-title-row">
      <div class="product-title">{{ productInfo?.productName || title }}</div>
      <HeartToggle
        :product-code="productInfo?.productCode || productCode"
        category="etf"
        :user-watches="productInfo?.userWatches || false"
        icon-color="white" />
    </div>
    <div class="rate-box">
      <div class="rate-info left">
        <div class="rate-label">전일대비 수익률</div>
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
        <div class="rate-label">현재 시세 (1주)</div>
        <div class="rate-value">{{ formattedCurrentPrice }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import HeartToggle from '@/components/common/HeartToggle.vue';

const props = defineProps({
  productInfo: Object,
  bank: String,
  title: String,
  yield: [String, Number],
  currentPrice: String,
  isWatched: {
    type: Boolean,
    default: false
  },
  realtimeData: Object,
  changeRateFromPrevDay: [String, Number],
  productCode: String
});

const yieldValue = computed(() => {
  if (props.changeRateFromPrevDay !== undefined && props.changeRateFromPrevDay !== null) {
    const changeRate = Number(props.changeRateFromPrevDay);
    if (!isNaN(changeRate)) return changeRate;
  }

  if (props.realtimeData?.changeRateFromPrevDay !== undefined) {
    return Number(props.realtimeData.changeRateFromPrevDay);
  }

  const yieldData =
    props.productInfo?.price?.priceChangePercent ?? props.productInfo?.changeRateFromPrevDay;
  if (!yieldData) return 0;

  return typeof yieldData === 'string' ? parseFloat(yieldData) : yieldData;
});

const formattedYield = computed(() => {
  if (!yieldValue.value) return '-';
  return Math.abs(yieldValue.value).toFixed(2);
});

const yieldChangeColor = computed(() => {
  if (yieldValue.value > 0) return 'up';
  if (yieldValue.value < 0) return 'down';
  return '';
});

const formattedCurrentPrice = computed(() => {
  const price =
    props.realtimeData?.currentPrice ??
    props.productInfo?.price?.currentPrice ??
    props.productInfo?.currentPrice;
  if (!price) return '-';

  return typeof price === 'number'
    ? new Intl.NumberFormat('ko-KR').format(price) + '원'
    : price + '원';
});
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
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--main05);
}

.product-bank {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
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
  background: var(--main03);
  margin: 0 30px;
}
.rate-label {
  font-size: var(--font-size-sm);
  color: var(--main02);
  margin-bottom: 2px;
}
.rate-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
}
.up {
  color: var(--red01);
}
.down {
  color: var(--text-blue);
}
</style>
