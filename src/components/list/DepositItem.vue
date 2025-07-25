<template>
  <section class="deposit-item-container">
    <section class="deposit-item-header-section">
      <header class="deposit-item-header">
        {{ item.product_name }}
        <IconHeartStroke />
      </header>
      <div class="deposit-item-sub-title">{{ item.company_name }}</div>
    </section>
    <section class="deposit-item-content-section">
      <div class="info-row">
        <span class="label">금리(1년)</span>
        <span class="value"> 최고 {{ item.intr_rate2 }}% | 기본 {{ item.intr_rate }}% </span>
      </div>
    </section>
  </section>
</template>

<script setup>
import { defineProps } from 'vue';
import IconHeartStroke from '../icons/IconHeartStroke.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.deposit-item-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--main04);
  background-color: var(--white);
  padding: 20px 28px;
  gap: 12px;
}

.deposit-item-header-section {
  display: flex;
  flex-direction: column;
}

.deposit-item-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.deposit-item-sub-title {
  display: flex;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.deposit-item-content-section {
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
  gap: 4px;
}

.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.label {
  width: 80px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
  flex-shrink: 0;
}

.value {
  font-size: 20px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
}
</style>
