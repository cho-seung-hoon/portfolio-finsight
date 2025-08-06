<template>
  <div class="main-section">
    <div class="product-bank">{{ bank }}</div>
    <div class="product-title-row">
      <div class="product-title">{{ title }}</div>
      <HeartToggle
        :is-active="isWatched"
        @toggle="handleHeartToggle" />
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
