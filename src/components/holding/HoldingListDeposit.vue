<template>
  <div
    class="product-item"
    @click="handleClick">
    <div class="product-info">
      <div class="product-header">
        <div class="product-bank">{{ product.bankName }}</div>
      </div>
      <div class="product-name">{{ product.productName }}</div>
      <div class="product-details">
        <div class="product-in">
          <div class="product-title">체결 금액</div>
          <div class="product-value">{{ formatCurrency(product.value) }}원</div>
        </div>
        <div class="product-in">
          <div class="product-title">만기 날짜</div>
          <div class="product-value">{{ product.date }}</div>
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

// 통화 포맷팅
const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};



const handleClick = () => {
  console.log('상품 클릭:', props.product);
  
  // 예금 상품 상세 페이지로 이동
  router.push(`/deposit/${props.product.productCode}`);
};
</script>

<style scoped>
.product-item {
  display: flex;
  padding: var(--font-size-md) 0;
  background-color: var(--white);
  border-bottom: 1px solid var(--main04);
  cursor: pointer;
}

.product-info {
  flex-grow: 1;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.product-bank {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.product-name {
  font-size: var(--font-size-lg);
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
</style>
