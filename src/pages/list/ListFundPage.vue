<template>
  <div class="list-fund-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onChange" />
    <section class="list-fund-page-contents">
      <FundItem
        v-for="fund in funds"
        :key="fund.productCode"
        :item="fund" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import FundItem from '@/components/list/FundItem.vue';
import { getFunds } from '@/api/productApi';

const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '해외'] },
  { key: 'fund_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['수익률순', '펀드규모순'] }
];
const selected = ref({
  country: '전체',
  fund_type: '전체',
  sort: '수익률순'
});
const funds = ref([]);
const sortMap = {
  수익률순: 'rate_of_return',
  펀드규모순: 'fund_scale'
};
const countryMap = {
  전체: undefined,
  국내: 'domestic',
  해외: 'foreign'
};
const typeMap = {
  전체: undefined,
  주식형: 'equity',
  채권형: 'bond',
  혼합형: 'mixed'
};

onMounted(async () => {
  const saved = getFinFilters().fund || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(saved[opt.key])
      ? saved[opt.key]
      : opt.options[0];
  });
  await fetchFunds();
  window.addEventListener('isMatchedChanged', fetchFunds);
});

onBeforeUnmount(() => {
  window.removeEventListener('isMatchedChanged', fetchFunds);
});

async function fetchFunds() {
  const sort = sortMap[selected.value.sort];
  const country = countryMap[selected.value.country];
  const type = typeMap[selected.value.fund_type];
  const isMatched = getFinFilters().isMatched || false;

  funds.value = await getFunds(sort, country, type, isMatched);
}

function onChange(key, value) {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    fund: { ...selected.value }
  });
  fetchFunds();
}
</script>

<style scoped>
.list-fund-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}
.list-fund-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
