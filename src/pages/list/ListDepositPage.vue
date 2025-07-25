<template>
  <div class="list-deposit-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onChange" />
    <section class="list-deposit-page-contents">
      <DepositItem
        v-for="item in deposits"
        :key="item.product_code"
        :item="item" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DepositItem from '@/components/list/DepositItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';

const filters = [{ key: 'sort', label: '정렬', options: ['가나다순', '수익률순'] }];
const selected = ref({
  sort: '가나다순'
});

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

// 마운트 시 로컬스토리지 반영 (없으면 default)
onMounted(() => {
  const deposit = getFinFilters().deposit || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(deposit[opt.key])
      ? deposit[opt.key]
      : opt.options[0];
  });
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
