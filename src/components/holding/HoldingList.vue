<template>
  <div class="subBox">
    <div class="subItem-title">
      <span class="keyword" :style="{ color: props.color }">{{ props.keyword }}</span>
      <span>보유 상품 목록</span>
    </div>

    <div class="filter">
      <button
        :class="{ active: selectCategory === '예금' }"
        @click="selectFilter('예금')">
        예금
      </button>
      <button
        :class="{ active: selectCategory === '펀드' }"
        @click="selectFilter('펀드')">
        펀드
      </button>
      <button
        :class="{ active: selectCategory === 'ETF' }"
        @click="selectFilter('ETF')">
        ETF
      </button>
    </div>
    <div class="product-list" v-if="filteredProducts.length > 0">
      <template v-if="selectCategory === '예금'">
        <HoldingListDeposit
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </template>

      <template v-else>
        <HoldingListFundNEtf
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </template>
    </div>
    <div v-else class="no-products">
      관련된 상품이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import HoldingListDeposit from '@/components/holding/HoldingListDeposit.vue';
import HoldingListFundNEtf from '@/components/holding/HoldingListFund_N_ETF.vue';

const props = defineProps({
  keyword: String,
  color: String,
  products: Array  // productList -> products 로 변경
});

const selectCategory = ref('예금');

function selectFilter(category) {
  selectCategory.value = category;
}


const filteredProducts = computed(() => {
  return props.products.filter(product => product.productType === selectCategory.value);
});
</script>

<style scoped>
.subBox {
  background-color: var(--white);
  border-radius: 8px;
  border: 1px solid var(--main04);
  padding: 20px;
}
.subItem-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
}

.keyword {
  text-decoration: underline;
}

.product-list {
  margin-top: 10px;
}

.filter {
  margin: 12px 0;
  display: flex;
  gap: 8px;
}

.filter button {
  all: unset;
  padding: 6px 10px;
  border: 1px solid #ccc;
  background-color: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.filter button.active {
  background-color: var(--main01);
  color: var(--white);
  border-color: var(--main01);
}
</style>