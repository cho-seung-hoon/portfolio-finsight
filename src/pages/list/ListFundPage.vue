<template>
  <div class="list-fund-page-container">
    <FundItem
      v-for="fund in funds"
      :key="fund.fund_code"
      :item="fund" />
  </div>
</template>

<script setup>
import FundItem from '@/components/list/FundItem.vue';

const funds = [
  {
    fund_code: 'FUND123',
    country: '국내',
    fund_type: '주식형',
    product_name: '펀드A',
    rate_of_return: '37.31%',
    risk_grade: 1,
    news_response: '긍정'
  },
  {
    fund_code: 'FUND456',
    country: '해외',
    fund_type: '채권형',
    product_name: '펀드B',
    rate_of_return: '12.10%',
    risk_grade: 3,
    news_response: '중립'
  }
];
</script>

<style scoped>
.list-fund-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}
</style>
