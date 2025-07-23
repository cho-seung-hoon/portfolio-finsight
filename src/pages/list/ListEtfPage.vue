<template>
  <div class="list-etf-page-container">
    <FilterSortBar
      :filters="filters"
      :showFilters="true"
      :sortOptions="sortOptions"
      :selectedSort="selectedSort"
      @filter-select="onFilterChange"
      @sort-select="onSortChange" />
    <section class="list-etf-page-contents">
      <EtfItem
        v-for="item in etfs"
        :key="item.product_code"
        :item="item" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EtfItem from '@/components/list/EtfItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';

// ETF 데이터
const etfs = [
  {
    product_code: 'ETF001',
    country: '국내',
    etf_type: '주식형',
    product_name: 'KODEX 200',
    nav: 2000,
    volume: 3000,
    rate_of_return: '3.3% (1개월)',
    risk_grade: 3,
    news_response: '긍정'
  },
  {
    product_code: 'ETF002',
    country: '국내',
    etf_type: '채권형',
    product_name: 'TIGER 국채3년',
    nav: 10250,
    volume: 45700,
    rate_of_return: '1.1% (1개월)',
    risk_grade: 2,
    news_response: '중립'
  },
  {
    product_code: 'ETF003',
    country: '국외',
    etf_type: '혼합형',
    product_name: 'ARIRANG 미국리츠',
    nav: 8760,
    volume: 12800,
    rate_of_return: '-0.8% (1개월)',
    risk_grade: 4,
    news_response: '부정'
  }
];

// 필터 옵션/선택값
const filters = ref([
  {
    key: 'country',
    label: '국가',
    selectedOption: '전체',
    options: ['전체', '국내', '국외']
  },
  {
    key: 'etf_type',
    label: '유형',
    selectedOption: '전체',
    options: ['전체', '주식형', '채권형', '혼합형']
  }
]);

const sortOptions = [
  { key: 'rate', label: '가나다순' },
  { key: 'nav', label: '기준가순' }
];

function onFilterChange({ filterKey, option }) {
  const filter = filters.value.find(f => f.key === filterKey);
  if (filter) filter.selectedOption = option;
}

function onSortChange(option) {
  selectedSort.value = option;
}

const selectedSort = ref(sortOptions[0]);
</script>

<style scoped>
.list-etf-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

.list-etf-page-filter-bar {
  display: flex;
  flex-direction: row;
}

.list-etf-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
