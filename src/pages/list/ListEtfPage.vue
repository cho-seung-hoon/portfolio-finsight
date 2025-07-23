<template>
  <div class="list-etf-page-container">
    <EtfItem
      v-for="item in etfs"
      :key="item.product_code"
      :item="item" />
  </div>
</template>

<script setup>
import EtfItem from '@/components/list/EtfItem.vue';

const etfs = [
  {
    product_code: 'ETF001',
    country: '국내',
    etf_type: '주식형',
    product_name: 'KODEX 200',
    nav: 2000,
    volume: 3000,
    rate_of_return: '3.3% (1개월)',
    risk_grade: 3,
    news_response: '긍정'
  },
  {
    product_code: 'ETF002',
    country: '국내',
    etf_type: '채권형',
    product_name: 'TIGER 국채3년',
    nav: 10250,
    volume: 45700,
    rate_of_return: '1.1% (1개월)',
    risk_grade: 2,
    news_response: '중립'
  },
  {
    product_code: 'ETF003',
    country: '국외',
    etf_type: '리츠형',
    product_name: 'ARIRANG 미국리츠',
    nav: 8760,
    volume: 12800,
    rate_of_return: '-0.8% (1개월)',
    risk_grade: 4,
    news_response: '부정'
  }
];
</script>

<style scoped>
.list-etf-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}
</style>
