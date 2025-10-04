<template>
  <div class="list-deposit-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onFilterChange" />
    <section class="list-deposit-page-contents">
      <DepositItem
        v-for="item in list"
        :key="item.productCode"
        :item="item" />
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
import { getDeposits } from '@/api/productApi';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import DepositItem from '@/components/list/DepositItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import LoadingSpinnerSmall from '@/assets/loading-spinner-small.gif';
import MovingBear from '@/assets/moving_bear.gif';

const filters = [{ key: 'sort', label: '정렬', options: ['기본금리순', '최고금리순'] }];
const selected = ref({ sort: '기본금리순' });
const sortMap = { 기본금리순: 'intr_rate', 최고금리순: 'intr_rate2' };

const onFilterChange = (key, value) => {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    deposit: { ...selected.value }
  });
};

const currentParams = () => ({
  sort: sortMap[selected.value.sort],
  is_matched: getFinFilters().isMatched
});

const { list, loading, sentinelEl, reset } = useInfiniteScroll(
  async ({ limit, offset }) => {
    const { sort, is_matched } = currentParams();
    return await getDeposits(sort, is_matched, limit, offset);
  },
  { pageSize: 4, deps: [selected] }
);

onMounted(async () => {
  const saved = getFinFilters().deposit || {};
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
.list-deposit-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

.list-deposit-page-contents {
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
