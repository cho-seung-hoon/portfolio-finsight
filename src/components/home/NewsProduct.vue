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
        :class="{ active: selectCategory === 'fund' }"
        @click="selectFilter('fund')">
        펀드
      </button>
      <button
        :class="{ active: selectCategory === 'etf' }"
        @click="selectFilter('etf')">
        ETF
      </button>
    </div>
    <div
      v-if="filterProduct.length > 0"
      class="product-list">
      <div v-if="selectCategory === 'etf'">
        <TempEtfItem
          v-for="item in filterProduct"
          :key="item.product_code"
          :item="item" />
      </div>
      <div v-else>
        <TempFundItem
          v-for="fund in filterProduct"
          :key="fund.product_code"
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
import { ref, computed } from 'vue';
import TempEtfItem from '@/components/home/TempEtfItem.vue';
import TempFundItem from '@/components/home/TempFundItem.vue';

const props = defineProps({
  keyword: String,
  color: String,
  productList: Array // 투자 상품 데이터, 부모에서 전달
});

const selectCategory = ref('fund'); // 기본값

function selectFilter(category) {
  selectCategory.value = category;
}

const filterProduct = computed(() => {
  return props.productList.filter(product => product.productCategory === selectCategory.value);
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
