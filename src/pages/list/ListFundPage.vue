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
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();

const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '국외'] },
  { key: 'fund_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['수익률순', '펀드규모순', '조회수순'] }
];

const selected = ref({
  country: '전체',
  fund_type: '전체',
  sort: '가나다순'
});

const funds = [
  {
    productCode: 'fund-001',
    productCountry: '국내',
    productType: '주식형',
    productName: '미래에셋자산배분TINA펀드',
    productRateOfReturn: 37.31,
    fundScale: 2000,
    productRiskGrade: 1,
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
    productCode: 'fund-002',
    productCountry: '해외',
    productType: '채권형',
    productName: '삼성 한국형TDF 2045',
    productRateOfReturn: 12.1,
    fundScale: 3000,
    productRiskGrade: 3,
    newsSentiment: {
      positive: 60,
      neutral: 20,
      negative: 20
    },
    userOwns: false,
    userWatches: false,
    isPopularInUserGroup: true
  },
  {
    productCode: 'fund-003',
    productCountry: '해외',
    productType: '채권형',
    productName: '삼성 한국형TDF 2045',
    productRateOfReturn: 12.1,
    fundScale: 3000,
    productRiskGrade: 3,
    newsSentiment: {
      positive: 30,
      neutral: 50,
      negative: 20
    },
    userOwns: true,
    userWatches: true,
    isPopularInUserGroup: false
  }
];

// 마운트 시 로컬스토리지 반영 (없으면 default)
onMounted(async () => {
  // 로딩 상태 초기화
  loadingStore.resetLoading();

  // 로딩 시작
  loadingStore.startLoading('펀드 목록을 불러오는 중...');

  // 0.5초 대기 (더미 데이터 로딩 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 500));

  const fund = getFinFilters().fund || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(fund[opt.key]) ? fund[opt.key] : opt.options[0];
  });

  // 로딩 종료
  loadingStore.stopLoading();
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
