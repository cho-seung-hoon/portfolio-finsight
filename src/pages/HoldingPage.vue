<template>
  <div class="holding-box">
    <div class="minimy">
      <MiniMy />
    </div>
    <div
      class="portfolio"
      @click="goToPortfolio">
      <div class="portfolio-title">내 성향에 맞는 포트폴리오 보기</div>
      <div class="portfolio-icon">+</div>
    </div>
  </div>
  <div class="holding-box">
    <HoldingTotal />
  </div>
  <div class="holding-box">
    <HoldingList :products="data" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HoldingTotal from '@/components/holding/HoldingTotal.vue';
import HoldingList from '@/components/holding/HoldingList.vue';
import MiniMy from '@/components/home/MiniMy.vue';
import { useLoadingStore } from '@/stores/loading';

const router = useRouter();
const loadingStore = useLoadingStore();

// 포트폴리오 페이지로 이동
const goToPortfolio = () => {
  router.push('/holding/portfolio');
};

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
    status: '정상'
  },
  // 펀드 데이터 (수익률 정보 추가)
  {
    productType: '펀드',
    tags: ['해외', '주식형'],
    productName: '글로벌 IT 리더 증권투자신탁',
    quantity: 150.5,
    valuation: 3250000,
    returnRate: 2.45, // 전일 대비 수익률
    returnAmount: 77500 // 전일 대비 수익 금액
  },
  {
    productType: '펀드',
    tags: ['국내', '채권형'],
    productName: '안정성장 국공채 펀드',
    quantity: 500,
    valuation: 5120000,
    returnRate: -1.23,
    returnAmount: -63840
  },
  {
    productType: '펀드',
    tags: ['국내', '혼합형'],
    productName: '균형성장 혼합형 펀드',
    quantity: 200,
    valuation: 2800000,
    returnRate: 0.87,
    returnAmount: 24080
  },
  // ETF 데이터 (수익률 정보 추가)
  {
    productType: 'ETF',
    tags: ['해외', '주식형'],
    productName: 'TIGER 미국 S&P500',
    quantity: 50,
    valuation: 750000,
    returnRate: 1.85,
    returnAmount: 13650
  },
  {
    productType: 'ETF',
    tags: ['국내', '주식형'],
    productName: 'KODEX 2차전지산업',
    quantity: 100,
    valuation: 1890000,
    returnRate: -3.42,
    returnAmount: -66780
  },
  {
    productType: 'ETF',
    tags: ['해외', '채권형'],
    productName: 'KODEX 미국채 10년',
    quantity: 75,
    valuation: 980000,
    returnRate: 0.56,
    returnAmount: 5440
  }
];

onMounted(async () => {
  // 로딩 상태 초기화
  loadingStore.resetLoading();

  // 로딩 시작
  loadingStore.startLoading('보유 내역을 불러오는 중...');

  // 0.5초 대기 (더미 데이터 로딩 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 500));

  // 로딩 종료
  loadingStore.stopLoading();
});
</script>

<style scoped>
.holding-box {
  margin: 20px 0px;
}

.portfolio {
  display: flex;
  justify-content: space-between;
  background-color: var(--main01);
  color: var(--white);
  padding: 20px;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
