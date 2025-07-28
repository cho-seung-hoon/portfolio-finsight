<template>
  <div
    class="product-item"
    @click="handleClick">
    <div class="product-tags">
      <span
        v-for="tag in product.tags"
        :key="tag"
        class="tag"
        >{{ tag }}</span
      >
    </div>
    <div class="product-name">{{ product.productName }}</div>
    <div class="product-in">
      <div class="product-title">현재 보유량</div>
      <div class="product-value">{{ product.quantity }} 좌</div>
    </div>
    <div class="product-in">
      <div class="product-title">현재 평가액</div>
      <div class="product-value">{{ product.valuation }} 원</div>
    </div>
    <<<<<<< HEAD =======
    <div class="product-in return-info">
      <div class="product-title">전일 대비</div>
      <div
        class="return-amount"
        :class="getReturnRateClass(product.returnRate)">
        <span class="return-amount-icon">{{ getReturnRateIcon(product.returnRate) }}</span>
        <span>{{ formatReturnAmount(product.returnAmount) }}원</span>
      </div>
    </div>
    >>>>>>> fix/#40-holdings
  </div>
</template>
<script setup>
const props = defineProps({
  // title 대신 product 객체를 받도록 수정
  product: {
    type: Object,
    required: true
  }
});
const formatReturnAmount = amount => {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${new Intl.NumberFormat('ko-KR').format(amount)}`;
};
const getReturnRateIcon = rate => {
  if (rate > 0) return '▲';
  if (rate < 0) return '▼';
  return '─';
};
const getReturnRateClass = rate => {
  if (rate > 0) return 'positive';
  if (rate < 0) return 'negative';
  return 'neutral';
};

const handleClick = () => {
  // 클릭 시 product 객체 전체에 접근 가능
  console.log('상품 클릭:', props.product);
};
</script>

<style scoped>
.product-item {
  padding: 12px 0;
  background-color: var(--white);
  border-bottom: 1px solid var(--main04);
  cursor: pointer;
}

.tag {
  margin-right: 5px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-light);
}
.product-title {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-light);
  color: var(--main02);
}

.product-in {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.product-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  margin: 5px 0;
}

.return-amount.positive {
  color: #dc2626;
}

.return-amount.negative {
  color: #2563eb;
}

.return-amount.neutral {
  color: var(--main02);
}

.return-amount-icon {
  font-size: 10px;
}
</style>
