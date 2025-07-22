<template>
  <div class="box1">
    <exchangeRate/>
  </div>
  <div class="box2">
    <miniMy/>
  </div>
  <div class="line"></div>
  <div class="box3">

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import { onBeforeRouteLeave } from 'vue-router';
import ExchangeRate from '@/components/home/exchangeRate.vue';
import miniMy from '@/components/home/miniMy.vue';

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
.box1 {
  margin: 20px 0;

}

.line {
  height: 10px;
  background-color: var(--main04);
  margin-left: calc(-1 * 20px);
  margin-right: calc(-1 * 20px);
  width: calc(100% + 40px);
}

.box2{
  margin: 20px 0;
}
</style>
