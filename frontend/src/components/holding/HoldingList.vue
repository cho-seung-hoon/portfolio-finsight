<template>
  <div class="subBox">
    <div class="subItem-title">
      <span
        class="keyword"
        style="color: var(--main01)"
        >보유 내역</span
      >
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
    <div
      v-if="filteredProducts.length > 0"
      class="product-list">
      <template v-if="selectCategory === '예금'">
        <HoldingListDeposit
          class="productItem"
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product" />
      </template>

      <template v-else>
        <HoldingListFundNEtf
          class="productItem"
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product" />
      </template>
    </div>
    <div
      v-else
      class="no-products">
      관련된 상품이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HoldingListDeposit from '@/components/holding/HoldingListDeposit.vue';
import HoldingListFundNEtf from '@/components/holding/HoldingListFund_N_ETF.vue';

const props = defineProps({
  products: Array
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
  padding: var(--font-size-lg);
}

.subItem-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
}

.product-list {
  margin-top: 10px;
}

.filter {
  margin: var(--font-size-ms) 0;
  display: flex;
  gap: 8px;
}

.filter button {
  all: unset;
  padding: 6px var(--font-size-ms);
  border: 1px solid var(--main03);
  background-color: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: 6px;
}

.filter button.active {
  background-color: var(--main01);
  color: var(--white);
  border-color: var(--main01);
}

.productItem{
  margin:10px 0;
}
</style>
