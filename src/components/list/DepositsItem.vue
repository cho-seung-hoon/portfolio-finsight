<template>
  <section class="deposits-item-container">
    <section class="deposits-item-header-section">
      <header class="deposits-item-header">
        {{ item.product_name }}
        <IconHeartStroke />
      </header>
      <div class="deposits-item-sub-title">{{ item.company_name }}</div>
    </section>
    <section class="deposits-item-content-section">
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
.deposits-item-container {
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

.deposits-item-header-section {
  display: flex;
  flex-direction: column;
}

.deposits-item-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.deposits-item-sub-title {
  display: flex;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.deposits-item-content-section {
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
