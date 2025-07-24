<template>
  <div class="box1">
    <ExchangeRate/>
  </div>
  <div class="box2">
    <MiniMy/>
  </div>
  <div class="line"></div>
  <div class="box3">
    <NewsChart/>
  </div>
  <div class="box4">
    <NewsList/>
  </div>
  <div class="box5">
    <NewsProduct/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import { onBeforeRouteLeave } from 'vue-router';
import ExchangeRate from '@/components/home/ExchangeRate.vue';
import MiniMy from '@/components/home/MiniMy.vue';
import NewsChart from '@/components/home/NewsChart.vue'
import NewsList from '@/components/home/NewsList.vue';
import NewsProduct from '@/components/home/NewsProduct.vue';

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

.box3{
  margin:20px 0;
}

.box4{
  margin:20px 0;
}

.box5{
  margin-top:20px;
  margin-bottom: 30px;
}
</style>
