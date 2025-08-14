<template>
  <div class="holding-total-box">
    <div class="total-title">투자 모아보기</div>
    
    <!-- 차트 바 -->
    <div class="total-calc">
      <span class="total-deposit"></span>
      <span class="total-domestic"></span>
      <span class="total-overseas"></span>
    </div>

    <!-- 정기예금 정보 -->
    <div class="total-info">
      <div class="total-info-icon deposit-icon">
        <img
          src="@/assets/logo.svg"
          alt="로고" />
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">정기예금</div>
          <div class="total-info-detail-item-1">{{ formatCurrency(timeDeposit) }}원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">{{ investmentRatios.deposit }} %</div>
        </div>
      </div>
    </div>

    <!-- 국내 투자 정보 -->
    <div class="total-info">
      <div class="total-info-icon domestic-icon">
        <img
          src="@/assets/logo.svg"
          alt="로고" />
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">국내 투자</div>
          <div class="total-info-detail-item-1">{{ formatCurrency(calculatedDomesticInvestment) }}원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">{{ investmentRatios.domestic }} %</div>
        </div>
      </div>
    </div>

    <!-- 해외 투자 정보 -->
    <div class="total-info">
      <div class="total-info-icon overseas-icon">
        <img
          src="@/assets/logo.svg"
          alt="로고" />
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">해외 투자</div>
          <div class="total-info-detail-item-1">{{ formatCurrency(calculatedForeignInvestment) }}원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">{{ investmentRatios.foreign }} %</div>
          <div class="total-info-detail-item-3">{{ formatDollarAmount(calculatedForeignInvestment) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, computed, ref } from 'vue';
import { exchangeRate } from '@/api/exchangeRate';

// Props 정의
const props = defineProps({
  totalValuation: {
    type: Number,
    default: 0
  },
  timeDeposit: {
    type: Number,
    default: 0
  },
  domesticInvestment: {
    type: Number,
    default: 0
  },
  foreignInvestment: {
    type: Number,
    default: 0
  },
  message: {
    type: String,
    default: ''
  }
});

// 환율 데이터
const usdExchangeRate = ref(0);

// 실제 국내 투자 평가액 계산 (국내 펀드 + 국내 ETF)
const calculatedDomesticInvestment = computed(() => {
  return props.domesticInvestment;
});

// 실제 해외 투자 평가액 계산 (해외 펀드 + 해외 ETF)
const calculatedForeignInvestment = computed(() => {
  return props.foreignInvestment;
});

// 투자 비율 계산 (예금 + 국내 + 해외)
const investmentRatios = computed(() => {
  const total = props.timeDeposit + props.domesticInvestment + props.foreignInvestment || 1; // 실제 총합
  
  // 예금 비율
  const depositRatio = (props.timeDeposit / total) * 100;
  
  // 국내 투자 비율
  const domesticRatio = (calculatedDomesticInvestment.value / total) * 100;
  
  // 해외 투자 비율
  const foreignRatio = (calculatedForeignInvestment.value / total) * 100;
  
  return {
    deposit: depositRatio.toFixed(1),
    domestic: domesticRatio.toFixed(1),
    foreign: foreignRatio.toFixed(1)
  };
});

// 통화 포맷팅 함수
const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

// 달러 포맷팅 함수
const formatDollarAmount = (wonAmount) => {
  if (!wonAmount) return '';
  
  // 환율이 없을 경우 기본값 사용 (1달러 = 1300원)
  const rate = usdExchangeRate.value || 1300;
  const dollarAmount = wonAmount / rate;
  
  console.log('달러 변환:', {
    wonAmount,
    exchangeRate: rate,
    dollarAmount: dollarAmount.toFixed(2)
  });
  
  return `$${dollarAmount.toFixed(2)}`;
};

// 차트 업데이트 함수
const updateChart = () => {
  const total = props.timeDeposit + props.domesticInvestment + props.foreignInvestment || 1; // 총합
  
  const depositEl = document.querySelector('.total-deposit');
  const domesticEl = document.querySelector('.total-domestic');
  const overseasEl = document.querySelector('.total-overseas');

  if (depositEl && domesticEl && overseasEl) {
    // 실제 총합 대비 비율 계산
    const depositPercent = (props.timeDeposit / total) * 100;
    const domesticPercent = (calculatedDomesticInvestment.value / total) * 100;
    const overseasPercent = (calculatedForeignInvestment.value / total) * 100;



    depositEl.style.width = `${depositPercent}%`;
    domesticEl.style.width = `${domesticPercent}%`;
    overseasEl.style.width = `${overseasPercent}%`;
  }
};

// 환율 데이터 가져오기
const fetchExchangeRate = async () => {
  try {
    const exchangeData = await exchangeRate();
    
    if (exchangeData && exchangeData.length > 0) {
      const usdData = exchangeData.find(item => item.cur_unit === 'USD');
      if (usdData) {
        usdExchangeRate.value = parseFloat(usdData.deal_bas_r.replace(/,/g, ''));
      } else {
        console.log('USD 환율 데이터를 찾을 수 없음');
        // 기본값 1300
        usdExchangeRate.value = 1300;
      }
    } else {
      console.log('환율 데이터가 비어있음');
      // 기본값 1300
      usdExchangeRate.value = 1300;
    }
  } catch (error) {
    console.error('환율 데이터 가져오기 실패:', error);
    // 기본값 1300
    usdExchangeRate.value = 1300;
  }
};

// props 변경 감지하여 차트 업데이트
watch(() => [props.totalValuation, props.timeDeposit, props.domesticInvestment, props.foreignInvestment], () => {
  updateChart();
}, { immediate: true });

onMounted(async () => {
  updateChart();
  await fetchExchangeRate();
});
</script>

<style scoped>
.holding-total-box {
  border-radius: 12px;
  background-color: var(--white);
  padding: var(--font-size-lg) 28px;
  width: 100%;
  border: 1px solid var(--main04);
  box-sizing: border-box;
}

.total-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
  margin-bottom: var(--font-size-lg);
}

.total-calc {
  display: flex;
  height: 30px;
  background-color: var(--main03);
  margin: var(--font-size-lg) 10px;
  border-radius: 12px;
  overflow: hidden;
}

.total-deposit {
  background-color: var(--orange01);
  display: block;
  height: 100%;
}

.total-domestic {
  background-color: var(--mint01);
  display: block;
  height: 100%;
}

.total-overseas {
  background-color: var(--yellow01);
  display: block;
  height: 100%;
}

.total-info {
  display: flex;
  width: 100%;
  margin-top: var(--font-size-lg);
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--main04);
}

.total-info:last-of-type {
  border-bottom: none;
}

.total-info-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: var(--main04);
  border-radius: 50px;
  flex-shrink: 0;
}

.deposit-icon {
  border: 2px solid var(--orange01);
}

.domestic-icon {
  border: 2px solid var(--mint01);
}

.overseas-icon {
  border: 2px solid var(--yellow01);
}

.total-info-icon img {
  width: 30px;
  height: 30px;
}

.total-info-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 30px;
}

.total-info-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
}

.total-info-detail-item-1 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.total-info-detail-item-2 {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-light);
  color: var(--main02);
}

.total-info-detail-item-3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--main02);
  text-align: right;
  margin-left: auto;
}
</style>
