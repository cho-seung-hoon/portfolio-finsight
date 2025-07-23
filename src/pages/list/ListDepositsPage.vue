<template>
  <div class="list-deposits-page-container">
    <section class="list-deposits-page-filter-bar"></section>
    <section class="list-deposits-page-contents">
      <DepositsItem
        v-for="item in deposits"
        :key="item.product_code"
        :item="item" />
    </section>
  </div>
</template>

<script setup>
import DepositsItem from '@/components/list/DepositsItem.vue';

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
</script>

<style scoped>
.list-deposits-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
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
