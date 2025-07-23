<template>
  <ListTab />
  <section class="page-content">
    <div v-if="category === 'deposits'">
      <ListDepositsPage />
    </div>
    <div v-else-if="category === 'fund'">
      <ListFundPage />
    </div>
    <div v-else-if="category === 'etf'">
      <ListEtfPage />
    </div>
  </section>
  <div class="list-page-banner-wrapper">
    <div class="list-page-banner">
      <div class="list-page-banner-comment">
        <IconCheck width="20px" />
        <span>내 투자 성향에 맞춰보는 중!</span>
      </div>
      <button class="close-btn">해제</button>
    </div>
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
import IconCheck from '@/components/icons/IconCheck.vue';

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
  padding: 12px 0px;
}

.list-page-banner-wrapper {
  position: fixed;
  left: 50%;
  bottom: 60px;
  transform: translateX(-50%);
  width: 100vw;
  max-width: 440px;
  padding: 12px;
  z-index: 120;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .list-page-banner-wrapper {
    max-width: 100vw;
    padding-left: 12px;
    padding-right: 12px;
  }
}

.list-page-banner {
  width: 100%;
  background: #28ca6e;
  color: var(--white);
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: 12px;
}

.list-page-banner-comment {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: none;
  color: #fff;
  border: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  margin-left: 16px;
  cursor: pointer;
}
</style>
