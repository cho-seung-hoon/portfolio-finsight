<template>
  <div class="subBox">
    <div class="subItem-title">
      <span
        class="keyword"
        :style="{ color: props.color }"
        >{{ props.keyword }}</span
      >
      <span> 관련 투자 상품</span>
    </div>

    <div class="filter">
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
      class="product-list"
      v-if="filterProduct.length > 0">
      <div v-if="selectCategory === 'ETF'">
        <EtfItem
          v-for="item in filterProduct"
          :key="item.product_code"
          :item="item" />
      </div>
      <div v-else>
        <FundItem
          v-for="fund in filterProduct"
          :key="fund.fund_code"
          :item="fund" />
      </div>
    </div>
    <div
      v-else
      class="no-products">
      관련된 상품이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import EtfItem from '../list/EtfItem.vue';
import FundItem from '../list/FundItem.vue';
const props = defineProps({
  keyword: String,
  color: String,
  productList: Array // 투자 상품 데이터, 부모에서 전달
});

const selectCategory = ref('펀드'); // 기본값

function selectFilter(category) {
  selectCategory.value = category;
}

const filterProduct = computed(() => {
  return props.productList.filter(product => product.category === selectCategory.value);
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
