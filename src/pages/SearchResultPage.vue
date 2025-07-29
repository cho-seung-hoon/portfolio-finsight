<template>
  <div class="list-search-result-page-container">
    <section class="list-search-page-header">
      <div
        class="search-query-display"
        @click="goBack">
        {{ search }}
      </div>
    </section>
    <section class="list-search-page-contents">
      <section class="search-category-section">
        <h4 class="search-category-label">예금</h4>
        <DepositItem
          v-for="item in deposits"
          :key="item.product_code"
          :item="item" />
        <button class="search-category-more-button">예금 더보기</button>
      </section>
      <section class="search-category-section">
        <h4 class="search-category-label">펀드</h4>
        <FundItem
          v-for="item in funds"
          :key="item.product_code"
          :item="item" />
        <button class="search-category-more-button">펀드 더보기</button>
      </section>
      <section class="search-category-section">
        <h4 class="search-category-label">ETF</h4>
        <EtfItem
          v-for="item in etfs"
          :key="item.product_code"
          :item="item" />
        <button class="search-category-more-button">ETF 더보기</button>
      </section>
      <section class="search-category-section">
        <h4 class="search-category-label">관련 뉴스</h4>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DepositItem from '@/components/list/DepositItem.vue';
import FundItem from '@/components/list/FundItem.vue';
import EtfItem from '@/components/list/EtfItem.vue';

const route = useRoute();
const router = useRouter();
const search = ref('');

const deposits = [
  {
    product_code: 'deposit-001',
    product_name: 'SH 첫만남우대예금',
    company_name: 'SH 수협은행',
    intr_rate: 1.2,
    intr_rate2: 2.8,
    userOwns: true,
    isPopularInUserGroup: false
  },
  {
    product_code: 'deposit-002',
    product_name: 'KB Star 정기예금',
    company_name: 'KB 국민은행',
    intr_rate: 1.5,
    intr_rate2: 3.0,
    userOwns: false,
    isPopularInUserGroup: true
  }
];

const funds = [
  {
    product_code: 'fund-001',
    country: '국내',
    fund_type: '주식형',
    product_name: '미래에셋자산배분TINA펀드',
    rate_of_return: 37.31,
    scale: 2000,
    risk_grade: 1,
    news_response: {
      positive: 20,
      neutral: 30,
      negative: 50
    },
    userOwns: true,
    isPopularInUserGroup: true
  },
  {
    product_code: 'fund-002',
    country: '해외',
    fund_type: '채권형',
    product_name: '삼성 한국형TDF 2045',
    rate_of_return: 12.1,
    scale: 3000,
    risk_grade: 3,
    news_response: {
      positive: 60,
      neutral: 20,
      negative: 20
    },
    userOwns: false,
    isPopularInUserGroup: true
  }
];

const etfs = [
  {
    product_code: 'etf-001',
    country: '국내',
    etf_type: '주식형',
    product_name: 'TIGER 미국S&P500',
    nav: 2000,
    volume: 3000,
    rate_of_return: '3.3% (1개월)',
    risk_grade: 3,
    news_response: {
      positive: 20,
      neutral: 30,
      negative: 50
    },
    userOwns: false,
    isPopularInUserGroup: true
  },
  {
    product_code: 'etf-002',
    country: '국내',
    etf_type: '채권형',
    product_name: 'KODEX 200',
    nav: 10250,
    volume: 45700,
    rate_of_return: '1.1% (1개월)',
    risk_grade: 2,
    news_response: {
      positive: 30,
      neutral: 60,
      negative: 10
    },
    userOwns: true,
    isPopularInUserGroup: false
  }
];

onMounted(() => {
  search.value = route.query.query ?? '';
});

function goBack() {
  router.push({
    path: '/search',
    state: {
      query: search.value
    }
  });
}
</script>

<style scoped>
.list-search-result-page-container {
  display: flex;
  flex-direction: column;
}

.list-search-page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-left: -20px;
  width: calc(100% + 40px);
  padding: 8px 20px;
  background-color: var(--white);
  border-bottom: 1px solid var(--main03);
}

.search-query-display {
  flex: 1;
  padding: 12px 28px;
  background-color: var(--main04);
  border: none;
  border-radius: 20px;
  font-size: var(--font-size-md);
  cursor: pointer;
  color: var(--main01);
}

.list-search-page-input {
  flex: 1;
  padding: 12px 16px;
  background-color: var(--main04);
  border: 1px solid var(--main03);
  border-radius: 12px;
  font-size: var(--font-size-md);
  outline: none;
}

.list-search-page-contents {
  display: flex;
  flex-direction: column;
  margin-left: -20px;
  width: calc(100% + 40px);
}

.search-category-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 20px 40px;
  border-bottom: 12px solid var(--main04);
}

.search-category-label {
  color: var(--main02);
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-medium);
  padding: 0px 28px;
}

.search-category-more-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--main04);
  justify-content: center;
  padding: 12px;
  color: var(--main02);
  border-radius: 12px;
  font-size: var(--font-size-ms);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.search-category-more-button:active {
  transform: scale(0.98);
  background-color: var(--main03);
}
</style>
