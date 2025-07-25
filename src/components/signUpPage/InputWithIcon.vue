<template>
  <div
    class="input-row"
    :class="{ error, focus: isFocused }">
    <div class="left">
      <i
        :class="[
          'fas',
          iconClass,
          'icon',
          { error: props.error, valid: props.valid && !props.error }
        ]"
        aria-hidden="true"></i>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        @focus="handleFocus"
        @blur="handleBlur" />
    </div>
    <button
      v-if="buttonText"
      class="action-btn"
      type="button"
      @click="$emit('button-click')">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  icon: String,
  type: { type: String, default: 'text' },
  buttonText: String,
  error: Boolean,
  valid: Boolean // ✅ 추가
});

const emit = defineEmits(['update:modelValue', 'button-click', 'blur', 'focus']);

const handleFocus = e => {
  isFocused.value = true;
  emit('focus', e); // ✅ 외부에 focus 전달
};

const handleBlur = e => {
  isFocused.value = false;
  emit('blur', e);
};

const onInput = e => emit('update:modelValue', e.target.value);

const isFocused = ref(false);
const iconClass = props.icon || 'fa-user';
</script>

<style scoped>
.input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* height: 54px; */
  min-height: 54px; /* ✅ 고정 아님, 최소값으로 변경 */
  padding: 0 12px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  transition: border-color 0.2s ease;
}

.input-row:first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.input-row:last-child {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom: none;
}

.input-row.error {
  border-color: #f97b6d;
}

.input-row.focus {
  border-color: #f97b6d;
}

.left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;
}

.icon {
  font-size: 16px;
  color: #555;
  min-width: 20px;
  text-align: center;
  transition: color 0.2s ease;
}

.icon.error {
  color: #f97b6d;
}

.icon.valid {
  color: #28a745; /* Bootstrap success green */
}

.input-row.focus .icon {
  color: #f97b6d;
}

input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: transparent;
  color: #333;
}

.action-btn {
  background-color: #f97b6d;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  height: 32px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
