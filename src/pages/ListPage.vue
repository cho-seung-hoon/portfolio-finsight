<template>
  <ListTab />
  <section class="page-content">
    <div v-if="category === 'deposit'">
      <ListDepositPage />
    </div>
    <div v-else-if="category === 'fund'">
      <ListFundPage />
    </div>
    <div v-else-if="category === 'etf'">
      <ListEtfPage />
    </div>
  </section>
  <div class="list-page-banner-wrapper">
    <div
      class="list-page-banner"
      :class="{ matched: isMatched }"
      @click="openModal"
      style="cursor: pointer">
      <div
        class="list-page-banner-comment"
        :class="isMatched ? 'matched' : 'default'">
        <IconCheck
          :width="20"
          :color="isMatched ? 'var(--white)' : 'var(--main03)'" />
        <span>
          {{ isMatched ? '내 투자 성향에 맞춰보는 중!' : '내 투자 성향에 맞춰보기' }}
        </span>
      </div>
      <button
        v-if="isMatched"
        class="close-btn"
        @click.stop="resetMatch">
        해제
      </button>
    </div>
  </div>

  <BottomModal
    v-if="showModal"
    @confirm="confirmMatch"
    @cancel="closeModal" />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import ListTab from '@/components/list/ListTab.vue';
import ListDepositPage from './list/ListDepositPage.vue';
import ListFundPage from './list/ListFundPage.vue';
import ListEtfPage from './list/ListEtfPage.vue';
import IconCheck from '@/components/icons/IconCheck.vue';
import BottomModal from './list/BottomModal.vue';

const headerStore = useHeaderStore();
const route = useRoute();
const router = useRouter();
const category = computed(() => route.params.category);
const isMatched = ref(false);
const showModal = ref(false);

onMounted(() => {
  headerStore.setHeader({
    titleParts: [{ text: '상품탐색', color: 'var(--main01)' }],
    showBackButton: false,
    actions: [
      { icon: 'search', handler: () => router.push('/list/search') },
      { icon: 'watch', handler: () => router.push('/list/watch') }
    ]
  });
});

function openModal() {
  if (!isMatched.value) {
    showModal.value = true;
  }
}

function closeModal() {
  showModal.value = false;
}

function confirmMatch() {
  isMatched.value = true;
  showModal.value = false;
}

function resetMatch() {
  isMatched.value = false;
}
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
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: 12px;
}

.list-page-banner {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: var(--main02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 50px 0 rgba(13, 17, 37, 0.05);
}

.list-page-banner.matched {
  background: rgba(40, 202, 110, 0.9);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: var(--white);
  border: 1px solid rgba(40, 202, 110, 0.5);
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
