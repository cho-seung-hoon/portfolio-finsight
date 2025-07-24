<template>
  <section class="list-like-page-tab">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="['tab-btn', { active: selected === tab.value }]"
      @click="selectTab(tab.value)">
      {{ tab.label }}
    </button>
  </section>
  <section class="list-like-page-content">
    <DepositItem></DepositItem>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import DepositItem from '@/components/list/DepositItem.vue';

const headerStore = useHeaderStore();
const tabs = [
  { label: '예금', value: 'deposit' },
  { label: '펀드', value: 'fund' },
  { label: 'ETF', value: 'etf' }
];
const selected = ref('deposit');

function selectTab(tab) {
  selected.value = tab;
}

onMounted(() => {
  headerStore.setHeader({
    titleParts: [{ text: '찜한 목록', color: 'var(--main01)' }],
    showBackButton: true,
    actions: []
  });
});
</script>

<style scoped>
.list-like-page-tab {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  justify-content: center;
}

.tab-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-semi-bold);
  transition:
    background 0.15s,
    color 0.15s;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--main01);
  color: var(--white);
}
</style>
