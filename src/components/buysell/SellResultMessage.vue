<template>
  <div
    v-if="result"
    class="result-message">
    <p>{{ result.message }}</p>
    <p>보유ID: {{ result.holdingId }}</p>
    <p v-if="type === 'quantity'">남은 수량: {{ result.remainingQuantity }}</p>
    <p v-else-if="type === 'amount'">남은 금액: {{ result.remainingAmount }}</p>
  </div>
</template>

<script setup>
defineProps({
  result: Object,
  type: String // 'quantity' or 'amount'
});
</script>

<style scoped>
.result-message {
  margin-top: 24px;
  background: var(--main04);
  border-radius: 8px;
  padding: 16px;
  color: var(--main01);
  font-size: var(--font-size-md);
  text-align: center;
}
</style>
