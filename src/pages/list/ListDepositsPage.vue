<template>
  <div class="list-deposits-page-container">
    <FilterSortBar
      :filters="filters"
      :showFilters="false"
      :sortOptions="sortOptions"
      :selectedSort="selectedSort"
      @filter-select="onFilterChange"
      @sort-select="onSortChange" />
    <section class="list-deposits-page-contents">
      <DepositsItem
        v-for="item in deposits"
        :key="item.product_code"
        :item="item" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DepositsItem from '@/components/list/DepositsItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';

const deposits = [
  {
    product_code: 'SH123',
    product_name: '시그니처 정기예금',
    company_name: '신한은행',
    intr_rate: 1.2,
    intr_rate2: 2.8
  },
  {
    product_code: 'KB123',
    product_name: '플러스 정기예금',
    company_name: '국민은행',
    intr_rate: 1.5,
    intr_rate2: 3.0
  }
];

const sortOptions = [
  { key: 'alphabetical', label: '가나다순' },
  { key: 'return', label: '수익률순' }
];

const selectedSort = ref(sortOptions[0]);

function onSortChange(option) {
  selectedSort.value = option;
}
</script>

<style scoped>
.list-deposits-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

.list-deposits-page-filter-bar {
  display: flex;
  flex-direction: row;
}

.list-deposits-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
