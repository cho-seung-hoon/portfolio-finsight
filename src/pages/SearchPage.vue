<template>
  <div class="list-search-page-container">
    <section class="list-search-page-header">
      <input
        :value="word"
        @input="handleInput"
        type="text"
        placeholder="상품을 입력하세요"
        class="list-search-page-input" />
      <button class="list-search-page-complete-button">완료</button>
    </section>
    <section class="list-search-page-content">
      <SearchSuggestItem
        v-for="(name, idx) in allProducts"
        :key="idx"
        :product-name="name"
        :search-word="word" />
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import SearchSuggestItem from '@/components/list/SearchSuggestItem.vue';
import { getSearchSuggestions } from '@/api/search';

const word = ref('');
const allProducts = ref([]);

watch(word, async newValue => {
  await fetchSuggestions(newValue);
});

function handleInput(event) {
  word.value = event.target.value;
}

async function fetchSuggestions(value) {
  if (!value.trim()) {
    allProducts.value = [];
    return;
  }

  try {
    const result = await getSearchSuggestions(value);
    allProducts.value = result.map(item => item.productName);
  } catch (err) {
    console.error('검색어 추천 가져오기 실패:', err);
    allProducts.value = [];
  }
}

onMounted(async () => {
  const stateQuery = window.history.state?.query;
  if (typeof stateQuery === 'string') {
    word.value = stateQuery;
    await fetchSuggestions(stateQuery);
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
  background-color: var(--white);
  border-bottom: 1px solid var(--main03);
}

.list-search-page-input {
  flex: 1;
  padding: 12px 28px;
  background-color: var(--main04);
  border: none;
  border-radius: 20px;
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
  white-space: nowrap;
}

.list-search-page-content {
  display: flex;
  flex-direction: column;
}
</style>
