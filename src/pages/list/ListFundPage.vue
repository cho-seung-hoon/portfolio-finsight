<template>
  <div class="list-fund-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onFilterChange" />

    <section class="list-fund-page-contents">
      <FundItem
        v-for="fund in list"
        :key="fund.productCode"
        :item="fund" />
      <div
        v-if="loading"
        class="loading">
        <img
          :src="LoadingSpinnerSmall"
          width="30"
          height="30" />
      </div>
      <div
        v-if="!loading && !list.length"
        class="no-result">
        <img
          :src="MovingBear"
          class="bear"
          width="50"
          height="50" />
        조건에 맞는 상품이 없습니다
      </div>
      <div
        ref="sentinelEl"
        class="sentinel" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import FundItem from '@/components/list/FundItem.vue';
import { getFunds } from '@/api/productApi';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import LoadingSpinnerSmall from '@/assets/loading-spinner-small.gif';
import MovingBear from '@/assets/moving_bear.gif';

const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '해외'] },
  { key: 'fund_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['수익률순', '펀드규모순'] }
];
const selected = ref({ country: '전체', fund_type: '전체', sort: '수익률순' });
const sortMap = { 수익률순: 'rate_of_return', 펀드규모순: 'fund_scale' };
const countryMap = { 전체: undefined, 국내: 'domestic', 해외: 'foreign' };
const typeMap = { 전체: undefined, 주식형: 'equity', 채권형: 'bond', 혼합형: 'mixed' };

const onFilterChange = (key, value) => {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    fund: { ...selected.value }
  });
};

const currentParams = () => ({
  sort: sortMap[selected.value.sort],
  country: countryMap[selected.value.country],
  type: typeMap[selected.value.fund_type],
  is_matched: getFinFilters().isMatched
});

const { list, loading, sentinelEl, reset } = useInfiniteScroll(
  async ({ limit, offset }) => {
    const { sort, country, type, is_matched } = currentParams();
    return await getFunds(sort, country, type, is_matched, limit, offset);
  },
  { pageSize: 4, deps: [selected] }
);

onMounted(async () => {
  const saved = getFinFilters().fund || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(saved[opt.key])
      ? saved[opt.key]
      : opt.options[0];
  });

  await reset();

  window.addEventListener('isMatchedChanged', reset);
});

onBeforeUnmount(() => {
  window.removeEventListener('isMatchedChanged', reset);
});
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

.loading {
  padding: 12px;
  text-align: center;
}

.end,
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px;
  text-align: center;
  color: var(--main02);
  font-size: 14px;
}

.sentinel {
  height: 1px;
  width: 100%;
}
</style>
