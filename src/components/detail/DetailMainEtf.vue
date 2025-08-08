<template>
  <div class="main-section">
    <div class="product-bank">{{ productInfo?.productCompanyName || bank }}</div>
    <div class="product-title-row">
      <div class="product-title">{{ productInfo?.productName || title }}</div>
      <HeartToggle
        :is-active="productInfo?.isWatched || isWatched"
        @toggle="handleHeartToggle" />
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
import { computed } from 'vue';
import HeartToggle from '@/components/common/HeartToggle.vue';

const props = defineProps({
  productInfo: Object, // 새로운 구조: productInfo 객체
  // 기존 개별 props (하위 호환성을 위해 유지)
  bank: String,
  title: String,
  yield: [String, Number], // 수익률 (3개월 고정)
  currentPrice: String, // 현재 시세
  isWatched: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['heart-toggle']);

const yieldValue = computed(() => {
  // productInfo가 있으면 productInfo에서 가져오고, 없으면 기존 props 사용
  // 웹소켓의 change_rate1s를 우선적으로 사용
  const yieldData =
    props.productInfo?.change_rate1s ||
    props.productInfo?.changeRate ||
    props.productInfo?.percent_change_from_yesterday ||
    props.yield;

  if (!yieldData) return 0;

  if (typeof yieldData === 'string') {
    return parseFloat(yieldData);
  } else if (typeof yieldData === 'number') {
    return yieldData;
  } else {
    return 0;
  }
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
  // productInfo가 있으면 productInfo에서 가져오고, 없으면 기존 props 사용
  const price = props.productInfo?.currentPrice || props.currentPrice;

  if (!price) return '-';

  // 숫자인 경우 포맷팅
  if (typeof price === 'number') {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  }

  // 문자열인 경우 그대로 사용
  return price + '원';
});

const handleHeartToggle = isActive => {
  emit('heart-toggle', isActive);
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
.up {
  color: var(--red01);
}
.down {
  color: var(--text-blue);
}
</style>
