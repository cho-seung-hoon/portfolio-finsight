<template>
  <div v-if="isLoading">로딩 중...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="productInfo">
    <DetailMainDeposit
      :bank="productInfo.bank"
      :title="productInfo.title"
      :maxRate="productInfo.maxRate"
      :maxRateDesc="productInfo.maxRateDesc"
      :baseRate="productInfo.baseRate" />

    <DetailTabs
      :tabs="tabs"
      :selectedTab="selectedTab"
      :indicatorPosition="indicatorPosition"
      @update:selectedTab="selectTab" />

    <DetailSection
      :tabData="tabData"
      :selectedTab="selectedTab" />

    <DetailActionButton
      :active="productInfo.isHolding"
      :category="'deposit'"
      :id="route.params.id" />

      
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDepositStore } from '@/stores/deposit';
import { storeToRefs } from 'pinia';

// DetailMainSection: 예금/ETF 등 상품의 주요 정보를 보여주는 상단 섹션 컴포넌트
// DetailTabs: 상품 상세 정보의 탭 네비게이션 컴포넌트
// DetailSection: 선택된 탭에 따라 상세 내용을 보여주는 컴포넌트
// DetailActionButton: 상품 가입/신청 등 주요 액션 버튼 컴포넌트
import DetailMainDeposit from '@/components/detail/DetailMainDeposit.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';

const route = useRoute();

const depositStore = useDepositStore();
const { productInfo, tabData, isLoading, error } = storeToRefs(depositStore);

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    depositStore.fetchProduct(productId);
  } else {
    console.warn('DepositPage: 상품 ID가 URL에 없습니다.');
  }
});

// 탭 관련 데이터
const tabs = [
  { key: 'info', label: '상품안내' },
  { key: 'rate', label: '금리안내' },
  { key: 'notice', label: '유의사항' }
];
const selectedTab = ref('info');
const selectTab = tab => {
  selectedTab.value = tab;
};
const indicatorPosition = {
  info: '0px',
  rate: '147px',
  notice: '294px'
};
</script>
