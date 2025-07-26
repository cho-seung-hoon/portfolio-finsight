<template>
  <div class="product-item" @click="handleClick">
    <div class="product-icon">
      <img src="@/assets/logo.svg" alt="임시이미지">
    </div>
    <div class="product-info">
      <div class="product-bank">{{ product.bankName }}</div>
      <div class="product-name">{{ product.productName }}</div>
      <div class="product-in">
        <div class="product-title">체결 금액</div>
        <div class="product-value">{{ product.value}} 원</div>
      </div>
      <div class="product-in">
        <div class="product-title">만료 날짜</div>
        <div class="product-value">{{ product.date }}</div>
      </div>
      <div class="product-tags">
        <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  // title 대신 product 객체를 받도록 수정
  product: {
    type: Object,
    required: true,
  }
});

const handleClick = () => {
  // 클릭 시 product 객체 전체에 접근 가능
  console.log('상품 클릭:', props.product);
};
</script>

<style scoped>
img{
  width: 30px;
  height: 30px;
}
.product-item {
  display: flex;
  padding:12px 0;
  background-color: var(--white);
  border-bottom: 1px solid var(--main04);
  cursor: pointer;
}
.product-title {
  font-size:var(--font-size-ms);
  font-weight: var(--font-weight-light);
  color:var(--main02);

}

.product-in{
  display: flex;
  justify-content: space-between;
  margin-top:5px;
}

.product-info {
  flex-grow: 1;
  margin: 0 20px;
}

.product-bank{
  font-size:var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color:var(--main02);
}

.product-name{
  font-size:var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  margin: 5px 0;
}

</style>