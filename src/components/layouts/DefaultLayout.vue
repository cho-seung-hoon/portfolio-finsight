<template>
  <div class="layout-container">
    <div
      ref="scrollRef"
      class="scroll-wrapper">
      <div class="header">
        <Header />
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
  </div>
</template>

<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';

// --- 변경점 1: ref 변수 정리 ---
// 스크롤의 주체가 될 scrollRef를 사용하고, 기존 layoutRef와 contentRef는 제거합니다.
const scrollRef = ref(null);
const trackEl = ref(null);
const thumbEl = ref(null);
const hasScroll = ref(false);
const route = useRoute();

let resizeObserver;
let mutationObserver;

const handleScroll = () => {
  // --- 변경점 2: 스크롤 계산 대상을 scrollRef로 변경 ---
  const container = scrollRef.value;
  const thumb = thumbEl.value;
  const track = trackEl.value; // 명시적인 trackEl ref를 사용
  if (!container || !thumb || !track) return;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  // 스크롤 영역이 없으면 중단
  if (scrollHeight <= clientHeight) return;

  const scrollableArea = scrollHeight - clientHeight;
  const trackHeight = track.clientHeight;

  // Thumb 높이 계산 (최소 높이 30px 보장)
  const rawThumbHeight = (clientHeight / scrollHeight) * trackHeight;
  const thumbHeight = Math.max(rawThumbHeight, 30);

  // Thumb 위치 계산
  const thumbMaxTop = trackHeight - thumbHeight;
  const thumbPosition = (scrollTop / scrollableArea) * thumbMaxTop;

  // 계산된 스타일 적용
  thumb.style.height = `${thumbHeight}px`;
  thumb.style.transform = `translateY(${Math.min(thumbPosition, thumbMaxTop)}px)`;
};

const checkScroll = async () => {
  await nextTick();
  // 스크롤 확인 대상도 scrollRef로 변경
  const el = scrollRef.value;
  if (!el) return;

  hasScroll.value = el.scrollHeight > el.clientHeight;
  if (hasScroll.value) {
    handleScroll();
  }
};

// --- 스크롤 드래그 로직 (내부는 동일, 대상만 변경) ---
let isDragging = false;
let startY = 0;
let startScrollTop = 0;

const onThumbMouseDown = e => {
  e.preventDefault();
  isDragging = true;
  startY = e.clientY;
  // 시작 스크롤 위치를 scrollRef에서 가져옴
  startScrollTop = scrollRef.value?.scrollTop || 0;
  document.body.style.cursor = 'grabbing';
  document.body.style.userSelect = 'none';
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = e => {
  if (!isDragging) return;
  const container = scrollRef.value; // 대상을 scrollRef로 변경
  const track = trackEl.value;
  const thumb = thumbEl.value;
  if (!container || !track || !thumb) return;

  const deltaY = e.clientY - startY;
  const trackHeight = track.clientHeight;
  const thumbHeight = thumb.offsetHeight;
  const scrollableArea = container.scrollHeight - container.clientHeight;
  if (scrollableArea <= 0) return;

  const thumbMaxTop = trackHeight - thumbHeight;
  if (thumbMaxTop <= 0) return;

  const scrollRatio = scrollableArea / thumbMaxTop;
  // 스크롤 위치를 업데이트할 대상도 scrollRef로 변경
  container.scrollTop = startScrollTop + deltaY * scrollRatio;
};

const onMouseUp = () => {
  isDragging = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

onMounted(() => {
  // --- 변경점 3: 이벤트 및 Observer 연결 대상을 scrollRef로 변경 ---
  const container = scrollRef.value;
  if (!container || !trackEl.value) return;

  resizeObserver = new ResizeObserver(() => {
    checkScroll();
  });

  // 관찰 대상을 scrollRef와 trackEl로 설정
  resizeObserver.observe(container);
  resizeObserver.observe(trackEl.value);

  mutationObserver = new MutationObserver(() => {
    checkScroll();
  });

  // 콘텐츠 변경 감지 대상을 scrollRef로 설정
  mutationObserver.observe(container, { childList: true, subtree: true });

  // 스크롤 이벤트 리스너를 scrollRef에 추가
  container.addEventListener('scroll', handleScroll);

  if (thumbEl.value) {
    thumbEl.value.addEventListener('mousedown', onThumbMouseDown);
  }

  checkScroll();
});

onBeforeUnmount(() => {
  const container = scrollRef.value;
  if (container) container.removeEventListener('scroll', handleScroll);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  if (resizeObserver) resizeObserver.disconnect();
  if (mutationObserver) mutationObserver.disconnect();
});

watch(route, () => {
  // --- 변경점 4: 라우트 변경 시 스크롤 대상도 scrollRef로 변경 ---
  scrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
/* 레이아웃 컨테이너: Flexbox, 세로 방향 */
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative; /* 스크롤바의 기준 */
}
.layout-container::-webkit-scrollbar {
  display: none;
}
/* (핵심) 스크롤 래퍼: 남은 공간을 모두 차지하고 내부에서 스크롤 */
.scroll-wrapper {
  flex-grow: 1; /* 남은 공간 모두 차지 */
  overflow-y: auto; /* 내용이 넘치면 스크롤 */
  /* 네이티브 스크롤바 숨기기 */
  scrollbar-width: none;
}
.scroll-wrapper::-webkit-scrollbar {
  display: none;
}

/* 커스텀 스크롤바: 전체 높이에서 푸터 높이만큼을 제외한 위치에 표시 */
.custom-scrollbar {
  position: absolute;
  right: 0;
  top: 0; /* 이제 최상단부터 시작 */
  bottom: 50px; /* 푸터 높이(50px로 가정)만큼 위에서 끝남 */
  width: 10px;
  background-color: #f1f1f1;
}

.custom-scrollbar-thumb {
  width: 100%;
  height: 50px;
  background-color: #888;
  border-radius: 5px;
}

.header {
  height: 56px;
  flex-shrink: 0;
}

.content-container {
  padding: 0px 20px;
  min-height: 0;
  padding-bottom: 80px;
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

@media (min-width: 769px) {
  .footer {
    max-width: 440px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
