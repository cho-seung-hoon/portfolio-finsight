<template>
  <div class="list-search-result-page-container">
    <section class="list-search-page-header">
      <div
        class="search-query-display"
        @click="goBack">
        {{ search }}
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useHeaderStore } from '@/stores/header';

const headerStore = useHeaderStore();
const route = useRoute();
const router = useRouter();
const search = ref('');

onMounted(() => {
  search.value = route.query.query ?? '';

  headerStore.setHeader({
    titleParts: [{ text: '검색 결과', color: 'var(--main01)' }],
    showBackButton: true,
    actions: []
  });
});

onBeforeRouteLeave(() => {
  headerStore.resetHeader();
});

function goBack() {
  router.push({
    path: '/search',
    state: {
      query: search.value
    }
  });
}
</script>

<style scoped>
.list-search-result-page-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-search-page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-left: -20px;
  width: calc(100% + 40px);
  padding: 12px 20px;
  background-color: var(--main05);
  border-bottom: 1px solid var(--main03);
}

.search-query-display {
  flex: 1;
  padding: 12px 16px;
  background-color: var(--main04);
  border: 1px solid var(--main03);
  border-radius: 12px;
  font-size: var(--font-size-md);
  cursor: pointer;
  color: var(--main01);
}

.list-search-page-input {
  flex: 1;
  padding: 12px 16px;
  background-color: var(--main04);
  border: 1px solid var(--main03);
  border-radius: 12px;
  font-size: var(--font-size-md);
  outline: none;
}
</style>
