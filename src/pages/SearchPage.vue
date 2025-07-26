<template>
  <div class="list-search-page-container">
    <section class="list-search-page-header">
      <input
        v-model="search"
        type="text"
        placeholder="상품을 입력하세요"
        class="list-search-page-input" />
      <button class="list-search-page-complete-button">완료</button>
    </section>
    <section class="list-search-page-content">
      <SearchSuggestItem
        v-for="(name, idx) in allProducts"
        :key="idx"
        :product-name="name" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import SearchSuggestItem from '@/components/list/SearchSuggestItem.vue';

const search = ref('');

const allProducts = [
  '삼성전자',
  '삼성전자우',
  '삼성SDI',
  '삼성전기',
  '삼성바이오로직스',
  '삼성물산',
  '삼성생명',
  '삼성화재'
];

onMounted(() => {
  const stateQuery = window.history.state?.query;

  if (typeof stateQuery === 'string') {
    search.value = stateQuery;
    window.history.replaceState({}, '');
  }
});
</script>

<style scoped>
.list-search-page-container {
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
  padding: 8px 20px;
  background-color: var(--main05);
  border-bottom: 1px solid var(--main03);
}

.list-search-page-input {
  flex: 1;
  padding: 12px 16px;
  background-color: var(--main04);
  border: none;
  border-radius: 12px;
  font-size: var(--font-size-md);
  outline: none;
}

.list-search-page-complete-button {
  padding: 8px 12px;
  border-radius: 12px;
  border: none;
  background-color: var(--main01);
  color: var(--main05);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.list-search-page-content {
  display: flex;
  flex-direction: column;
}
</style>
