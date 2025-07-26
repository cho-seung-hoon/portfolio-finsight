<template>
  <div class="sell-info-card">
    <div class="info-row">
      <span class="info-label">기간 선택</span>
      <select
        class="info-value-input"
        :value="period"
        @change="$emit('update:period', $event.target.value)">
        <option value="6">6개월</option>
        <option value="12">12개월</option>
      </select>
    </div>
    <div class="info-row">
      <span class="info-label">예금 시작일</span>
      <span class="info-value">{{ startDate }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">예금액</span>
      <input
        class="info-value-input"
        type="number"
        :value="amount && amount.value !== undefined ? amount.value : amount"
        min="1"
        max="10000000"
        @input="onInputAmount"
        autocomplete="off" />
      <span style="margin-left: 4px">원</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['period', 'startDate', 'amount']);
const emit = defineEmits(['update:period', 'update:amount']);

function onInputAmount(event) {
  let val = Number(event.target.value);
  if (val > 10000000) val = 10000000;
  if (val < 1) val = 1;
  emit('update:amount', val);
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
  width: 100px;
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
