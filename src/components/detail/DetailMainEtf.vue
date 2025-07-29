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
        <div class="rate-label">현재 시세</div>
        <div class="rate-value">{{ formattedCurrentPrice }}</div>
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
  mainYield: [String, Number, Object], // 수익률 (개월 수와 값)
  currentPrice: String // 현재 시세
});

const yieldMonths = computed(() => {
  if (!props.mainYield) return 1;

  if (
    typeof props.mainYield === 'object' &&
    props.mainYield.value !== undefined &&
    props.mainYield.months !== undefined
  ) {
    return props.mainYield.months;
  }
  return 3; // 기본값
});

const yieldValue = computed(() => {
  if (!props.mainYield) return 0;

  if (
    typeof props.mainYield === 'object' &&
    props.mainYield.value !== undefined &&
    props.mainYield.months !== undefined
  ) {
    // 새로운 구조: { value: 2.5, months: 1 }
    return props.mainYield.value;
  } else if (typeof props.mainYield === 'string') {
    // 기존 문자열 구조
    return parseFloat(props.mainYield);
  } else if (typeof props.mainYield === 'number') {
    // 기존 숫자 구조
    return props.mainYield;
  } else {
    return 0;
  }
});

const formattedYield = computed(() => {
  if (!props.mainYield) return '-';
  return Math.abs(yieldValue.value);
});

const yieldChangeColor = computed(() => {
  if (yieldValue.value > 0) return 'up';
  if (yieldValue.value < 0) return 'down';
  return '';
});

const formattedCurrentPrice = computed(() => {
  if (!props.currentPrice) return '-';
  return props.currentPrice + '원';
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
.up {
  color: var(--red01);
}
.down {
  color: var(--text-blue);
}
</style>
