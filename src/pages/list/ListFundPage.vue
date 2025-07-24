<template>
  <div class="list-fund-page-container">
    <FilterSortBar
      :filters="filters"
      :showFilters="true"
      :sortOptions="sortOptions"
      :selectedSort="selectedSort"
      @filter-select="onFilterChange"
      @sort-select="onSortChange" />
    <section class="list-fund-page-contents">
      <FundItem
        v-for="fund in funds"
        :key="fund.fund_code"
        :item="fund" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import FundItem from '@/components/list/FundItem.vue';

const funds = [
  {
    fund_code: 'FUND123',
    country: '국내',
    fund_type: '주식형',
    product_name: '펀드A',
    rate_of_return: '37.31%',
    risk_grade: 1,
    news_response: '긍정'
  },
  {
    fund_code: 'FUND456',
    country: '해외',
    fund_type: '채권형',
    product_name: '펀드B',
    rate_of_return: '12.10%',
    risk_grade: 3,
    news_response: '중립'
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
    key: 'fund_type',
    label: '유형',
    selectedOption: '전체',
    options: ['전체', '주식형', '채권형', '혼합형']
  }
]);

const sortOptions = [
  { key: 'alphabetical', label: '가나다순' },
  { key: 'return', label: '수익률순' }
];

const selectedSort = ref(sortOptions[0]);

function onFilterChange({ filterKey, option }) {
  const filter = filters.value.find(f => f.key === filterKey);
  if (filter) filter.selectedOption = option;
}

function onSortChange(option) {
  selectedSort.value = option;
}
</script>

<style scoped>
.list-fund-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

.list-fund-page-filter-bar {
  display: flex;
  flex-direction: row;
}

.list-fund-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
