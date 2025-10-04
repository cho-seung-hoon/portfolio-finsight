<template>
  <div class="list-search-result-page-container">
    <section class="list-search-page-header">
      <div
        class="search-query-display"
        :class="{ placeholder: isPlaceholder }"
        @click="goBack">
        {{ isPlaceholder ? '상품을 입력하세요.' : search }}
      </div>
    </section>

    <div
      v-if="isPlaceholder"
      class="no-result">
      검색 결과가 없습니다.
    </div>

    <section
      v-else
      class="list-search-page-contents">
      <!-- 예금 -->
      <section
        v-if="deposits.items.length"
        class="search-category-section">
        <h4 class="search-category-label">예금</h4>
        <SearchDepositItem
          v-for="item in deposits.items"
          :key="item.productCode"
          :item="item" />
        <button
          v-if="deposits.hasNext"
          class="search-category-more-button"
          :disabled="deposits.loading"
          @click="loadMore('deposit')">
          예금 더보기
        </button>
      </section>

      <!-- 펀드 -->
      <section
        v-if="funds.items.length"
        class="search-category-section">
        <h4 class="search-category-label">펀드</h4>
        <SearchFundItem
          v-for="item in funds.items"
          :key="item.productCode"
          :item="item" />
        <button
          v-if="funds.hasNext"
          class="search-category-more-button"
          :disabled="funds.loading"
          @click="loadMore('fund')">
          펀드 더보기
        </button>
      </section>

      <!-- ETF -->
      <section
        v-if="etfs.items.length"
        class="search-category-section">
        <h4 class="search-category-label">ETF</h4>
        <SearchEtfItem
          v-for="item in etfs.items"
          :key="item.productCode"
          :item="item" />
        <button
          v-if="etfs.hasNext"
          class="search-category-more-button"
          :disabled="etfs.loading"
          @click="loadMore('etf')">
          ETF 더보기
        </button>
      </section>

      <!-- 검색어는 있는데 모든 결과가 비었을 때 -->
      <div
        v-if="!deposits.items.length && !funds.items.length && !etfs.items.length"
        class="no-result">
        검색 결과가 없습니다.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchDepositItem from '@/components/search/SearchDepositItem.vue';
import SearchFundItem from '@/components/search/SearchFundItem.vue';
import SearchEtfItem from '@/components/search/SearchEtfItem.vue';
import { getSearchDepositsPaged, getSearchFundsPaged, getSearchEtfsPaged } from '@/api/searchApi';

const route = useRoute();
const router = useRouter();
const search = ref('');
const isPlaceholder = computed(() => !search.value?.trim());

// 페이징 관련
const deposits = ref({ items: [], page: 0, size: 4, hasNext: false, loading: false });
const funds = ref({ items: [], page: 0, size: 4, hasNext: false, loading: false });
const etfs = ref({ items: [], page: 0, size: 4, hasNext: false, loading: false });

// 공통 로더
async function load(state, fetcher) {
  if (state.loading) return;
  state.loading = true;
  try {
    const res = await fetcher(search.value, state.page, state.size);
    state.items = state.page === 0 ? res.items : state.items.concat(res.items);
    state.hasNext = !!res.hasNext;
    if (res.hasNext) state.page += 1;
  } catch (e) {
    console.error('검색 로드 실패:', e);
  } finally {
    state.loading = false;
  }
}

async function initAll() {
  await Promise.all([
    load(deposits.value, getSearchDepositsPaged),
    load(funds.value, getSearchFundsPaged),
    load(etfs.value, getSearchEtfsPaged)
  ]);
}

async function loadMore(kind) {
  if (kind === 'deposit') return load(deposits.value, getSearchDepositsPaged);
  if (kind === 'fund') return load(funds.value, getSearchFundsPaged);
  if (kind === 'etf') return load(etfs.value, getSearchEtfsPaged);
}

onMounted(async () => {
  search.value = route.query.query ?? '';
  if (!isPlaceholder.value) await initAll();
});

function goBack() {
  router.push({ path: '/search', state: { query: search.value } });
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

.search-query-display.placeholder {
  color: var(--main02);
}

.no-result {
  padding: 40px 20px;
  text-align: center;
  color: var(--main02);
  font-size: var(--font-size-md);
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
