<template>
  <div class="list-search-page-container">
    <input
      type="text"
      v-model="search"
      placeholder="상품을 입력하세요"
      class="list-search-page-input" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useHeaderStore } from '@/stores/header';

const headerStore = useHeaderStore();
const search = ref('');

onMounted(() => {
  headerStore.setHeader({
    titleParts: [{ text: '상품 검색', color: 'var(--main01)' }],
    showBackButton: true,
    actions: []
  });
});

onBeforeRouteLeave((to, from) => {
  headerStore.resetHeader();
});
</script>

<style scoped>
.list-search-page-container {
  padding: 24px 16px;
}

.list-search-page-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--main03);
  border-radius: 12px;
  font-size: var(--font-size-md);
  outline: none;
}
</style>
