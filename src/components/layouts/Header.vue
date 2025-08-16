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
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useHeaderStore } from '@/stores/header';
import { useSessionStore } from '@/stores/session.js';
import IconSearch from '@/components/icons/IconSearch.vue';

const sessionStore = useSessionStore();

const { remainingTime } = storeToRefs(sessionStore);

const headerStore = useHeaderStore();
const { titleParts, showBackButton, actions, showBorder, bColor, backHandler } =
  storeToRefs(headerStore);

const isLightMode = computed(() => bColor.value === 'var(--white)');

const iconComponents = {
  search: IconSearch,
};

const handleExtendSession = () => {
  sessionStore.extendSession();
};
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

.backButton {
  all: unset;
  display: flex;
  align-items: center;
  margin-right: 4px;
  color: var(--white);
}

.time,
.generate-token {
  color: var(--white);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.backButton.light-mode {
  color: var(--main01);
}

.time.light-mode,
.generate-token.light-mode {
  color: var(--main01);
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
