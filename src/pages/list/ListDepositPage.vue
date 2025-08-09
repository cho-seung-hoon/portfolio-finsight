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
import { getDeposits } from '@/api/productApi';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';

const filters = [{ key: 'sort', label: '정렬', options: ['기본금리순', '최고금리순'] }];
const selected = ref({
  sort: '기본금리순'
});
const deposits = ref([]);
const sortMap = {
  기본금리순: 'intr_rate',
  최고금리순: 'intr_rate2'
};

onMounted(async () => {
  const savedFilters = getFinFilters().deposit || {};

  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(savedFilters[opt.key])
      ? savedFilters[opt.key]
      : opt.options[0];
  });

  await fetchDeposits();
});

async function fetchDeposits() {
  const sortParam = sortMap[selected.value.sort];
  const isMatched = true;
  deposits.value = await getDeposits(sortParam, isMatched);
}

function onChange(key, value) {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    deposit: { ...selected.value }
  });

  fetchDeposits();
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
