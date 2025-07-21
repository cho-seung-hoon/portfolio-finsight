<template>
  <div class="container">
    <!-- <button v-if="headerStore.showBackButton">뒤로가기</button> -->
    <div class="title">
      <span
        v-for="(part, index) in headerStore.titleParts"
        :key="index"
        :style="{ color: part.color }">
        {{ part.text }}
      </span>
    </div>
    <!-- <div class="actions">
      <button
        v-for="action in headerStore.actions"
        @click="action.handler"></button>
    </div> -->
  </div>
</template>

<script setup>
import { useHeaderStore } from '@/stores/header';

const headerStore = useHeaderStore();
</script>

<style scoped>
.container {
  width: 100%;
  height: 56px;
  background-color: var(--main05);
  border-bottom: 1px solid var(--main03);
  align-content: center;
}
.title {
  margin: 0 20px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}
</style>
