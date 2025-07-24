<template>
  <div class="main-section">
    <div class="product-bank">{{ bank }}</div>
    <div class="product-title-row">
      <div class="product-title">{{ title }}</div>
      <IconFullHeart
        v-if="heartActive"
        class="heart-icon"
        @click="toggleHeart"
      />
      <IconEmptyHeart
        v-else
        class="heart-icon"
        @click="toggleHeart"
      />
    </div>
    <div class="rate-box">
      <div class="rate-info left">
        <div class="rate-label">수익률 (1개월)</div>
        <div class="rate-value">{{ yield1mValue }}</div>
      </div>
      <div class="rate-divider"></div>
      <div class="rate-info right">
        <div class="rate-label">기준가(전일대비)</div>
        <div class="rate-value">
          {{ priceValue }}
          <div :class="priceChangeColor" class="price-change">
            <template v-if="priceChange > 0">▲</template>
            <template v-else-if="priceChange < 0">▼</template>
            {{ Math.abs(priceChange).toLocaleString() }} ({{ priceChangeRate }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import IconEmptyHeart from '@/components/icons/IconEmptyHeart.vue';
import IconFullHeart from '@/components/icons/IconFullHeart.vue';

const props = defineProps({
  bank: String,
  title: String,
  yield: String, // '25.97%' 등 단일 문자열
  priceArr: Array  // [오늘 기준가, 전일 기준가]
});

const yield1mValue = computed(() => props.yield || '-');

const todayPrice = computed(() => props.priceArr && props.priceArr.length > 0 ? props.priceArr[0] : null);
const prevPrice = computed(() => props.priceArr && props.priceArr.length > 1 ? props.priceArr[1] : null);
const priceValue = computed(() => todayPrice.value !== null ? todayPrice.value.toLocaleString() + '원' : '-');
const priceChange = computed(() => {
  if (todayPrice.value === null || prevPrice.value === null) return 0;
  return +(todayPrice.value - prevPrice.value).toFixed(2);
});
const priceChangeRate = computed(() => {
  if (todayPrice.value === null || prevPrice.value === null || prevPrice.value === 0) return '';
  return ((priceChange.value / prevPrice.value) * 100).toFixed(2) + '%';
});
const priceChangeColor = computed(() => {
  if (priceChange.value > 0) return 'up';
  if (priceChange.value < 0) return 'down';
  return '';
});

const heartActive = ref(false);
function toggleHeart() {
  heartActive.value = !heartActive.value;
}
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
.heart-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  user-select: none;
  display: inline-block;
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