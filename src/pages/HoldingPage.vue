<template>
  <div class="holding-box">
    <div class="minimy">
      <MiniMy
        :total-valuation="miniMyData.currentTotal"
        :message="holdingData.message"
        :change="miniMyData.change"
        :change-percent="miniMyData.changePercent" />
    </div>
    <div
      class="portfolio"
      @click="goToPortfolio">
      <div class="portfolio-title">내 성향에 맞는 포트폴리오 보기</div>
      <div class="portfolio-icon">+</div>
    </div>
  </div>
  <div class="holding-box">
    <HoldingTotal
      :total-valuation="holdingTotalData.totalValuation"
      :time-deposit="holdingTotalData.timeDeposit"
      :domestic-investment="holdingTotalData.domesticInvestment"
      :foreign-investment="holdingTotalData.foreignInvestment"
      :message="holdingData.message" />
  </div>
  <div class="holding-box">
    <HoldingList :products="processedProducts" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HoldingTotal from '@/components/holding/HoldingTotal.vue';
import HoldingList from '@/components/holding/HoldingList.vue';
import MiniMy from '@/components/home/MiniMy.vue';
import { useLoadingStore } from '@/stores/loading';
import { useWebSocketStore } from '@/stores/websocket';
import { useSessionStore } from '@/stores/session.js';

const router = useRouter();
const loadingStore = useLoadingStore();
const webSocketStore = useWebSocketStore();
const sessionStore = useSessionStore();

const holdingData = ref({
  totalValuation: 0,
  message: '',
  timeDeposit: 0,
  domesticInvestment: 0,
  foreignInvestment: 0,
  fundHoldings: [],
  etfHoldings: [],
  depositHoldings: []
});

const goToPortfolio = () => {
  router.push('/holding/portfolio');
};

const processedProducts = computed(() => {
  const products = [];

  holdingData.value.depositHoldings.forEach((deposit, index) => {
    const history = deposit.history?.[0];

    const contractDate = deposit.contractDate || history?.historyTradeDate;
    const contractMonths = deposit.contractMonths || history?.contractMonths;

    let maturityDate = deposit.maturityDate;
    if (!maturityDate && contractDate && contractMonths) {
      try {
        const contract = new Date(contractDate);
        if (!isNaN(contract.getTime())) {
          contract.setMonth(contract.getMonth() + contractMonths);
          maturityDate = contract.toISOString();
        }
      } catch (error) {
        console.error('Error calculating maturityDate:', error);
      }
    }

    products.push({
      id: `deposit_${index}`,
      productType: '예금',
      bankName: deposit.productCompanyName,
      productName: deposit.productName,
      value: deposit.currentValuation,
      date: maturityDate
        ? new Date(maturityDate).toLocaleDateString('ko-KR').replace(/\.$/, '')
        : '만기일 없음',
      productCode: deposit.productCode,
      isWatched: deposit.isWatched,
      contractDate: contractDate,
      maturityDate: maturityDate,
      contractMonths: contractMonths
    });
  });

  holdingData.value.fundHoldings.forEach((fund, index) => {
    products.push({
      id: `fund_${index}`,
      productType: '펀드',
      tags: [fund.productCountry, fund.productType],
      productName: fund.productName,
      quantity: fund.currentHoldings,
      valuation: fund.currentValuation,
      returnRate: fund.priceChangePercent,
      returnAmount: fund.totalPriceChange,
      productCode: fund.productCode,
      productCompanyName: fund.productCompanyName,
      isWatched: fund.isWatched
    });
  });

  holdingData.value.etfHoldings.forEach((etf, index) => {
    products.push({
      id: `etf_${index}`,
      productType: 'ETF',
      tags: [etf.productCountry, etf.productType],
      productName: etf.productName,
      quantity: etf.currentHoldings,
      valuation: etf.currentValuation,
      returnRate: etf.priceChangePercent,
      returnAmount: etf.totalPriceChange,
      productCode: etf.productCode,
      productCompanyName: etf.productCompanyName,
      isWatched: etf.isWatched
    });
  });

  return products;
});

const calculatedInvestmentAmounts = computed(() => {
  let domesticTotal = 0;
  let foreignTotal = 0;

  holdingData.value.fundHoldings.forEach(fund => {
    if (fund.productCountry === '국내') {
      domesticTotal += fund.currentValuation;
    } else {
      foreignTotal += fund.currentValuation;
    }
  });

  holdingData.value.etfHoldings.forEach(etf => {
    if (etf.productCountry === '국내') {
      domesticTotal += etf.currentValuation;
    } else {
      foreignTotal += etf.currentValuation;
    }
  });

  return {
    domestic: domesticTotal,
    foreign: foreignTotal
  };
});

const miniMyData = computed(() => {
  const currentInvestmentTotal =
    calculatedInvestmentAmounts.value.domestic + calculatedInvestmentAmounts.value.foreign;

  let previousInvestmentTotal = 0;
  holdingData.value.fundHoldings.forEach(fund => {
    if (fund.previousDayPrice) {
      previousInvestmentTotal += fund.previousDayPrice * fund.currentHoldings;
    }
  });
  holdingData.value.etfHoldings.forEach(etf => {
    if (etf.previousDayPrice) {
      previousInvestmentTotal += etf.previousDayPrice * etf.currentHoldings;
    }
  });

  let change = 0;
  let changePercent = 0;

  if (previousInvestmentTotal > 0) {
    change = currentInvestmentTotal - previousInvestmentTotal;
    changePercent = (change / previousInvestmentTotal) * 100;
  }

  return {
    currentTotal: currentInvestmentTotal,
    change: change,
    changePercent: changePercent
  };
});

