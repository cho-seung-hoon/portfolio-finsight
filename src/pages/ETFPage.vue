<template>
  <div v-if="isLoading">로딩 중...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="productInfo">
    <DetailMainEtf
      :bank="productInfo.bank"
      :title="productInfo.title"
      :net_assets="productInfo.net_assets"
      :risk="productInfo.risk" />

    <DetailTabs
      :tabs="tabs"
      :selectedTab="selectedTab"
      @update:selectedTab="selectTab" />

    <DetailSection
      :tabData="tabData"
      :selectedTab="selectedTab" />

    <DetailActionButton
      :active="productInfo.isHolding"
      :category="'etf'"
      :id="route.params.id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEtfStore } from '@/stores/etf';
import { storeToRefs } from 'pinia';

// DetailMainSection: ETF/Fund 등 상품의 주요 정보를 보여주는 상단 섹션 컴포넌트
// DetailTabs: 상품 상세 정보의 탭 네비게이션 컴포넌트
// DetailSection: 선택된 탭에 따라 상세 내용을 보여주는 컴포넌트
// DetailActionButton: 상품 가입/신청 등 주요 액션 버튼 컴포넌트
import DetailMainEtf from '@/components/detail/DetailMainEtf.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';

const route = useRoute();

const etfStore = useEtfStore();
const { productInfo, tabData, isLoading, error } = storeToRefs(etfStore);

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    etfStore.fetchProduct(productId);
  } else {
    console.warn('ETFPage: 상품 ID가 URL에 없습니다.');
  }
});

const tabs = [
  { key: 'info', label: '상품안내' },
  { key: 'yield', label: '수익률' },
  { key: 'composition', label: '구성종목' },
  { key: 'news', label: '뉴스' }
];
const selectedTab = ref('info');
const selectTab = tab => {
  selectedTab.value = tab;
};
</script>
