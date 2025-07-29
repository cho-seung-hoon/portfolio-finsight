<template>
  <div
    class="container"
    :class="{ 'no-border': !showBorder }"
    :style="{ backgroundColor: bColor }">
    <button
      v-if="showBackButton"
      class="backButton"
      :style="{ color: backButtonColor }"
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
      <div
        class="time"
        :style="{ color: backButtonColor }">
        {{ remainingTime }}
      </div>
      <button
        @click="handleExtendSession"
        class="generate-token">
        시간연장
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useHeaderStore } from '@/stores/header';
import IconSearch from '@/components/icons/IconSearch.vue';
import axios from 'axios';
import { decodingJWT } from '@/utils/jwtUtil.js';

const remainingTime = ref('00:00');

function updateRemainingTime() {
  const token = localStorage.getItem('accessToken');
  const timeObj = decodingJWT(token);

  if (timeObj === null) {
    remainingTime.value = '정보 없음';
  } else if (timeObj === '만료됨') {
    remainingTime.value = '만료됨';
  } else {
    // 분, 초를 2자리 문자열로 포맷팅
    const m = String(timeObj.minutes).padStart(2, '0');
    const s = String(timeObj.seconds).padStart(2, '0');
    remainingTime.value = `${m}:${s}`;
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

const emit = defineEmits(['open-time-modal']);

const headerStore = useHeaderStore();

const { titleParts, showBackButton, actions, showBorder, bColor, backHandler } =
  storeToRefs(headerStore);

const backButtonColor = computed(() => {
  return bColor.value === 'var(--white)' ? 'var(--black)' : 'var(--white)';
});

const iconComponents = {
  search: IconSearch
};

async function handleExtendSession() {
  const accessToken = localStorage.getItem('accessToken');
  console.log(accessToken);

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

    const newAccessToken = response.data.data;
    localStorage.setItem('accessToken', newAccessToken);
    console.log('로그인 연장 성공:', response.data.success);
  } catch (error) {
    console.error('로그인 연장 실패:', error);
  }
}

// function handleTimeClick() {
//   emit('open-time-modal'); // 여기서 이벤트를 발생시킵니다.
// }
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: var(--main05);
  border-bottom: 1px solid var(--main03);
}

.container.no-border {
  border-bottom: none;
}

.backButton {
  all: unset;
  display: flex;
  align-items: center;
}

.title {
  min-width: 0px;
  flex: 1;
  padding: 0 20px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  align-content: center;
  z-index: 1;
}

.actions {
  display: flex;
  align-items: center;
  margin: 0 10px;
  gap: 10px;
  color: var(--main01);
}

.time {
  padding: 2px 5px;
  /*
    text-decoration: underline;
    text-decoration-thickness: 0.5px;*/
  font-weight: var(--font-weight-light);
  font-size: var(--font-size-md);
  z-index: 1;
  /*  border: 1px solid var(--main01);*/
  border-radius: 8px;
  background-color: rgb(from var(--white) r g b / 0.7);
}

.action-button {
  all: unset;
  display: flex;
  align-items: center;
}
.generate-token {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem; /* 36px */
  padding: 0.1rem; /* py-2 px-4 */

  font-size: -var(--font-size-sm); /* text-sm */
  font-weight: 500; /* font-medium */

  background-color: var(--primary);
  border-radius: 0.375rem; /* rounded-md */

  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* Hover state */
.generate-token:hover {
  background-color: rgba(var(--primary-rgb), 0.9); /* bg-primary/90 */
}

/* Disabled state */
.generate-token:disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
