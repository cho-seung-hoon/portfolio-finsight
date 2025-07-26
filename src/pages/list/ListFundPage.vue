<template>
  <div class="list-fund-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onChange" />
    <section class="list-fund-page-contents">
      <FundItem
        v-for="fund in funds"
        :key="fund.fund_code"
        :item="fund" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import FundItem from '@/components/list/FundItem.vue';

const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '국외'] },
  { key: 'fund_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['가나다순', '수익률순'] }
];

const selected = ref({
  country: '전체',
  fund_type: '전체',
  sort: '가나다순'
});

const funds = [
  {
    product_code: 'fund-001',
    country: '국내',
    fund_type: '주식형',
    product_name: '미래에셋자산배분TINA펀드',
    rate_of_return: 37.31,
    risk_grade: 1,
    news_response: '긍정'
  },
  {
    product_code: 'fund-002',
    country: '해외',
    fund_type: '채권형',
    product_name: '삼성 한국형TDF 2045',
    rate_of_return: 12.1,
    risk_grade: 3,
    news_response: '중립'
  }
];

// 마운트 시 로컬스토리지 반영 (없으면 default)
onMounted(() => {
  const fund = getFinFilters().fund || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(fund[opt.key]) ? fund[opt.key] : opt.options[0];
  });
});

// 값 변경 시 로컬스토리지 반영
function onChange(key, value) {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    fund: { ...selected.value }
  });
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
