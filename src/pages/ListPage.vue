<template>
  <ListTab />
  <div class="page-content">
    <div v-if="category === 'deposits'">
      <ListDepositsPage />
    </div>
    <div v-else-if="category === 'fund'">
      <ListFundPage />
    </div>
    <div v-else-if="category === 'etf'">
      <ListEtfPage />
    </div>
    <div v-else>존재하지 않는 카테고리입니다.</div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import ListTab from '@/components/list/ListTab.vue';
import ListDepositsPage from './list/ListDepositsPage.vue';
import ListFundPage from './list/ListFundPage.vue';
import ListEtfPage from './list/ListEtfPage.vue';

const headerStore = useHeaderStore();
const route = useRoute();
const router = useRouter();
const category = computed(() => route.params.category);

onMounted(() => {
  headerStore.setHeader({
    titleParts: [{ text: '상품탐색', color: 'var(--main01)' }],
    showBackButton: false,
    actions: [
      { icon: 'search', handler: () => router.push('/list/search') },
      { icon: 'watch', handler: () => router.push('/list/like') }
    ]
  });
});
</script>

<style scoped>
.page-content {
  width: 100%;
  height: 2000px;
  padding: 12px 0px;
}
</style>
