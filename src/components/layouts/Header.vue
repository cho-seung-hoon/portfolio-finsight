<template>
  <div
    class="container"
    :class="{ 'no-border': !showBorder }"
    :style="{ backgroundColor: bColor }">
    <button
      v-if="showBackButton"
      class="backButton"
      :class="{ 'light-mode': isLightMode }"
      @click="backHandler">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.5 9L13.5 18L22.5 27"
          stroke="currentColor"
          style="stroke-width: 2"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>

    <div class="title">
      <span
        v-for="(part, index) in titleParts"
        :key="index"
        :style="{ color: part.color }">
        {{ part.text }}
      </span>
    </div>

    <div class="actions">
      <div v-if="actions.length > 0">
        <router-link
          v-for="action in actions"
          :key="action.icon"
          class="action-button"
          :to="action.to">
          <component :is="iconComponents[action.icon]" />
        </router-link>
      </div>

      <div class="actions_fix">
        <div class="time" :class="{ 'light-mode': isLightMode }">
          {{ remainingTime }}
        </div>
        <button
          @click="handleExtendSession"
          class="generate-token"
          :class="{ 'light-mode': isLightMode }">
          시간연장
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useHeaderStore } from '@/stores/header';
import { useRouter } from 'vue-router';
import IconSearch from '@/components/icons/IconSearch.vue';
import axios from 'axios';
import { decodingJWT } from '@/utils/jwtUtil.js';

const router = useRouter();

const remainingTime = ref('00:00');
const emit = defineEmits(['open-time-modal']);

const props = defineProps(['onExpire']);

function updateRemainingTime() {
  const token = localStorage.getItem('accessToken');
  const timeObj = decodingJWT(token);

  if (timeObj === null) {
    remainingTime.value = '정보 없음';
  } else if (timeObj === '만료됨') {
    remainingTime.value = '만료됨';

    localStorage.removeItem('accessToken');
    router.push('/start');
  } else {
    /*const totalSeconds = timeObj.minutes * 60 + timeObj.seconds;*/ // ✅ 토큰 만료 5분전 팝업 기능

    // 분, 초를 2자리 문자열로 포맷팅
    const m = String(timeObj.minutes).padStart(2, '0');
    const s = String(timeObj.seconds).padStart(2, '0');
    remainingTime.value = `${m}:${s}`;

    // ✅ 토큰 만료 5분전 팝업 기능
    // if (totalSeconds <= 3480 && !hasShownExpireWarning.value) {
    //   emit('open-time-modal'); // 부모에게 이벤트 전달
    //   hasShownExpireWarning.value = true;
    // }
  }
}
let intervalId = null;

onMounted(() => {
  updateRemainingTime();
  intervalId = setInterval(updateRemainingTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const headerStore = useHeaderStore();
const { titleParts, showBackButton, actions, showBorder, bColor, backHandler } =
  storeToRefs(headerStore);

// ✨ [수정] 페이지가 라이트 모드인지 여부를 명확하게 계산
const isLightMode = computed(() => bColor.value === 'var(--white)');

const iconComponents = {
  search: IconSearch,
};

async function handleExtendSession() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('로그인 연장을 위한 액세스 토큰이 없습니다.');
    return;
  }
  try {

    const response = await axios.post(
      'http://localhost:8080/users/token',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const newAccessToken = response.data;

    localStorage.setItem('accessToken', newAccessToken);
    console.log('로그인 연장 성공:', response.data.success);
  } catch (error) {
    console.error('로그인 연장 실패:', error);
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: var(--main05);
  border-bottom: 1px solid var(--main03);
  padding: 0 16px;
}
.container.no-border { border-bottom: none; }

/* --- 기본 스타일 (다크 모드일 때) --- */
.backButton {
  all: unset;
  display: flex;
  align-items: center;
  margin-right: 4px;
  color: var(--white); /* 다크 모드일 때 흰색 */
}
.time,
.generate-token {
  color: var(--white); /* 다크 모드일 때 흰색 */
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* --- .light-mode 클래스가 적용되었을 때 (라이트 모드일 때) --- */
.backButton.light-mode {
  color: var(--main01); /* 라이트 모드일 때 --main01 색상 */
}
.time.light-mode,
.generate-token.light-mode {
  color: var(--main01); /* 라이트 모드일 때 --main01 색상 */
  background: rgba(from var(--white) r g b / 0.1);
  border: 1px solid rgba(from var(--main01) r g b / 0.3);
}

.title {
  min-width: 0;
  flex: 1;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  align-content: center;
  z-index: 1;
}

.actions { display: flex; align-items: center; gap: 10px; }
.action-button { all: unset; display: flex; align-items: center; }
.actions_fix { z-index: 1; display: flex; align-items: center; }

.time,
.generate-token {
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.time {
  width: 55px;
  font-size: var(--font-size-ms);
  border-radius: 8px 0 0 8px;
  border-right: none;
}
.time.light-mode {
  border-right: none;
}

.generate-token {
  padding: 0 10px;
  font-size: var(--font-size-sm);
  border-radius: 0 8px 8px 0;
}
</style>
