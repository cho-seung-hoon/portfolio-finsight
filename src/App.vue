<template>
  <div id="app-container">
    <component :is="layoutComponent">
      <router-view />
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './components/layouts/DefaultLayout.vue';
import EmptyLayout from './components/layouts/EmptyLayout.vue';
import HeaderLayout from './components/layouts/HeaderLayout.vue';
import NavBarLayout from '@/components/layouts/NavBarLayout.vue';

const layouts = {
  DefaultLayout,
  EmptyLayout,
  HeaderLayout,
  NavBarLayout
};

const route = useRoute();

const layoutComponent = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  return layouts[layoutName];
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background-color: var(--main04);
}

#app-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  #app-container {
    width: 440px;
    height: 100vh;
    margin: 0 auto; /* 수평 가운데 정렬 */
    box-shadow: 0 5px 15px var(--main03);
  }
}
</style>
