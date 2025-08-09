<template>
  <div class="list-etf-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onChange" />
    <section class="list-etf-page-contents">
      <EtfItem
        v-for="item in etfs"
        :key="item.productCode"
        :item="item" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import EtfItem from '@/components/list/EtfItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import { getEtfs } from '@/api/productApi';

const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '해외'] },
  { key: 'etf_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['수익률순', '거래량순', '조회수순'] }
];

const selected = ref({
  country: '전체',
  etf_type: '전체',
  sort: '수익률순'
});

const etfs = ref([]);

const sortMap = {
  수익률순: 'rate_of_return',
  거래량순: 'volume',
  조회수순: 'view_count'
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
  const saved = getFinFilters().etf || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(saved[opt.key])
      ? saved[opt.key]
      : opt.options[0];
  });
  await fetchEtfs();
  window.addEventListener('isMatchedChanged', fetchEtfs);
});

onBeforeUnmount(() => {
  window.removeEventListener('isMatchedChanged', fetchEtfs);
});

async function fetchEtfs() {
  const sort = sortMap[selected.value.sort];
  const country = countryMap[selected.value.country];
  const type = typeMap[selected.value.etf_type];
  const isMatched = getFinFilters().isMatched || false;

  etfs.value = await getEtfs(sort, country, type, isMatched);
}

function onChange(key, value) {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    etf: { ...selected.value }
  });
  fetchEtfs();
}
</script>

<style scoped>
.list-etf-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}
.list-etf-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
