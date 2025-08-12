<template>
  <div id="app-container">
    <component :is="layoutComponent" />

    <!-- 전용 세션 만료 모달 -->
    <SessionExpireModal
      :visible="sessionStore.isExpireModalVisible"
      :remainingTime="sessionStore.remainingTime"
      @extend="sessionStore.extendSession"
      @logout="sessionStore.logout"
      @close="sessionStore.isExpireModalVisible = false" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './components/layouts/DefaultLayout.vue';
import EmptyLayout from './components/layouts/EmptyLayout.vue';
import HeaderLayout from './components/layouts/HeaderLayout.vue';
import { useSessionStore } from '@/stores/session';
import SessionExpireModal from '@/components/common/SessionExpireModal.vue';

const layouts = {
  DefaultLayout,
  EmptyLayout,
  HeaderLayout
};

const route = useRoute();

const layoutComponent = computed(() => layouts[route.meta.layout || 'DefaultLayout']);

const sessionStore = useSessionStore();

onMounted(() => {
  if (localStorage.getItem('accessToken')) sessionStore.startCountdown();
});

onUnmounted(() => sessionStore.stopCountdown());
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background-color: var(--main04);
}

#app-container {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  #app-container {
    width: 440px;
    height: 100vh;
    margin: 0 auto; /* 수평 가운데 정렬 */
    box-shadow: 0 5px 15px var(--main03);
  }
}
</style>
