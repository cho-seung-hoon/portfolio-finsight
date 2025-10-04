<template>
  <div class="buy-info-card">
    <div class="buy-product-title">
      <div>{{ title }}</div>
      <div
        v-if="bank"
        class="buy-product-bank">
        {{ bank }}
      </div>
    </div>
    <div
      v-if="price"
      class="info-row">
      <span class="info-label">{{ priceLabel || '현재 1주당' }}</span>
      <span class="info-value">{{ price?.toLocaleString() }}원</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  bank: String,
  price: Number,
  priceLabel: String
});
</script>

<style scoped>
.buy-info-card {
  background: var(--main01);
  border-radius: 8px;
  padding: 22px 28px 16px 28px;
  margin: 0 20px 24px 20px;
}
.buy-product-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--main05);
  margin-bottom: 8px;
}
.buy-product-bank {
  font-size: var(--font-size-md);
  color: var(--main02);
  margin-top: 2px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.info-label {
  color: var(--main02);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  flex: 1;
  text-align: left;
}
.info-value {
  color: var(--main01);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  flex: 1;
  text-align: right;
}
</style>
