<template>
  <div class="layout-container">
    <div class="header">
      <Header />
    </div>
    <div class="content-container">
      <router-view v-slot="{ Component}">
        <component :is="Component"/>
      </router-view>
    </div>

    <div class="footer">
      <NavBar />
    </div>
  </div>
</template>

<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';

/*
import { onMounted, onBeforeUnmount, ref } from 'vue';

const layoutRef = ref(null);
const hasScroll = ref(null);

let resizeObserver;
let mutationObserver;

const checkScroll = () => {
  const el = layoutRef.value;
  if (!el) return;
  const current = el.scrollHeight > el.clientHeight;
  if (hasScroll.value !== current) {
    hasScroll.value = current;
    console.log('스크롤 있음?', current);
  }
};

onMounted(() => {
  const el = layoutRef.value;
  resizeObserver = new ResizeObserver(checkScroll);
  resizeObserver.observe(el);
  mutationObserver = new MutationObserver(checkScroll);
  mutationObserver.observe(el, { childList: true, subtree: true });
  checkScroll();
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (mutationObserver) mutationObserver.disconnect();
});
*/

</script>

<style scoped>
.layout-container {
  display: flex;
  background-color: var(--off-white); /* 본문 배경색 */
  flex-direction: column;
  height: 100dvh;
  overflow-y:auto;
  overflow-x:hidden;

}

.header {
  height: 56px;
  flex-shrink: 0;
}

.content-container {
  flex: 1;
  position: relative;
  padding: 0px 20px;
  margin-bottom: 60px;
}

.content-container.with-scroll {
  padding-right: 12px;
}

.footer {
  position: fixed;
  bottom: 0;
  height: 60px;
  width: 100%;
  flex-shrink: 0;
}

.layout-container::-webkit-scrollbar{
  display: none;
}

@media (min-width: 769px) {
  .footer {
    max-width: 440px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
