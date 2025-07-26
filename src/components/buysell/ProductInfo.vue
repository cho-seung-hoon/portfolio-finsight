<template>
  <div class="fund-info-card">
    <div class="fund-title">{{ title }}</div>
    <div class="fund-desc">{{ priceLabel }} {{ price?.toLocaleString() }}원</div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  price: Number,
  priceLabel: String
});
</script>

<style scoped>
.fund-info-card {
  background: var(--main01);
  border-radius: 8px;
  padding: 22px 28px 16px 28px;
  margin: 0 20px 24px 20px;
}
.fund-title {
  color: var(--main05);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 8px;
}
.fund-desc {
  color: var(--main05);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
}
</style>
