<template>
  <div class="holding-box">
    <div class="portfolio">
      <div class="portfolio-title">내 성향에 맞는 포트폴리오 보기</div>
      <div class="portfolio-icon">+</div>
    </div>
  </div>
  <div class="holding-box">
    <HoldingTotal/>
  </div>
  <div class="holding-box">
    <HoldingList :products="data" />
  </div>
</template>

<script setup>
import HoldingTotal from '@/components/holding/HoldingTotal.vue';
import HoldingList from '@/components/holding/HoldingList.vue';

const data = [
  // 예금 데이터
  {
    productType: '예금',
    bankName: '튼튼은행',
    productName: '첫거래우대 정기예금',
    value: 5000000,
    date: '2025-05-20',
    status: '만기'
  },
  {
    productType: '예금',
    bankName: '희망은행',
    productName: '내맘대로 적금',
    value: 3000000,
    date: '2026-01-15',
    status: '해지'
  },
  {
    productType: '예금',
    bankName: '미래은행',
    productName: '비대면 자유예금',
    value: 10000000,
    date: '2025-12-31',
    status: '정상' // 정상 status 추가
  },
  // 펀드 데이터
  {
    productType: '펀드',
    tags: ['해외', '주식형'],
    productName: '글로벌 IT 리더 증권투자신탁',
    quantity: 150.5, // 좌
    valuation: 3250000
  },
  {
    productType: '펀드',
    tags: ['국내', '채권형'],
    productName: '안정성장 국공채 펀드',
    quantity: 500, // 좌
    valuation: 5120000
  },
  // ETF 데이터
  {
    productType: 'ETF',
    tags: ['해외', '주식형'],
    productName: 'TIGER 미국 S&P500',
    quantity: 50, // 주
    valuation: 750000
  },
  {
    productType: 'ETF',
    tags: ['해외', '주식형'],
    productName: 'KODEX 2차전지산업',
    quantity: 100, // 주
    valuation: 1890000
  },
  {
    productType: 'ETF',
    tags: ['해외', '주식형'],
    productName: 'TIGER 미국 S&P500',
    quantity: 50, // 주
    valuation: 750000
  },
  {
    productType: 'ETF',
    tags: ['해외', '주식형'],
    productName: 'KODEX 2차전지산업',
    quantity: 100, // 주
    valuation: 1890000
  }
];
</script>

<style scoped>
.holding-box{
  margin:20px 0px;
}
.portfolio{
  display: flex;
  justify-content: space-between;
  background-color: var(--main01);
  color:var(--white);
  padding:20px;
  padding:10px 20px;
  border-radius: 8px;
}

</style>
