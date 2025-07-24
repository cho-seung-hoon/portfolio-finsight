<template>
  <div class="long-text-container">
    <div
      class="long-text-content"
      ref="contentRef"
      :style="contentStyle">
      <slot />
    </div>
    <button
      class="toggle-btn"
      @click="toggle">
      {{ expanded ? '접기' : '더보기' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const expanded = ref(false);
const contentRef = ref(null);
const maxCollapsedHeight = 90; // px

const contentStyle = computed(() => {
  return {
    maxHeight: expanded.value
      ? `${contentRef.value?.scrollHeight || 9999}px`
      : `${maxCollapsedHeight}px`,
    overflow: 'hidden',
    transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s',
    opacity: expanded.value ? 1 : 0.7 // 선택: 펼칠 때 살짝 fade-in 효과
  };
});

function toggle() {
  expanded.value = !expanded.value;
  // 펼칠 때는 scrollHeight를 반영하기 위해 nextTick 사용
  if (expanded.value) {
    nextTick(() => {
      if (contentRef.value) {
        contentRef.value.style.maxHeight = contentRef.value.scrollHeight + 'px';
      }
    });
  }
}
</script>

<style scoped>
.long-text-container {
  background: transparent;
  border-radius: 20px;
  border: 1px solid var(--main02);
  padding: 16px 3vw 40px 3vw;
  font-size: 14px;
  line-height: 1.6;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  color: var(--black);
}
.long-text-content {
  white-space: pre-line;
}
.toggle-btn {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  background: none;
  border: none;
  color: var(--main03);
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
