<template>
  <div class="list-search-result-page-container">
    <section class="list-search-page-header">
      <div
        class="search-query-display"
        @click="goBack">
        {{ search }}
      </div>
    </section>
    <section class="list-search-page-contents">
      <section class="search-category-section">
        <h4 class="search-category-label">예금</h4>
        <SearchDepositItem
          v-for="item in deposits"
          :key="item.product_code"
          :item="item" />
        <button class="search-category-more-button">예금 더보기</button>
      </section>
      <section class="search-category-section">
        <h4 class="search-category-label">펀드</h4>
        <SearchFundItem
          v-for="item in funds"
          :key="item.product_code"
          :item="item" />
        <button class="search-category-more-button">펀드 더보기</button>
      </section>
      <section class="search-category-section">
        <h4 class="search-category-label">ETF</h4>
        <EtfItem
          v-for="item in etfs"
          :key="item.product_code"
          :item="item" />
        <button class="search-category-more-button">ETF 더보기</button>
      </section>
      <section class="search-category-section">
        <h4 class="search-category-label">관련 뉴스</h4>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchDepositItem from '@/components/search/SearchDepositItem.vue';
import SearchFundItem from '@/components/search/SearchFundItem.vue';
import EtfItem from '@/components/list/EtfItem.vue';
import { getSearchDeposits, getSearchFunds, getSearchEtfs } from '@/api/searchApi';

const route = useRoute();
const router = useRouter();
const search = ref('');
const deposits = ref([]);
const funds = ref([]);
const etfs = ref([]);

async function fetchDeposits() {
  deposits.value = await getSearchDeposits(search.value);
}

async function fetchFunds() {
  funds.value = await getSearchFunds(search.value);
}

async function fetchEtfs() {
  etfs.value = await getSearchEtfs(search.value);
}

onMounted(() => {
  search.value = route.query.query ?? '';
  fetchDeposits();
  fetchFunds();
  fetchEtfs();
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

.search-query-display {
  flex: 1;
  padding: 12px 28px;
  background-color: var(--main04);
  border: none;
  border-radius: 20px;
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

.list-search-page-contents {
  display: flex;
  flex-direction: column;
  margin-left: -20px;
  width: calc(100% + 40px);
}

.search-category-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 20px 40px;
  border-bottom: 12px solid var(--main04);
}

.search-category-label {
  color: var(--main02);
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-medium);
  padding: 0px 28px;
}

.search-category-more-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--main04);
  justify-content: center;
  padding: 12px;
  color: var(--main02);
  border-radius: 12px;
  font-size: var(--font-size-ms);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.search-category-more-button:active {
  transform: scale(0.98);
  background-color: var(--main03);
}
</style>
