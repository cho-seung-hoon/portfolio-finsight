<template>
  <div v-if="isLoading">로딩 중...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="productInfo">
    <DetailMainFund
      :bank="productInfo.bank"
      :title="productInfo.title"
      :yield="productInfo.yield"
      :price-arr="productInfo.priceArr" />

    <DetailTabs
      :tabs="tabs"
      :selected-tab="selectedTab"
      @update:selected-tab="selectTab" />

    <DetailSection
      :tab-data="tabData"
      :selected-tab="selectedTab" />

    <DetailActionButton
      :id="route.params.id"
      :active="productInfo.isHolding"
      :category="'fund'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFundStore } from '@/stores/fund';
import { storeToRefs } from 'pinia';

import DetailMainFund from '@/components/detail/DetailMainFund.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';

const route = useRoute();

const fundStore = useFundStore();
const { productInfo, tabData, isLoading, error } = storeToRefs(fundStore);

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    fundStore.fetchProduct(productId);
  } else {
    console.warn('FundPage: 상품 ID가 URL에 없습니다.');
  }
});

const tabs = [
  { key: 'info', label: '상품안내' },
  { key: 'price', label: '기준가' },
  { key: 'composition', label: '구성종목' },
  { key: 'news', label: '뉴스' }
];
const selectedTab = ref('info');
const selectTab = tab => {
  selectedTab.value = tab;
};
</script>
