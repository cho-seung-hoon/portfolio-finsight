<template>
  <section
    class="fund-item-container"
    @click="goToDetail">
    <section class="fund-item-header-section">
      <div class="fund-item-sub-title">{{ item.country }} ・ {{ item.fund_type }}</div>
      <header class="fund-item-header">
        {{ item.product_name }}
        <IconHeartStroke />
      </header>
    </section>
    <section class="fund-item-content-section">
      <div class="info-row">
        <span class="label">수익률</span>
        <span class="value">{{ item.rate_of_return }} (3개월)</span>
      </div>
      <div class="info-row">
        <span class="label">위험등급</span>
        <span class="value">{{ item.risk_grade }}</span>
      </div>
      <div class="info-row">
        <span class="label">뉴스</span>
        <span class="value">{{ item.news_response }}</span>
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
  router.push(`/fund/${props.item.product_code}`);
}
</script>

<style scoped>
.fund-item-container {
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

.fund-item-header-section {
  display: flex;
  flex-direction: column;
}

.fund-item-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.fund-item-sub-title {
  display: flex;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.fund-item-content-section {
  display: flex;
  flex-direction: column;
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
