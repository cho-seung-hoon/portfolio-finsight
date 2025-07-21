<template>
  <div class="tab-wrapper">
    <div class="tab-header">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: currentCategory === tab.value }"
        @click="goToTab(tab.value)">
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const tabs = [
  { label: '예금', value: 'deposits' },
  { label: '펀드', value: 'fund' },
  { label: 'ETF', value: 'etf' }
];

const currentCategory = computed(() => route.params.category);

function goToTab(category) {
  if (category !== currentCategory.value) {
    router.push(`/list/${category}`);
  }
}
</script>

<style scoped>
.tab-wrapper {
  margin-left: -20px;
  width: calc(100% + 40px);
}

.tab-header {
  padding: 0px 20px;
  display: flex;
  background-color: white;
  border-bottom: 1px solid var(--main03);
  gap: 20px;
}

.tab {
  text-align: center;
  padding: 16px 0px;
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-xl);
  color: var(--main02);
  position: relative;
  cursor: pointer;
}

.tab.active {
  color: var(--main01);
  font-weight: var(--font-weight-bold);
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0%;
  width: 100%;
  height: 2px;
  background-color: var(--main01);
  border-radius: 1px;
}
</style>