const holdingTotalData = computed(() => {
  return {
    totalValuation:
      holdingData.value.timeDeposit +
      calculatedInvestmentAmounts.value.domestic +
      calculatedInvestmentAmounts.value.foreign,
    timeDeposit: holdingData.value.timeDeposit,
    domesticInvestment: calculatedInvestmentAmounts.value.domestic,
    foreignInvestment: calculatedInvestmentAmounts.value.foreign
  };
});

const isMounted = ref(true);
const hasWebSocketSubscriptions = ref(false);
const receivedFirstMessage = ref(false);

const handleEtfRealtimeData = (data, productCode) => {
  if (!isMounted.value) return;

  console.log(`[ETF 실시간] ${productCode}:`, data);

  if (!receivedFirstMessage.value) {
    receivedFirstMessage.value = true;
    console.log('[웹소켓] 첫 메시지 수신, 로딩 종료');
    loadingStore.stopLoading();
  }

  const etfIndex = holdingData.value.etfHoldings.findIndex(etf => etf.productCode === productCode);

  if (etfIndex !== -1) {
    const etf = holdingData.value.etfHoldings[etfIndex];

    if (data.currentPrice !== undefined) {
      etf.currentValuation = Number((data.currentPrice * etf.currentHoldings).toFixed(2));
    }

    if (data.changeFromPrevDay !== undefined) {
      etf.priceChange = Number(data.changeFromPrevDay.toFixed(2));
      etf.totalPriceChange = Number((data.changeFromPrevDay * etf.currentHoldings).toFixed(2));
    }

    if (data.changeRateFromPrevDay !== undefined) {
      etf.priceChangePercent = data.changeRateFromPrevDay;
    }

    console.log(`[ETF 업데이트] ${productCode}:`, {
      currentValuation: etf.currentValuation,
      priceChange: etf.priceChange,
      priceChangePercent: etf.priceChangePercent,
      totalPriceChange: etf.totalPriceChange
    });

    holdingData.value.etfHoldings = [...holdingData.value.etfHoldings];
  }
};

const startEtfWebSocketSubscriptions = async () => {
  try {
    if (!webSocketStore.isConnected) {
      console.log('[ETF 구독] 웹소켓 연결 대기 중...');
      await webSocketStore.ensureConnection();
    }

    let subscriptionCount = 0;

    for (const etf of holdingData.value.etfHoldings) {
      if (etf.productCode) {
        const subscription = await webSocketStore.subscribeToEtf(etf.productCode, data => {
          if (isMounted.value) {
            handleEtfRealtimeData(data, etf.productCode);
          }
        });

        if (subscription) {
          subscriptionCount++;
          console.log(`[ETF 구독] ${etf.productName} (${etf.productCode}) 구독 성공`);
        } else {
          console.warn(`[ETF 구독] ${etf.productName} (${etf.productCode}) 구독 실패`);
        }
      }
    }

    // 구독이 하나라도 있으면 웹소켓 구독 상태를 true로 설정
    hasWebSocketSubscriptions.value = subscriptionCount > 0;

    // 구독이 없으면 바로 로딩 종료
    if (subscriptionCount === 0) {
      console.log('[웹소켓] 구독할 ETF가 없음, 로딩 종료');
      loadingStore.stopLoading();
    } else {
      console.log(`[웹소켓] ${subscriptionCount}개 ETF 구독 완료, 첫 메시지 대기 중...`);
    }
  } catch (error) {
    console.error('[ETF 웹소켓] 구독 실패:', error);
    loadingStore.stopLoading();
  }
};

const loadHoldingData = async () => {
  loadingStore.startLoading('보유 내역을 불러오는 중...');

  try {
    const token = sessionStore.accessToken;
    if (token) {
      try {
        console.log('[API] 보유 내역 API 호출 시작...');
        const response = await fetch('http://localhost:8080/holdings/details', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('[API] 응답 상태:', response.status, response.statusText);

        if (response.ok) {
          const apiData = await response.json();
          console.log('[API] 실제 보유 내역 데이터:', apiData);
          console.log('[API] etfHoldings 타입:', typeof apiData.etfHoldings);
          console.log('[API] etfHoldings 길이:', apiData.etfHoldings?.length);
          console.log('[API] etfHoldings 내용:', apiData.etfHoldings);

          holdingData.value = apiData;
          console.log('[API] 실제 보유 내역 데이터 로드 성공');
        } else {
          throw new Error(`API 응답 오류: ${response.status}`);
        }
      } catch (apiError) {
        console.error('[API] 실제 API 호출 실패:', apiError);
        console.log('[API] Mock 데이터 사용으로 전환');
        loadMockData();
      }
    } else {
      console.log('[MOCK] 토큰 없음, Mock 데이터 사용');
      loadMockData();
    }

    console.log('[웹소켓] 연결 상태:', webSocketStore.isConnected);
    console.log('[웹소켓] 현재 holdingData 상태:', holdingData.value);
    await startEtfWebSocketSubscriptions();
  } catch (error) {
    console.error('보유 내역 로드 실패, Mock 데이터 사용 :', error);
    loadMockData();
    loadingStore.stopLoading();
  }
};

const loadMockData = () => {
  const mockData = {};

  holdingData.value = mockData;
  console.log('[MOCK] Mock 데이터 로드 완료');
};

onMounted(async () => {
  loadingStore.resetLoading();

  await loadHoldingData();
});

onUnmounted(() => {
  isMounted.value = false;
});
</script>

<style scoped>
.holding-box {
  margin: var(--font-size-lg) 0;
}

.portfolio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--main01);
  color: var(--white);
  padding: var(--font-size-md);
  border-radius: 8px;
  cursor: pointer;
}

.portfolio-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

.portfolio-icon {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}
</style>
