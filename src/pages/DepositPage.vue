<template>
  <div v-if="isLoading">로딩 중...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="productInfo">
    <DetailMainDeposit
      :bank="productInfo.bank"
      :title="productInfo.title"
      :max-rate="productInfo.maxRate"
      :max-rate-desc="productInfo.maxRateDesc"
      :base-rate="productInfo.baseRate" />

    <DetailTabs
      :tabs="tabs"
      :selected-tab="selectedTab"
      :indicator-position="indicatorPosition"
      @update:selected-tab="selectTab" />

    <DetailSection
      :tab-data="tabData"
      :selected-tab="selectedTab" />

    <DetailActionButton
      :id="route.params.id"
      :active="productInfo.isHolding"
      :category="'deposit'"
      @click="showModal = true" />
  </div>

  <button @click="showModal == true">버튼</button>
  <!-- 모달 컴포넌트 -->
  <AgreememtModal
    v-if="showModal"
    @close="showModal = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDepositStore } from '@/stores/deposit';
import { storeToRefs } from 'pinia';

import DetailMainDeposit from '@/components/detail/DetailMainDeposit.vue';
import DetailTabs from '@/components/detail/DetailTabs.vue';
import DetailSection from '@/components/detail/DetailSection.vue';
import DetailActionButton from '@/components/detail/DetailActionButton.vue';
import AgreememtModal from './buysell/AgreememtModal.vue';

const route = useRoute();
const depositStore = useDepositStore();
const { productInfo, tabData, isLoading, error } = storeToRefs(depositStore);

const showModal = ref(false);

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    depositStore.fetchProduct(productId);
  }
});

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
