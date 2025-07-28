<template>
  <!-- ResultMainSection start -->
  <section
    class="sub-title"
    style="margin-top: 20px">
    <div class="result-section">
      <h2>
        <span
          v-if="userType === 'stable'"
          class="highlight-stable"
          >안정형</span
        >
        <span
          v-if="userType === 'stableplus'"
          class="highlight-stableplus"
          >안정추구형</span
        >
        <span
          v-if="userType === 'neutral'"
          class="highlight-neutral"
          >위험중립형</span
        >
        <span
          v-if="userType === 'aggressive'"
          class="highlight-aggressive"
          >적극투자형</span
        >
        <span
          v-if="userType === 'veryaggressive'"
          class="highlight-veryaggressive"
          >공격투자형</span
        >
        <span class="highlight-white">을 위한 포트폴리오</span>
      </h2>
    </div>
  </section>
  <!-- ResultMainSection end -->

  <!-- GraphSection start -->
  <section class="sub-section">
    <div class="result-section">
      <h2>{{ userName }}님의 투자유형은?</h2>
      <br />
      <!-- 투자유형에 따라 그래프 보기 -->
      <img
        v-if="userType === 'stable'"
        src="/src/assets/styles/img/stableChart.PNG"
        alt="stableChart"
        class="chart-image" />
      <img
        v-if="userType === 'stableplus'"
        src="/src/assets/styles/img/stableplusChart.PNG"
        alt="stableplusChart"
        class="chart-image" />
      <img
        v-if="userType === 'neutral'"
        src="/src/assets/styles/img/neutralChart.PNG"
        alt="neutralChart"
        class="chart-image" />
      <img
        v-if="userType === 'aggressive'"
        src="/src/assets/styles/img/aggressiveChart.PNG"
        alt="aggressiveChart"
        class="chart-image" />
      <img
        v-else-if="userType === 'veryaggressive'"
        src="/src/assets/styles/img/veryaggressiveChart.PNG"
        alt="veryaggressiveChart"
        class="chart-image" />
    </div>
  </section>
  <!-- GraphSection end -->

  <section class="sub-section">
    <div class="result-section">
      <h2>현재 자산 비중</h2>
      <br />
      <!-- TableSection start -->
      <div class="table-container">
        <table class="table-main-style">
          <thead>
            <tr>
              <th class="table-header">상품별<br />종목</th>
              <th class="table-header">위험<br />등급</th>
              <th class="table-header">권장<br />비중</th>
              <th class="table-header">나의<br />자산 비중</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in portfolioData"
              :key="item.id"
              class="table-row">
              <td
                class="table-cell product-name"
                v-html="getShortProductName(item.productName)"></td>
              <td class="table-cell risk-grade">{{ item.riskGrade.replace('등급', '') }}</td>
              <td
                class="table-cell allocation"
                :class="getTableHighlightClass()">
                {{ getRecommendedAllocation(item.id) }}%
              </td>
              <td class="table-cell allocation user-allocation">{{ item.userAllocation }}%</td>
            </tr>
            <tr class="table-row summary-row">
              <td
                class="table-cell summary-label"
                colspan="2">
                위험자산 비중
              </td>
              <td
                class="table-cell allocation"
                :class="getTableHighlightClass()">
                {{ recommendedRiskAssetRatio }}%
              </td>
              <td class="table-cell allocation user-allocation">{{ userRiskAssetRatio }}%</td>
            </tr>
            <tr class="table-row summary-row">
              <td
                class="table-cell summary-label"
                colspan="2">
                포트폴리오 위험도
              </td>
              <td
                class="table-cell allocation"
                :class="getTableHighlightClass()">
                {{ recommendedPortfolioRisk }}
              </td>
              <td class="table-cell allocation user-allocation">{{ userPortfolioRisk }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- TableSection end -->

      <!-- NoticeSection start -->
      <small class="notice">
        * 모범규준을 기초로 모델포트폴리오 내 편입 예정인 개별 금융상품의 위험도를 고려하여,
        편입비중으로 가중평균하여 산출합니다.<br />
        * 반드시 투자자유형에 맞는 모델포트폴리오(MP)를 권유하여야 하며 투자자유형보다 위험등급이
        높은 MP는 가입이 불가합니다.<br />
        ** 위험자산군 = (매우높은위험+높은위험+다소높은위험)
      </small>
      <!-- NoticeSection end -->
    </div>
  </section>
</template>

<script setup>
// imports
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { usePortfolioStore } from '@/stores/portfolio';

// store
const portfolioStore = usePortfolioStore();

// router
const router = useRouter();
const goToMain = () => {
  router.push('/');
};

// computed properties
const userName = computed(() => portfolioStore.userName);
const userType = computed(() => portfolioStore.userType);
const userAllocationData = computed(() => portfolioStore.getUserAllocationData);

// 상품 정보 데이터
const productInfoData = [
  { id: 1, productName: '국내 주식형 펀드/ETF', riskGrade: '2등급' },
  { id: 2, productName: '국내 채권 혼합형 펀드/ETF', riskGrade: '5등급' },
  { id: 3, productName: '국내 채권형 펀드/ETF', riskGrade: '5등급' },
  { id: 4, productName: '국내 채권형 펀드/ETF', riskGrade: '6등급' },
  { id: 5, productName: '현금성(예금 등)', riskGrade: '6등급' },
  { id: 6, productName: '해외 주식형 펀드/ETF', riskGrade: '1등급' },
  { id: 7, productName: '해외 주식형 펀드/ETF', riskGrade: '2등급' },
  { id: 8, productName: '해외 주식형 펀드/ETF', riskGrade: '3등급' },
  { id: 9, productName: '해외 채권형 펀드/ETF', riskGrade: '4등급' }
];

// 포트폴리오 데이터 결합
const portfolioData = computed(() => {
  return productInfoData.map(product => {
    const userData = userAllocationData.value.find(item => item.id === product.id);
    return {
      ...product,
      userAllocation: userData ? userData.userAllocation : 0
    };
  });
});

// 위험자산 비중 데이터
const riskAssetRatioData = {
  stable: { user: 0, recommended: 0 },
  stableplus: { user: 22, recommended: 22 },
  neutral: { user: 48, recommended: 48 },
  aggressive: { user: 60, recommended: 60 },
  veryaggressive: { user: 91, recommended: 91 }
};

// 포트폴리오 위험도 데이터
const portfolioRiskData = {
  stable: { user: 6.0, recommended: 6.0 },
  stableplus: { user: 5.0, recommended: 5.0 },
  neutral: { user: 4.04, recommended: 4.04 },
  aggressive: { user: 3.5, recommended: 3.5 },
  veryaggressive: { user: 2.45, recommended: 2.45 }
};

const userRiskAssetRatio = computed(() => {
  return riskAssetRatioData[userType.value]?.user || 0;
});

const recommendedRiskAssetRatio = computed(() => {
  return riskAssetRatioData[userType.value]?.recommended || 0;
});

const userPortfolioRisk = computed(() => {
  return portfolioRiskData[userType.value]?.user || 0;
});

const recommendedPortfolioRisk = computed(() => {
  return portfolioRiskData[userType.value]?.recommended || 0;
});

// 투자유형별 권장 비중 데이터
const recommendedAllocationData = {
  stable: {
    domesticStock: 0,
    domesticBondMixed: 0,
    domesticBond1: 98,
    domesticBond2: 98,
    cash: 2,
    overseasStock1: 0,
    overseasStock2: 0,
    overseasStock3: 0,
    overseasBond: 0
  },
  stableplus: {
    domesticStock: 7,
    domesticBondMixed: 12,
    domesticBond1: 5,
    domesticBond2: 59,
    cash: 2,
    overseasStock1: 0,
    overseasStock2: 10,
    overseasStock3: 5,
    overseasBond: 0
  },
  neutral: {
    domesticStock: 8,
    domesticBondMixed: 10,
    domesticBond1: 6,
    domesticBond2: 34,
    cash: 2,
    overseasStock1: 0,
    overseasStock2: 28,
    overseasStock3: 12,
    overseasBond: 0
  },
  aggressive: {
    domesticStock: 10,
    domesticBondMixed: 0,
    domesticBond1: 10,
    domesticBond2: 23,
    cash: 2,
    overseasStock1: 4,
    overseasStock2: 32,
    overseasStock3: 14,
    overseasBond: 5
  },
  veryaggressive: {
    domesticStock: 21,
    domesticBondMixed: 0,
    domesticBond1: 5,
    domesticBond2: 2,
    cash: 2,
    overseasStock1: 8,
    overseasStock2: 40,
    overseasStock3: 22,
    overseasBond: 0
  }
};

// 현재 투자유형의 권장 비중 가져오기
const getRecommendedAllocation = productId => {
  const currentType = userType.value;
  const data = recommendedAllocationData[currentType];

  if (!data) return 0;

  const allocationMap = {
    1: data.domesticStock,
    2: data.domesticBondMixed,
    3: data.domesticBond1,
    4: data.domesticBond2,
    5: data.cash,
    6: data.overseasStock1,
    7: data.overseasStock2,
    8: data.overseasStock3,
    9: data.overseasBond
  };

  return allocationMap[productId] || 0;
};

// methods
const getTableHighlightClass = () => {
  const classMap = {
    stable: 'table-highlight-stable',
    stableplus: 'table-highlight-stableplus',
    neutral: 'table-highlight-neutral',
    aggressive: 'table-highlight-aggressive',
    veryaggressive: 'table-highlight-veryaggressive'
  };
  return classMap[userType.value] || 'table-highlight-neutral';
};

// 모바일 최적화를 위한 상품명 축약
const getShortProductName = fullName => {
  const shortNames = {
    '국내 주식형 펀드/ETF': '국내 주식형<br>펀드/ETF',
    '국내 채권 혼합형 펀드/ETF': '국내 채권<br>혼합형',
    '국내 채권형 펀드/ETF': '국내 채권형<br>펀드/ETF',
    '현금성(예금 등)': '현금성<br>(예금 등)',
    '해외 주식형 펀드/ETF': '해외 주식형<br>펀드/ETF',
    '해외 채권형 펀드/ETF': '해외 채권형<br>펀드/ETF'
  };
  return shortNames[fullName] || fullName;
};
</script>

<style scoped>
/* TitleSection styles */
.main-section {
  background: var(--main01);
  padding: 32px 32px 24px 32px;
  text-align: left;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}

.main-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--main05);
}

