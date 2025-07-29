<template>
  <Transition name="drop-down-slide-fade">
    <div
      v-if="show"
      ref="dropdownRef"
      :class="['drop-down-container', align === 'right' ? 'right' : 'left']">
      <div class="drop-down-option-list">
        <div
          v-for="option in options"
          :key="option"
          :class="['drop-down-option', { selected: option === selected }]"
          @click="selectOption(option)">
          {{ option }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const { options, align, selected, show } = defineProps({
  options: { type: Array, default: () => [] },
  align: { type: String, default: 'left' },
  selected: { type: String, default: '' },
  show: { type: Boolean, default: false }
});

const emit = defineEmits(['select', 'click-outside']);

const dropdownRef = ref(null);

function selectOption(option) {
  emit('select', option);
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
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
  padding: 12px 16px;
  background: var(--white);
  border: 1px solid var(--main03);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(20, 24, 44, 0.12);
  z-index: 999;
}

.drop-down-container.left {
  left: 0;
}

.drop-down-container.right {
  right: 0;
}

.drop-down-option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drop-down-option {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
  cursor: pointer;
}

.drop-down-option.selected {
  font-weight: var(--font-weight-bold);
}

.drop-down-slide-fade-enter-active,
.drop-down-slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.3, 0.7, 0.4, 1);
}

.drop-down-slide-fade-enter-from,
.drop-down-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.drop-down-slide-fade-enter-to,
.drop-down-slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
