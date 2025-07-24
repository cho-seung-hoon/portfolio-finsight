<template>
  <div class="subBox">
    <div class="subItem-title">
      <span class="keyword">트럼프</span>
      <span> 관련 투자 상품</span>
    </div>

    <div class="filter">
      <button
        :class="{ active: selectCategory  === '펀드' }"
        @click="selectFilter('펀드')"
      >
        펀드
      </button>
      <button
        :class="{ active: selectCategory === 'ETF' }"
        @click="selectFilter('ETF')"
      >
        ETF
      </button>
    </div>
    <div class="product-list">
      <NewsProductItem
        v-for="(product, index) in filterProduct"
        :key="index"
        :title="product.title"
        :date="product.date"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NewsProductItem from '@/components/home/NewsProductItem.vue';

const selectCategory = ref('펀드');

const productList = ref([
  { title: '펀드 시장 급락', summary: '...', date: '2025-07-22', category: '펀드' },
  { title: 'ETF 수익률 급등', summary: '...', date: '2025-07-21', category: 'ETF' },
  { title: '펀드 리밸런싱 전략', summary: '...', date: '2025-07-20', category: '펀드' },
  { title: 'ETF 분산 투자 가이드', summary: '...', date: '2025-07-19', category: 'ETF' },
]);

function selectFilter(category) {
  selectCategory.value = category;
};
const filterProduct = computed(() =>
  productList.value.filter(product => product.category === selectCategory.value)
);

</script>
<style scoped>
.subBox{
  background-color: var(--white);
  border-radius: 8px;
  border:1px solid var(--main04);
  padding:20px;
}
.subItem-title{
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
}

.keyword{
  color:var(--text-red);
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
  color:var(--main02);
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