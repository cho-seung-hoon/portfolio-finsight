<template>
  <div class="sell-info-card">
    <div class="info-row">
      <span class="info-label">만기일</span>
      <span class="info-value">{{ maturityDate }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">매도 일시</span>
      <span class="info-value">{{ saleDate }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  maturityDate: String,
  saleDate: String
});
</script>

<style scoped>
.sell-info-card {
  background: var(--white);
  border: 1px solid var(--main04);
  border-radius: 8px;
  margin: 0 20px 32px 20px;
  padding: 24px 28px;
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
