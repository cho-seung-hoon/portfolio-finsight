<template>
  <div>찜한 목록</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';

const headerStore = useHeaderStore();

onMounted(() => {
  headerStore.setHeader({
    titleParts: [{ text: '찜한 목록', color: 'var(--main01)' }],
    showBackButton: true,
    actions: []
  });
});
</script>

<style scoped></style>
