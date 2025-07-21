<template>
  <div>
    <div class="test">hihi</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import { onBeforeRouteLeave } from 'vue-router';

const headerStore = useHeaderStore();

onMounted(() => {
  headerStore.setHeader({
    titleParts: [
      { text: 'OOO', color: 'var(--sub01)' },
      { text: '님, 반갑습니다.', color: 'var(--main01)' }
    ]
  });
});

onBeforeRouteLeave((to, from) => {
  headerStore.resetHeader();
});
</script>

<style scoped>
.test {
  width: 100%;
  height: 2000px;
  background-color: aqua;
}
</style>
