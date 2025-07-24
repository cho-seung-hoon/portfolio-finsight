<template>
  <div v-if="isLoading">로딩 중...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="productInfo">
    <DetailMainSection3
      :bank="productInfo.bank"
      :title="productInfo.title"
      :yield="productInfo.yield"
      :priceArr="productInfo.priceArr" />

    <DetailTabs
      :tabs="tabs"
      :selectedTab="selectedTab"
      @update:selectedTab="selectTab" />

    <DetailSection
      :tabData="tabData"
      :selectedTab="selectedTab" />

    <DetailActionButton
      :active="isActive"
      @click="onClick" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFundStore } from '@/stores/fund';
import { storeToRefs } from 'pinia';

import DetailMainSection3 from '@/components/detail/DetailMainSection3.vue';
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

const isActive = ref(false);
const onClick = () => {
  isActive.value = true;
};
</script>
