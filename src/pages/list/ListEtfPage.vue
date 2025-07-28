<template>
  <div class="list-etf-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onChange" />
    <section class="list-etf-page-contents">
      <EtfItem
        v-for="item in etfs"
        :key="item.product_code"
        :item="item" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EtfItem from '@/components/list/EtfItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';

const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '국외'] },
  { key: 'etf_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['수익률순', '거래량순', '조회수순'] }
];

const selected = ref({
  country: '전체',
  etf_type: '전체',
  sort: '수익률순'
});

const etfs = [
  {
    product_code: 'etf-001',
    country: '국내',
    etf_type: '주식형',
    product_name: 'TIGER 미국S&P500',
    nav: 2000,
    volume: 3000,
    rate_of_return: '3.3% (1개월)',
    risk_grade: 3,
    news_response: {
      positive: 20,
      neutral: 30,
      negative: 50
    }
  },
  {
    product_code: 'etf-002',
    country: '국내',
    etf_type: '채권형',
    product_name: 'KODEX 200',
    nav: 10250,
    volume: 45700,
    rate_of_return: '1.1% (1개월)',
    risk_grade: 2,
    news_response: {
      positive: 30,
      neutral: 60,
      negative: 10
    }
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
    news_response: {
      positive: 62,
      neutral: 25,
      negative: 13
    }
  }
];

// 마운트 시 로컬스토리지 반영 (없으면 default)
onMounted(() => {
  const etf = getFinFilters().etf || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(etf[opt.key]) ? etf[opt.key] : opt.options[0];
  });
});

// 값 변경 시 로컬스토리지 반영
function onChange(key, value) {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    etf: { ...selected.value }
  });
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
