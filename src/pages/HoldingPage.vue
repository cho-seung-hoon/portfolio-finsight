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
    <HoldingList 
      :products="processedProducts" />
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

const router = useRouter();
const loadingStore = useLoadingStore();
const webSocketStore = useWebSocketStore();

// 보유 내역 데이터
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

// 포트폴리오 페이지로 이동
const goToPortfolio = () => {
  router.push('/holding/portfolio');
};

// HoldingList용 데이터 변환 (필요한 데이터만 추출)
const processedProducts = computed(() => {
  const products = [];
  
  // 예금 데이터 변환 (필요한 필드만)
  holdingData.value.depositHoldings.forEach((deposit, index) => {
    const history = deposit.history?.[0];
    
    // contractDate와 contractMonths 계산
    const contractDate = deposit.contractDate || history?.historyTradeDate;
    const contractMonths = deposit.contractMonths || history?.contractMonths;
    
    // maturityDate 계산
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
      date: maturityDate ? new Date(maturityDate).toLocaleDateString('ko-KR').replace(/\.$/, '') : '만기일 없음',
      productCode: deposit.productCode,
      isWatched: deposit.isWatched,
      contractDate: contractDate,
      maturityDate: maturityDate,
      contractMonths: contractMonths
    });
  });

  // 펀드 데이터 변환 (필요한 필드만)
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

  // ETF 데이터 변환 (필요한 필드만)
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

