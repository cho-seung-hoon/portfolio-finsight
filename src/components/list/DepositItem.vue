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
      <div
        v-if="item.isPopularInUserGroup"
        class="user-group-popular-badge">
        안정추구형 HOT
      </div>
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
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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
  animation: fadeSlideIn 0.6s ease;
  transition: transform 0.2s ease;
}

.deposit-item-container:active {
  transform: scale(0.98);
  background-color: var(--main04);
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

.user-group-popular-badge {
  margin-top: 4px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-medium);
  color: var(--green01);
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
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
}
</style>
