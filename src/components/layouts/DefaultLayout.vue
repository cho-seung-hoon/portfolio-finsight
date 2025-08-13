<template>
  <div class="layout-container">
    <div
      ref="scrollRef"
      class="scroll-wrapper">
      <div class="header">
        <Header @open-time-modal="openModal" />
      </div>
      <div class="content-container">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>

    <div class="footer">
      <NavBar />
    </div>

    <div
      v-show="hasScroll"
      ref="trackEl"
      class="custom-scrollbar">
      <div
        ref="thumbEl"
        class="custom-scrollbar-thumb"></div>
    </div>

    <!-- 로딩 스피너 -->
    <LoadingSpinner
      class="loading"
      v-if="loadingStore.isLoading"
      :text="loadingStore.loadingText" />
  </div>
</template>

<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();

const isModalVisible = ref(false);
const openModal = () => {
  isModalVisible.value = true;
};
const closeModal = () => {
  isModalVisible.value = false;
};

const scrollRef = ref(null);
const trackEl = ref(null);
const thumbEl = ref(null);
const hasScroll = ref(false);
const route = useRoute();

let resizeObserver;
let mutationObserver;

const handleScroll = () => {
  const container = scrollRef.value;
  const thumb = thumbEl.value;
  const track = trackEl.value;
  if (!container || !thumb || !track) return;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  if (scrollHeight <= clientHeight) return;

  const scrollableArea = scrollHeight - clientHeight;
  const trackHeight = track.clientHeight;

  const rawThumbHeight = (clientHeight / scrollHeight) * trackHeight;
  const thumbHeight = Math.max(rawThumbHeight, 30);

  const thumbMaxTop = trackHeight - thumbHeight;
  const thumbPosition = (scrollTop / scrollableArea) * thumbMaxTop;

  thumb.style.height = `${thumbHeight}px`;
  thumb.style.transform = `translateY(${Math.min(thumbPosition, thumbMaxTop)}px)`;
};

const checkScroll = async () => {
  await nextTick();

  const el = scrollRef.value;
  if (!el) return;

  hasScroll.value = el.scrollHeight > el.clientHeight;
  if (hasScroll.value) {
    handleScroll();
  }
};

onMounted(() => {
  const container = scrollRef.value;
  if (!container || !trackEl.value) return;

  resizeObserver = new ResizeObserver(() => {
    checkScroll();
  });

  resizeObserver.observe(container);
  resizeObserver.observe(trackEl.value);

  mutationObserver = new MutationObserver(() => {
    checkScroll();
  });

  mutationObserver.observe(container, { childList: true, subtree: true });

  container.addEventListener('scroll', handleScroll);

  checkScroll();
});

onBeforeUnmount(() => {
  const container = scrollRef.value;
  if (container) container.removeEventListener('scroll', handleScroll);
  if (resizeObserver) resizeObserver.disconnect();
  if (mutationObserver) mutationObserver.disconnect();
});

watch(route, () => {
  scrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
.layout-container {
  display: flex;
  background-color: var(--off-white);
  flex-direction: column;
  height: 100dvh;
  position: relative;
}

.layout-container::-webkit-scrollbar {
  display: none;
}

.scroll-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: none;
}

.scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 60px;
  width: 5px;
}

.custom-scrollbar-thumb {
  width: 100%;
  height: 50px;
  background-color: rgb(from var(--main01) r g b / 0.2);
}

.header {
  height: 56px;
  flex-shrink: 0;
}

.content-container {
  padding: 0px 20px;
  min-height: 0;
  padding-bottom: 80px;
  flex: 1;
}

.footer {
  position: fixed;
  bottom: 0;
  height: 60px;
  width: 100%;
  z-index: 10;
  background-color: white;
}

.custom-scrollbar-thumb:active {
  cursor: grabbing;
}

.loading{
  position:absolute;
  top:0;
  left:0;

}

@media (min-width: 769px) {
  .footer {
    max-width: 440px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
