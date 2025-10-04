<template>
  <div class="long-text-container">
    <div
      ref="contentRef"
      class="long-text-content"
      :style="contentStyle">
      <slot></slot>
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
const maxCollapsedHeight = 90;

const contentStyle = computed(() => {
  return {
    maxHeight: expanded.value
      ? `${contentRef.value?.scrollHeight || 9999}px`
      : `${maxCollapsedHeight}px`,
    overflow: 'hidden',
    transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s',
    opacity: expanded.value ? 1 : 0.7
  };
});

function toggle() {
  expanded.value = !expanded.value;
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
  background: var(--white);
  border-radius: 8px;
  border: 1px solid var(--main04);
  padding: 16px 15px 50px 15px;
  font-size: var(--font-size-ms);
  line-height: 1.6;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  color: var(--black);
}
.long-text-content {
  white-space: pre-line;
  color:var(--black);
}
.toggle-btn {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  background: none;
  border: none;
  color: var(--main03);
  font-size: var(--font-size-ms);
  cursor: pointer;

  font-family: inherit;
  font-weight: var(--font-weight-bold);
  letter-spacing: 1px;
}
</style>
