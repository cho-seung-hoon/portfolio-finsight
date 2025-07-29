<template>
  <div class="layout-container">
    <div
      ref="scrollRef"
      class="scroll-wrapper">
      <div
        class="header"
        :class="{ 'position-fix': !stickyHeader }">
        <Header @open-time-modal="openModal" />
      </div>
      <div class="content-container">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
    <div
      v-show="hasScroll"
      ref="trackEl"
      class="custom-scrollbar">
      <div
        ref="thumbEl"
        class="custom-scrollbar-thumb"></div>
    </div>
    <TimeModal
      v-if="isModalVisible"
      @close="closeModal" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useHeaderStore } from '@/stores/header';
import Header from './Header.vue';
import TimeModal from '@/components/layouts/TimeModal.vue';
import { useRoute } from 'vue-router';

const isModalVisible = ref(false);
const openModal = () => {
  isModalVisible.value = true;
};
const closeModal = () => {
  isModalVisible.value = false;
};

const headerStore = useHeaderStore();

const stickyHeader = computed(() => headerStore.stickyHeader);

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
  bottom: 0px;
  width: 5px;
  z-index: 10;
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

.header.position-fix {
  position: sticky;
  z-index: 3;
  width: 100%;
}

.content-container {
  padding: 0px 20px;
  min-height: 0;
  padding-bottom: 80px;
}

.custom-scrollbar-thumb:active {
  cursor: grabbing;
}
</style>
