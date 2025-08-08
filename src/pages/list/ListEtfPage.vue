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
import { ref, onMounted } from 'vue';
import EtfItem from '@/components/list/EtfItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();

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
    productCode: 'etf-001',
    productCountry: 'domestic',
    productType: 'equity',
    productName: 'TIGER 미국S&P500',
    productRiskGrade: 3,
    // nav: 2000,
    // volume: 3000,
    // rate_of_return: '3.3% (1개월)',
    newsSentiment: {
      positive: 20,
      neutral: 30,
      negative: 50
    },
    userOwns: true,
    userWatches: true,
    isPopularInUserGroup: true
  },
  {
    productCode: 'etf-002',
    productCountry: 'domestic',
    productType: 'mixed',
    productName: 'KODEX 200',
    productRiskGrade: 2,
    // nav: 10250,
    // volume: 45700,
    // rate_of_return: '1.1% (1개월)',
    newsSentiment: {
      positive: 30,
      neutral: 60,
      negative: 10
    },
    userOwns: true,
    userWatches: true,
    isPopularInUserGroup: false
  },
  {
    productCode: 'ETF003',
    productCountry: 'foreign',
    productType: 'bond',
    productName: 'ARIRANG 미국리츠',
    productRiskGrade: 4,
    // nav: 8760,
    // volume: 12800,
    // rate_of_return: '-0.8% (1개월)',
    newsSentiment: {
      positive: 62,
      neutral: 25,
      negative: 13
    },
    userOwns: true,
    userWatches: false,
    isPopularInUserGroup: false
  }
];

// 마운트 시 로컬스토리지 반영 (없으면 default)
onMounted(async () => {
  // 로딩 상태 초기화
  loadingStore.resetLoading();

  // 로딩 시작
  loadingStore.startLoading('ETF 목록을 불러오는 중...');

  // 0.5초 대기 (더미 데이터 로딩 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 500));

  const etf = getFinFilters().etf || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(etf[opt.key]) ? etf[opt.key] : opt.options[0];
  });

  // 로딩 종료
  loadingStore.stopLoading();
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
