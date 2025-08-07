<template>
  <div class="sell-info-card">
    <div
      v-if="holdingQuantity !== undefined"
      class="info-row">
      <span class="info-label">보유 수량</span>
      <span class="info-value">{{ holdingQuantity ?? '-' }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">매도량</span>
      <div style="display: flex; align-items: center; gap: 4px">
        <input
          class="info-value-input"
          type="number"
          :min="1"
          :max="maxQuantity"
          :value="quantity"
          :disabled="disabled"
          @input="$emit('update:quantity', $event.target.valueAsNumber)" />
        <span style="font-size: 16px; color: #192440">주</span>
      </div>
    </div>
    <div class="info-row">
      <span class="info-label">매도 일시</span>
      <span class="info-value">
        <span>{{ saleDate }}</span
        ><br v-if="saleDateTime" />
        <span v-if="saleDateTime">{{ saleDateTime }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  holdingQuantity: Number,
  quantity: Number,
  maxQuantity: Number,
  saleDate: String,
  saleDateTime: String,
  disabled: Boolean
});
defineEmits(['update:quantity']);
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
}
</style>
