<template>
  <div v-if="isLoading">로딩 중...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="productInfo">
    <DetailMainSection
      :bank="productInfo.bank"
      :title="productInfo.title"
      :maxRate="productInfo.maxRate"
      :maxRateDesc="productInfo.maxRateDesc"
      :baseRate="productInfo.baseRate"
    />

    <DetailTabs
      :tabs="tabs"
      :selectedTab="selectedTab"
      :indicatorPosition="indicatorPosition"
      @update:selectedTab="selectTab"
    />

    <DetailSection
      :tabData="tabData"
      :selectedTab="selectedTab"
    />

    <DetailActionButton
      :active="isActive"
      @click="onClick"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDepositStore } from '@/stores/deposit';
import { storeToRefs } from 'pinia';

// DetailMainSection: 예금/ETF 등 상품의 주요 정보를 보여주는 상단 섹션 컴포넌트
// DetailTabs: 상품 상세 정보의 탭 네비게이션 컴포넌트
// DetailSection: 선택된 탭에 따라 상세 내용을 보여주는 컴포넌트
// DetailActionButton: 상품 가입/신청 등 주요 액션 버튼 컴포넌트
import DetailMainSection from '@/components/detail/DetailMainSection.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';

const depositStore = useDepositStore();
const { productInfo, tabData, isLoading, error } = storeToRefs(depositStore);

onMounted(() => {
  // 라우트 파라미터 등에서 productId를 가져와야 합니다.
  // 예: const productId = route.params.id;
  depositStore.fetchProduct('some-product-id'); 
});

// 탭 관련 데이터
const tabs = [
  { key: 'info', label: '상품안내' },
  { key: 'rate', label: '금리안내' },
  { key: 'notice', label: '유의사항' }
];
const selectedTab = ref('info');
const selectTab = (tab) => {
  selectedTab.value = tab;
};
const indicatorPosition = {
  info: '0px',
  rate: '147px',
  notice: '294px',
};

// 버튼 상태
const isActive = ref(false);
const onClick = () => {
  isActive.value = true;
};
</script> 