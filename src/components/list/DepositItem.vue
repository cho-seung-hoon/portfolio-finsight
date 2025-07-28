<template>
  <section
    class="deposit-item-container"
    @click="goToDetail">
    <section class="deposit-item-header-section">
      <div class="deposit-item-sub-title">{{ item.company_name }}</div>
      <header class="deposit-item-header">
        <div class="deposit-item-title-left">
          {{ item.product_name }}
          <span
            v-if="item.userOwns"
            class="own-tag">
            보유중
          </span>
        </div>
        <IconHeartStroke />
      </header>
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
import { useRouter } from 'vue-router';
import IconHeartStroke from '../icons/IconHeartStroke.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const router = useRouter();

function goToDetail() {
  router.push(`/deposit/${props.item.product_code}`);
}
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
  cursor: pointer;
}

.deposit-item-header-section {
  display: flex;
  flex-direction: column;
}

.deposit-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.deposit-item-title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.own-tag {
  background-color: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: 2px 4px;
  border-radius: 4px;
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
