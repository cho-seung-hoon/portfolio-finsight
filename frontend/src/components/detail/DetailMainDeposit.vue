<template>
  <div class="main-section">
    <div class="product-bank">{{ bank }}</div>
    <div class="product-title-row">
      <div class="product-title">{{ title }}</div>
      <HeartToggle
        :product-code="productCode || productInfo?.productCode"
        category="deposit"
        :user-watches="productInfo?.userWatches || false"
        icon-color="white" />
    </div>
    <div class="rate-box">
      <div class="rate-info left">
        <div class="rate-label">최고금리</div>
        <div class="rate-value">연 {{ maxRate }}%</div>
        <div class="rate-desc">(12개월 세전)</div>
      </div>
      <div class="rate-divider"></div>
      <div class="rate-info right">
        <div class="rate-label">기본금리</div>
        <div class="rate-value">연 {{ baseRate }}%</div>
        <div class="rate-desc">(12개월 세전)</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeartToggle from '@/components/common/HeartToggle.vue';

const props = defineProps({
  bank: String,
  title: String,
  maxRate: Number,
  baseRate: Number,
  productCode: String,
  isWatched: Boolean,
  productInfo: Object
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
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--main05);
  margin-bottom: 4px;
}
.rate-box {
  background: var(--main05);
  border-radius: 8px;
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
.rate-desc {
  font-size: var(--font-size-sm);
  color: var(--main02);
}
</style>
