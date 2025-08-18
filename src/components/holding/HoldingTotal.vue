<template>
  <div class="holding-total-box">
    <div class="total-title">투자 모아보기</div>

    <div class="total-info">
      <div class="total-info-icon deposit-icon" :style="{ borderColor: rankedColors.deposit }">
        <div class="iconIn" :style="{ color: rankedColors.deposit }">
          <IconMoney/>
        </div>
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

    <div class="total-info">
      <div class="total-info-icon domestic-icon" :style="{ borderColor: rankedColors.domestic }">
        <div class="iconIn" :style="{ color: rankedColors.domestic }">
          <IconWon/>
        </div>
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

    <div class="total-info">
      <div class="total-info-icon overseas-icon" :style="{ borderColor: rankedColors.foreign }">
        <div class="iconIn" :style="{ color: rankedColors.foreign }">
          <IconGlobe/>
        </div>
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
import { onMounted, computed, ref } from 'vue';
import { exchangeRate } from '@/api/exchangeRate';
import IconMoney from '@/components/icons/IconMoney.vue';
import IconWon from '@/components/icons/IconWon.vue';
import IconGlobe from '@/components/icons/IconGlobe.vue';

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

const usdExchangeRate = ref(0);

const calculatedDomesticInvestment = computed(() => {
  return props.domesticInvestment;
});

const calculatedForeignInvestment = computed(() => {
  return props.foreignInvestment;
});

const investmentRatios = computed(() => {
  const total = props.timeDeposit + props.domesticInvestment + props.foreignInvestment || 1;

  const depositRatio = (props.timeDeposit / total) * 100;
  const domesticRatio = (calculatedDomesticInvestment.value / total) * 100;
  const foreignRatio = (calculatedForeignInvestment.value / total) * 100;

  return {
    deposit: depositRatio.toFixed(1),
    domestic: domesticRatio.toFixed(1),
    foreign: foreignRatio.toFixed(1)
  };
});

// 비중에 따라 동적으로 색상을 할당하는 computed 속성
const rankedColors = computed(() => {
  // 1. 색상 정의 (진한색, 중간색, 연한색)
  const darkColor = '#fa8772';   // --sub01 원색
  const mediumColor = '#fca796'; // 중간 밝기
  const lightColor = '#fdc7bb';  // 가장 밝은 색

  // 2. 투자 항목과 비율을 배열로 만듭니다.
  const investments = [
    { name: 'deposit', ratio: parseFloat(investmentRatios.value.deposit) },
    { name: 'domestic', ratio: parseFloat(investmentRatios.value.domestic) },
    { name: 'foreign', ratio: parseFloat(investmentRatios.value.foreign) },
  ];

  // 3. 비율이 높은 순서대로 정렬합니다.
  investments.sort((a, b) => b.ratio - a.ratio);

  // 4. 순위에 따라 색상을 매핑하는 객체를 생성합니다.
  const colors = {};
  colors[investments[0].name] = darkColor;   // 1위: 진한색
  colors[investments[1].name] = mediumColor; // 2위: 중간색
  colors[investments[2].name] = lightColor;  // 3위: 연한색

  return colors;
});


const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

const formatDollarAmount = (wonAmount) => {
  if (!wonAmount) return '';

  const rate = usdExchangeRate.value || 1300;
  const dollarAmount = wonAmount / rate;

  console.log('달러 변환:', {
    wonAmount,
    exchangeRate: rate,
    dollarAmount: dollarAmount.toFixed(2)
  });

  return `$${dollarAmount.toFixed(2)}`;
};

const fetchExchangeRate = async () => {
  try {
    const exchangeData = await exchangeRate();
    if (exchangeData && exchangeData.length > 0) {
      const usdData = exchangeData.find(item => item.cur_unit === 'USD');
      if (usdData) {
        usdExchangeRate.value = parseFloat(usdData.deal_bas_r.replace(/,/g, ''));
      } else {
        console.log('USD 환율 데이터를 찾을 수 없음');
      }
    } else {
      console.log('환율 데이터가 비어있음');
    }
  } catch (error) {
    console.error('환율 데이터 가져오기 실패:', error);
  }
};

onMounted(async () => {
  await fetchExchangeRate();
});
</script>
<style scoped>
.holding-total-box {
  border-radius: 8px;
  background-color: var(--white);
  padding: 15px 20px;
  width: 100%;
  border: 1px solid var(--main04);
  box-sizing: border-box;
}

.total-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
  margin:5px 0;
}

.total-info {
  display: flex;
  width: 100%;
  margin-top: 5px;
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
  width: 45px;
  height: 45px;
  background-color: var(--main05);
  border-radius: 50px;
  flex-shrink: 0;
  border: 2px solid;
}

.iconIn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconIn svg{
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
  font-size: var(--font-size-sm);
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