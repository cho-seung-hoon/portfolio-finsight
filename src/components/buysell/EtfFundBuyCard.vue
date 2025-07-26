<template>
  <div class="sell-info-card">
    <div class="info-row">
      <span class="info-label">매수량</span>
      <input
        class="info-value-input"
        type="number"
        :value="quantity"
        min="1"
        max="99"
        autocomplete="off"
        @input="onInputQuantity" />
      <span style="margin-left: 4px">좌</span>
    </div>
    <div class="info-row">
      <span class="info-label">매수일</span>
      <span class="info-value">{{ buyDate }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  quantity: Number,
  buyDate: String,
  priceLabel: String,
  price: Number
});
const emit = defineEmits(['update:quantity']);

function onInputQuantity(event) {
  let val = Number(event.target.value);
  if (val > 99) val = 99;
  if (val < 1) val = 1;
  emit('update:quantity', val);
}
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
.info-value-input {
  width: 80px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--main01);
  border: 1px solid var(--main04);
  border-radius: 4px;
  padding: 4px 8px;
  text-align: right;
  background: var(--white);
}
</style>
