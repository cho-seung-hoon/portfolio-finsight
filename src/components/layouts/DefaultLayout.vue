<template>
  <div class="layout-container" ref="layoutRef">
    <div class="header">
      <Header />
    </div>
    <div class="content-container">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
    <div class="footer">
      <NavBar />
    </div>
    <div v-show="hasScroll" class="custom-scrollbar">
      <div class="custom-scrollbar-thumb" ref="thumbEl"></div>
    </div>
  </div>
</template>

<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const layoutRef = ref(null);
const thumbEl = ref(null);
const hasScroll = ref(false);
const route = useRoute();
let resizeObserver;
let mutationObserver;

const handleScroll = () => {
  const layout = layoutRef.value;
  const thumb = thumbEl.value;
  if (!layout || !thumb) return;

  const { scrollTop, scrollHeight, clientHeight } = layout;
  const scrollableArea = scrollHeight - clientHeight;

  if (scrollableArea <= 0) {
    thumb.style.height = '0px';
    return;
  }

  const trackHeight = clientHeight - 60; // footer 높이 제외
  let thumbHeight = ((clientHeight / scrollHeight) * trackHeight) * 0.35;
  thumbHeight = Math.max(thumbHeight, 20);

  thumb.style.height = `${thumbHeight}px`;
  const thumbPosition = (scrollTop / scrollableArea) * (trackHeight - thumbHeight);
  thumb.style.top = `${thumbPosition}px`;
};

const checkScroll = () => {
  const el = layoutRef.value;
  if (!el) return;

  hasScroll.value = el.scrollHeight > el.clientHeight;
  handleScroll();
};

let isDragging = false;
let startY = 0;
let startScrollTop = 0;

const onThumbMouseDown = (e) => {
  e.preventDefault();
  isDragging = true;
  startY = e.clientY;
  startScrollTop = layoutRef.value?.scrollTop || 0;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e) => {
  if (!isDragging || !layoutRef.value || !thumbEl.value) return;

  const layout = layoutRef.value;
  const thumb = thumbEl.value;

  const deltaY = e.clientY - startY;
  const trackHeight = layout.clientHeight - 60; // footer 제외
  const thumbHeight = thumb.offsetHeight;
  const scrollableArea = layout.scrollHeight - layout.clientHeight;

  const scrollRatio = scrollableArea / (trackHeight - thumbHeight);
  layout.scrollTop = startScrollTop + deltaY * scrollRatio;
};

const onMouseUp = () => {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};


onMounted(() => {
  const el = layoutRef.value;
  if (!el) return;

  resizeObserver = new ResizeObserver(checkScroll);
  resizeObserver.observe(el);

  mutationObserver = new MutationObserver(checkScroll);
  mutationObserver.observe(el, { childList: true, subtree: true });

  el.addEventListener('scroll', handleScroll);
  checkScroll();

  if (thumbEl.value) {
    thumbEl.value.addEventListener('mousedown', onThumbMouseDown);
  }
});

onBeforeUnmount(() => {
  const el = layoutRef.value;

  if (resizeObserver) resizeObserver.disconnect();
  if (mutationObserver) mutationObserver.disconnect();
  if (el) el.removeEventListener('scroll', handleScroll);
  if (thumbEl.value) {
    thumbEl.value.removeEventListener('mousedown', onThumbMouseDown);
  }
});

watch(route, () => {
  if (layoutRef.value) {
    layoutRef.value.scrollTop = 0;
    handleScroll();
  }
});


</script>

<style scoped>
.layout-container {
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background-color: var(--off-white);
  scrollbar-width: none;
  padding-bottom: 60px;
}

.layout-container::-webkit-scrollbar {
  display: none;
}

.header {
  height: 56px;
  flex-shrink: 0;
}

.content-container {
  padding: 0px 20px;
  min-height: 0;
}

.footer {
  position: fixed;
  bottom: 0;
  height: 60px;
  width: 100%;
  z-index: 10;
  background-color: white;
}

.custom-scrollbar {
  position: fixed;
  top: 0;
  bottom: 60px;
  right: 0;
  width: 3px;
  z-index: 20;
}

.custom-scrollbar-thumb {
  position: absolute;
  width: 100%;
  background-color: rgb(from var(--main01) r g b / 0.3);
  transition: background-color 0.3s, height 0.3s;
  cursor: grab;
}

.custom-scrollbar-thumb:hover {
  background-color: rgb(from var(--main01) r g b / 0.7);
}

.custom-scrollbar-thumb:active {
  cursor: grabbing;
}
</style>
