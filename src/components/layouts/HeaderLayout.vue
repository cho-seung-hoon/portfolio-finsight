<template>
  <div class="layout-container">
    <div
      class="header"
      :class="{ 'position-fix': !stickyHeader }">
      <Header />
    </div>
    <div class="content-container">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHeaderStore } from '@/stores/header';
import Header from './Header.vue';

const headerStore = useHeaderStore();

const stickyHeader = computed(() => headerStore.stickyHeader);
</script>

<style scoped>
.layout-container {
  display: flex;
  background-color: var(--off-white); /* 본문 배경색 */
  flex-direction: column;
  height: 100vh;
}

.header {
  height: 56px;
  flex-shrink: 0;
}

.header.position-fix {
  position: sticky;
  z-index: 3;
  width: 100%;
}

.content-container {
  flex: 1;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px 60px;
}

.content-container::-webkit-scrollbar {
  display: none;
}
</style>
