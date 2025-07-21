<template>
  <div class="box1">
    <exchangeRate/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import { onBeforeRouteLeave } from 'vue-router';
import ExchangeRate from '@/components/exchangeRate.vue';

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
.box1{
  margin:20px 0;
}

</style>