.sub-title {
  background: var(--main01);
  padding: 10px 3px 5px 3px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
}

/* MainSection styles */
.sub-section {
  margin-bottom: 30px;
  border: 3px solid var(--main03);
  border-radius: 5px;
  background-color: var(--main05);
  height: auto;
}

.result-section {
  margin: 10px 10px 10px 10px;
}

/* Button Styles */
.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.title-button-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* GraphSection style */
.chart-image {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 350px;
  height: auto;
}

/* TableSection style */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-main-style {
  border-collapse: collapse;
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  background: var(--main01);
  color: white;
  font-weight: 600;
  padding: 8px 4px;
  text-align: center;
  font-size: 12px;
  border: none;
  line-height: 1.2;
  word-break: keep-all;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-row.summary-row {
  background-color: #f8f9fa;
  border-top: 2px solid var(--main03);
}

.table-cell {
  padding: 8px 4px;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
  font-size: 12px;
  line-height: 1.3;
  word-break: keep-all;
}

.table-cell.product-name {
  text-align: left;
  font-weight: 500;
  color: var(--main01);
  font-size: 11px;
  padding-left: 8px;
  padding-right: 4px;
  line-height: 1.2;
  vertical-align: middle;
}

.table-cell.risk-grade {
  font-weight: 600;
  color: var(--main01);
}

.table-cell.allocation {
  font-weight: 600;
}

.table-cell.user-allocation {
  color: var(--main01);
  background-color: rgba(0, 123, 255, 0.1);
  border-left: 3px solid var(--main01);
}

.table-cell.summary-label {
  text-align: left;
  font-weight: 600;
  color: var(--main01);
  background-color: #f8f9fa;
}

.table-highlight-stable {
  color: var(--mint01);
  font-weight: bold;
  background-color: rgba(0, 200, 150, 0.1);
  border-left: 3px solid var(--mint01);
}

.table-highlight-veryaggressive {
  color: var(--red01);
  font-weight: bold;
  background-color: rgba(220, 53, 69, 0.1);
  border-left: 3px solid var(--red01);
}

.table-highlight-aggressive {
  color: var(--orange01);
  font-weight: bold;
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid var(--orange01);
}

.table-highlight-neutral {
  color: var(--yellow01);
  font-weight: bold;
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid var(--yellow01);
}

.table-highlight-stableplus {
  color: var(--green01);
  font-weight: bold;
  background-color: rgba(40, 167, 69, 0.1);
  border-left: 3px solid var(--green01);
}

/* Highlight styles */
.highlight-stable {
  color: var(--mint01);
  font-weight: bold;
}

.highlight-blue {
  color: var(--text-blue);
  font-weight: bold;
}

.highlight-red {
  color: var(--text-red);
  font-weight: bold;
}

.highlight-white {
  color: var(--main05);
  font-weight: bold;
}

.highlight-veryaggressive {
  color: var(--red01);
  font-weight: bold;
}

.highlight-aggressive {
  color: var(--orange01);
  font-weight: bold;
}

.highlight-neutral {
  color: var(--yellow01);
  font-weight: bold;
}

.highlight-stableplus {
  color: var(--green01);
  font-weight: bold;
}

/* NoticeSection style */
.notice {
  margin-top: 18px;
  font-size: var(--font-size-sm);
  color: #8c8c8c;
}
</style>
