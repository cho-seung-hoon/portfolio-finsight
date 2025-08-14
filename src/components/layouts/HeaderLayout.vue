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

    <!-- 로딩 스피너 -->
    <LoadingSpinner
      v-if="loadingStore.isLoading"
      :text="loadingStore.loadingText" />

    <!-- ✅ 토큰 만료 5분전 팝업 기능 -->
    <!-- <div
      v-if="isModalVisible"
      class="modal-overlay">
      <div class="modal">
        <p>세션이 곧 만료됩니다. 연장하시겠습니까?</p>
        <button
          @click="extendSession"
          class="modal-btn">
          시간 연장
        </button>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useHeaderStore } from '@/stores/header';
import Header from './Header.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useRoute } from 'vue-router';
import { useLoadingStore } from '@/stores/loading';

const isModalVisible = ref(false);
const hasShownExpireWarning = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};
const closeModal = () => {
  isModalVisible.value = false;
};

const headerStore = useHeaderStore();
const loadingStore = useLoadingStore();

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
  /* flex: 1;           <- 제거 */
  /* overflow-y: auto;  <- 제거 */
  overflow-x: hidden;
  padding: 0 20px;
  /* 자식 컴포넌트가 부모의 flex 컨텍스트에 올바르게 반응하도록 함 */
  display: flex;
  flex-direction: column;
  flex: 1;
}
.custom-scrollbar-thumb:active {
  cursor: grabbing;
}

/* ✅ 토큰 만료 5분전 팝업 기능 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal {
  background-color: white;
  padding: 20px 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.modal-btn {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
