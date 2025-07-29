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
        00:00
      </div>
      <button @click="handleExtendSession">시간연장</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useHeaderStore } from '@/stores/header';
import IconSearch from '@/components/icons/IconSearch.vue';

const emit = defineEmits(['open-time-modal']);

const accessToken = ref('');

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
  try {
    const response = await axios.get('http://localhost:8080'); // 액세스 토큰 발급 url
    accessToken.value = response.data.data;
    console.log('로그인 연장 성공:', response.data.success);
  } catch (error) {
    console.error('로그인 연장 실패:', response.data.success);
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
  margin-right: 8px;
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
</style>
