<template>
  <div class="list-deposit-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onChange" />
    <section class="list-deposit-page-contents">
      <DepositItem
        v-for="item in deposits"
        :key="item.productCode"
        :item="item" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DepositItem from '@/components/list/DepositItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();

const filters = [{ key: 'sort', label: '정렬', options: ['기본금리순', '최고금리순'] }];
const selected = ref({
  sort: '기본금리순'
});

const deposits = [
  {
    productCode: 'deposit-001',
    productName: 'SH 첫만남우대예금',
    productCompanyName: 'SH 수협은행',
    userOwns: true,
    isPopularInUserGroup: false,
    productRiskGrade: 6,
    depositIntrRate: 1.2,
    depositIntrRate2: 2.8
  },
  {
    productCode: 'deposit-002',
    productName: 'KB Star 정기예금',
    productCompanyName: 'KB 국민은행',
    userOwns: false,
    isPopularInUserGroup: true,
    productRiskGrade: 6,
    depositIntrRate: 1.5,
    depositIntrRate2: 3.0
  }
];

// 마운트 시 로컬스토리지 반영 (없으면 default)
onMounted(async () => {
  // 로딩 상태 초기화
  loadingStore.resetLoading();

  // 로딩 시작
  loadingStore.startLoading('예금 목록을 불러오는 중...');

  // 0.5초 대기 (더미 데이터 로딩 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 500));

  const deposit = getFinFilters().deposit || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(deposit[opt.key])
      ? deposit[opt.key]
      : opt.options[0];
  });

  // 로딩 종료
  loadingStore.stopLoading();
});

// 정렬만 반영
function onChange(key, value) {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    deposit: { ...selected.value }
  });
}
</script>

<style scoped>
.list-deposit-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  margin-bottom: 60px;
}
.list-deposit-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
