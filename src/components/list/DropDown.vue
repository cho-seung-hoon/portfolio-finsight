<template>
  <div
    :class="['drop-down-container', align === 'right' ? 'right' : 'left']"
    ref="root">
    <div class="drop-down-option-list">
      <div
        class="drop-down-option"
        v-for="option in options"
        :key="option"
        :class="{ selected: option === selected }"
        @click="onClickOption(option)">
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
  options: { type: Array, default: () => [] },
  align: { type: String, default: 'left' },
  selected: { type: String, default: '' }
});

// 드롭다운에서 선택한 것을 부모인 FilterSortBar로 전달
const emit = defineEmits(['select']);

function onClickOption(option) {
  emit('select', option);
}

// 바깥 클릭 감지
const root = ref(null);

function handleClickOutside(event) {
  if (root.value && !root.value.contains(event.target)) {
    emit('click-outside');
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.drop-down-container {
  position: absolute;
  top: 110%;
  min-width: 120px;
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(20, 24, 44, 0.12);
  border: 1px solid var(--main03);
  z-index: 999;
  padding: 12px 16px;
}

.drop-down-container.left {
  left: 0;
  right: auto;
}

.drop-down-container.right {
  right: 0;
  left: auto;
}

.drop-down-option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drop-down-option {
  display: flex;
  flex-direction: row;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
  cursor: pointer;
}

.drop-down-option.selected {
  font-weight: var(--font-weight-bold);
  color: var(--main01);
  border-radius: 4px;
}
</style>
