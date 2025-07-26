<template>
  <div
    class="container"
    :class="{ 'no-border': !showBorder }"
    :style="{ backgroundColor: bColor }">
    <button
      v-if="showBackButton"
      class="backButton"
      @click="backHandler">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.5 9L13.5 18L22.5 27"
          stroke="black"
          stroke-width="2"
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
    <div
      v-if="actions.length > 0"
      class="actions">
      <router-link
        v-for="action in actions"
        :key="action.icon"
        :to="action.to"
        class="action-button">
        <component :is="iconComponents[action.icon]" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useHeaderStore } from '@/stores/header';
import IconSearch from '@/components/icons/IconSearch.vue';
import IconWatch from '@/components/icons/IconWatch.vue';

const headerStore = useHeaderStore();

const { titleParts, showBackButton, actions, showBorder, bColor, backHandler } =
  storeToRefs(headerStore);

const iconComponents = {
  search: IconSearch,
  watch: IconWatch
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
  margin: 0 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--main01);
}

.action-button {
  all: unset;
}
</style>
