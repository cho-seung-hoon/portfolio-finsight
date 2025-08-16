<template>
  <div id="app-container">
    <component
      :is="layoutComponent"
      :key="$route.fullPath" />

    <!-- 전용 세션 만료 모달 -->
    <SessionExpireModal
      :key="sessionStore.modalMode"
      :visible="sessionStore.isExpireModalVisible"
      :remainingTime="sessionStore.remainingTime"
      :mode="sessionStore.modalMode"
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
import { getMyInfoApi } from '@/api/user'; // user API 임포트
const layouts = {
  DefaultLayout,
  EmptyLayout,
  HeaderLayout
};

const route = useRoute();

const layoutComponent = computed(() => layouts[route.meta.layout || 'DefaultLayout']);

const sessionStore = useSessionStore();

onMounted(async () => {
  // ✅ Pinia 스토어를 상태의 기준으로 삼습니다.
  if (sessionStore.isAuthenticated) {
    // 1. 토큰이 있으면 타이머를 시작합니다.
    sessionStore.startCountdown();

    // 2. 만약 사용자 정보가 없다면, API를 호출하여 다시 채워줍니다.
    if (!sessionStore.user) {
      try {
        const userInfoResponse = await getMyInfoApi();
        const userData = userInfoResponse.data;
        sessionStore.$patch({
          user: userData
        });
      } catch (error) {
        console.error('사용자 정보 자동 갱신 실패:', error);
        // 정보를 가져오다 실패하면, 유효하지 않은 토큰일 수 있으므로 로그아웃 처리
        sessionStore.logout();
      }
    }
  }
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
