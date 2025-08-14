<template>
  <div
    class="product-item"
    @click="handleClick">
    <div class="product-header">
      <div class="product-sub-title">
        {{ product.tags[0] }} · {{ product.tags[1] }}
      </div>
      <div class="product-company">{{ product.productCompanyName || '운용사 정보 없음' }}</div>
    </div>
    
    <div class="product-name">{{ product.productName }}</div>
    
    <div class="product-details">
      <div class="product-in">
        <div class="product-title">현재 보유량</div>
        <div class="product-value">{{ formatQuantity(product.quantity) }}</div>
      </div>
      <div class="product-in">
        <div class="product-title">최근 평가액</div>
        <div class="product-value">{{ formatCurrency(product.valuation) }}원</div>
      </div>
      <div class="product-in return-info">
        <div class="product-title">전일 대비</div>
        <div
          class="return-amount"
          :class="getReturnRateClass(product.returnRate)">
          <span class="return-amount-icon">{{ getReturnRateIcon(product.returnRate) }}</span>
          <span>{{ formatReturnAmount(product.returnAmount) }}원</span>
          <span class="return-rate">({{ formatReturnRate(product.returnRate) }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// 수량 포맷팅
const formatQuantity = (quantity) => {
  if (!quantity) return '0주';
  return `${quantity}주`;
};

// 통화 포맷팅
const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('ko-KR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  }).format(value);
};

// 수익률 포맷팅
const formatReturnRate = (rate) => {
  if (rate === null || rate === undefined) return '0.00';
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(2)}`;
};

// 수익 금액 포맷팅
const formatReturnAmount = amount => {
  if (amount === null || amount === undefined) return '0';
  const sign = amount > 0 ? '+' : '';
  return `${sign}${new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)}`;
};

// 수익률 아이콘 (화살표)
const getReturnRateIcon = rate => {
  if (rate === null || rate === undefined) return '─';
  if (rate > 0) return '▲';
  if (rate < 0) return '▼';
  return '─';
};

// 수익률 클래스
const getReturnRateClass = rate => {
  if (rate === null || rate === undefined) return 'neutral';
  if (rate > 0) return 'positive';
  if (rate < 0) return 'negative';
  return 'neutral';
};

const handleClick = () => {
  console.log('상품 클릭:', props.product);
  
  // 상품 타입에 따라 다른 경로로 이동
  if (props.product.productType === 'ETF') {
    router.push(`/etf/${props.product.productCode}`);
  } else if (props.product.productType === '펀드') {
    router.push(`/fund/${props.product.productCode}`);
  }
};
</script>

<style scoped>
.product-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
  padding: 8px;
  background-color: var(--white);
  border-bottom: 1px solid var(--main04);
  cursor: pointer;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.product-sub-title {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.product-company {
  font-size: var(--font-size-ms);
  color: var(--main02);
  font-weight: var(--font-weight-regular);
}

.product-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  margin: 0 0 var(--font-size-md) 0;
  line-height: 1.4;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-in {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-title {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-light);
  color: var(--main02);
}

.product-value {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.return-info {
  margin-top: 4px;
  padding-top: var(--font-size-md);
  border-top: 1px solid var(--main04);
}

.return-amount {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: var(--font-weight-semi-bold);
}

.return-amount.positive,
.return-amount.positive .return-amount-icon,
.return-amount.positive span {
  color: var(--text-red) !important;
}

.return-amount.negative,
.return-amount.negative .return-amount-icon,
.return-amount.negative span {
  color: var(--text-blue) !important;
}

.return-amount.neutral,
.return-amount.neutral .return-amount-icon,
.return-amount.neutral span {
  color: var(--main02) !important;
}

.return-amount-icon {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  margin-right: 2px;
}

.return-rate {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-light);
}
</style>