// 국내/해외 투자 평가액 계산
const calculatedInvestmentAmounts = computed(() => {
  let domesticTotal = 0;
  let foreignTotal = 0;
  
  // 펀드 비율 계산
  holdingData.value.fundHoldings.forEach(fund => {
    if (fund.productCountry === '국내') {
      domesticTotal += fund.currentValuation;
    } else {
      foreignTotal += fund.currentValuation;
    }
  });
  
  // ETF 비율 계산
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

// MiniMy용 데이터 계산 (현재평가액, 전일대비차이, 전일대비차이퍼센트)
const miniMyData = computed(() => {
  // 현재 투자 평가액 (펀드 + ETF)
  const currentInvestmentTotal = calculatedInvestmentAmounts.value.domestic + calculatedInvestmentAmounts.value.foreign;
  
  // 전일 투자 평가액 (펀드 + ETF)
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
  
  // 전일 대비 차이와 퍼센트 계산
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

// HoldingTotal용 데이터 계산
const holdingTotalData = computed(() => {
  return {
    totalValuation: holdingData.value.timeDeposit + calculatedInvestmentAmounts.value.domestic + calculatedInvestmentAmounts.value.foreign,
    timeDeposit: holdingData.value.timeDeposit,
    domesticInvestment: calculatedInvestmentAmounts.value.domestic,
    foreignInvestment: calculatedInvestmentAmounts.value.foreign
  };
});

// 컴포넌트 마운트 상태 추적
const isMounted = ref(true);

// ETF 실시간 데이터 업데이트
const handleEtfRealtimeData = (data, productCode) => {
  // 컴포넌트가 언마운트된 경우 콜백 실행 중단
  if (!isMounted.value) return;
  
  console.log(`[ETF 실시간] ${productCode}:`, data);
  
  // ETF 데이터 업데이트
  const etfIndex = holdingData.value.etfHoldings.findIndex(
    etf => etf.productCode === productCode
  );
  
  if (etfIndex !== -1) {
    const etf = holdingData.value.etfHoldings[etfIndex];
    
        // 실시간 데이터로 업데이트
    if (data.currentPrice !== undefined) {
      etf.currentValuation = Number((data.currentPrice * etf.currentHoldings).toFixed(2));
    }
    
    // 전일대비 변화량 업데이트 (웹소켓 데이터 사용)
    if (data.changeFromPrevDay !== undefined) {
      etf.priceChange = Number(data.changeFromPrevDay.toFixed(2));
      etf.totalPriceChange = Number((data.changeFromPrevDay * etf.currentHoldings).toFixed(2));
    }
    
    // 전일대비 변화율 업데이트 (웹소켓 데이터 사용)
    if (data.changeRateFromPrevDay !== undefined) {
      etf.priceChangePercent = data.changeRateFromPrevDay;
    }
    
    console.log(`[ETF 업데이트] ${productCode}:`, {
      currentValuation: etf.currentValuation,
      priceChange: etf.priceChange,
      priceChangePercent: etf.priceChangePercent,
      totalPriceChange: etf.totalPriceChange
    });
    
    // 강제로 반응성 업데이트
    holdingData.value.etfHoldings = [...holdingData.value.etfHoldings];
  }
};

// ETF 웹소켓 구독 시작
const startEtfWebSocketSubscriptions = async () => {
  try {
    // 웹소켓 연결 상태 확인
    if (!webSocketStore.isConnected) {
      console.log('[ETF 구독] 웹소켓 연결 대기 중...');
      await webSocketStore.ensureConnection();
    }

    // 각 ETF에 대해 웹소켓 구독
    for (const etf of holdingData.value.etfHoldings) {
      if (etf.productCode) {
        const subscription = await webSocketStore.subscribeToEtf(
          etf.productCode, 
          (data) => {
            // 컴포넌트가 마운트된 상태에서만 콜백 실행
            if (isMounted.value) {
              handleEtfRealtimeData(data, etf.productCode);
            }
          }
        );
        
        if (subscription) {
          console.log(`[ETF 구독] ${etf.productName} (${etf.productCode}) 구독 성공`);
        } else {
          console.warn(`[ETF 구독] ${etf.productName} (${etf.productCode}) 구독 실패`);
        }
      }
    }
  } catch (error) {
    console.error('[ETF 웹소켓] 구독 실패:', error);
  }
};

// 보유 내역 데이터 로드 (실제로는 API에서 가져와야 함)
const loadHoldingData = async () => {
  // 로딩 시작
  loadingStore.startLoading('보유 내역을 불러오는 중...');

  try {
    // 실제 API 호출 (토큰이 있는 경우)
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        // 실제 API 호출 시도
        const response = await fetch('http://localhost:8080/holdings/details', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const apiData = await response.json();
          holdingData.value = apiData;
          console.log('[API] 실제 보유 내역 데이터 로드 성공');
        } else {
          throw new Error(`API 응답 오류: ${response.status}`);
        }
      } catch (apiError) {
        console.warn('[API] 실제 API 호출 실패, Mock 데이터 사용:', apiError);
        loadMockData();
      }
    } else {
      console.log('[MOCK] 토큰 없음, Mock 데이터 사용');
      loadMockData();
    }
    
    // 웹소켓 연결 상태 확인
    console.log('[웹소켓] 연결 상태:', webSocketStore.isConnected);
    
    // ETF 웹소켓 구독 시작
    await startEtfWebSocketSubscriptions();
    
  } catch (error) {
    console.error('보유 내역 로드 실패, Mock 데이터 사용 :', error);
    loadMockData();
  } finally {
    loadingStore.stopLoading();
  }
};

// Mock 데이터 로드 함수
const loadMockData = () => {
  const mockData = {
    // "totalValuation": 100000.00,
    // "message": "핀사이트에 가입하고 난 후의 평가액입니다!",
    // "timeDeposit": 50000.00,
    // "domesticInvestment": 30000.00,
    // "foreignInvestment": 20000.00,
    // "fundHoldings": [
    //   {
    //     "productCode": "FUND001",
    //     "productName": "샘플 펀드",
    //     "productCompanyName": "샘플운용",
    //     "productCategory": null,
    //     "productCountry": "국내",
    //     "productType": "혼합형",
    //     "currentHoldings": 1,
    //     "currentValuation": 30000.00,
    //     "previousDayPrice": 30000.00,
    //     "priceChange": 100.00,
    //     "priceChangePercent": 0.33,
    //     "totalPriceChange": 100.00,
    //     "maturityDate": null,
    //     "isWatched": false
    //   }
    // ],
    // "etfHoldings": [
    //   {
    //     "productCode": "ETF001",
    //     "productName": "샘플 ETF",
    //     "productCompanyName": "샘플운용",
    //     "productCategory": null,
    //     "productCountry": "해외",
    //     "productType": "주식형",
    //     "currentHoldings": 1,
    //     "currentValuation": 20000.00,
    //     "previousDayPrice": 20000.00,
    //     "priceChange": 50.00,
    //     "priceChangePercent": 0.25,
    //     "totalPriceChange": 50.00,
    //     "maturityDate": null,
    //     "isWatched": false
    //   }
    // ],
    // "depositHoldings": [
    //   {
    //     "productCode": "DEP001",
    //     "productName": "샘플 예금",
    //     "productCompanyName": "샘플은행",
    //     "productCategory": null,
    //     "productCountry": "국내",
    //     "productType": "예금",
    //     "currentHoldings": 50000.00,
    //     "currentValuation": 50000.00,
    //     "previousDayPrice": null,
    //     "priceChange": null,
    //     "priceChangePercent": null,
    //     "totalPriceChange": null,
    //     "maturityDate": "2026-12-31",
    //     "isWatched": false
    //   }
    // ]
  };

  // 데이터 설정
  holdingData.value = mockData;
  console.log('[MOCK] Mock 데이터 로드 완료');
};

onMounted(async () => {
  // 로딩 상태 초기화
  loadingStore.resetLoading();
  
  // 보유 내역 데이터 로드
  await loadHoldingData();
});

onUnmounted(() => {
  // 컴포넌트 언마운트 상태로 설정
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
