<template>
  <div
    class="input-row"
    :class="{ error, focus: isFocused }">
    <div class="left">
      <i
        class="fas fa-key icon"
        aria-hidden="true"></i>
      <input
        type="text"
        :value="modelValue"
        placeholder="인증코드 입력"
        @input="onInput"
        @focus="handleFocus"
        @blur="handleBlur" />
    </div>
    <div class="button-group">
      <button
        type="button"
        class="resend"
        @click="$emit('resend')">
        재요청
      </button>
      <button
        type="button"
        class="action-btn"
        @click="$emit('verify')">
        확인
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String,
  error: Boolean
});

const emit = defineEmits(['update:modelValue', 'verify', 'resend', 'blur', 'focus']);

const onInput = e => emit('update:modelValue', e.target.value);

const isFocused = ref(false);

const handleFocus = e => {
  isFocused.value = true;
  emit('focus', e); // ✅ 외부로 전달
};

const handleBlur = e => {
  isFocused.value = false;
  emit('blur', e); // 기존 유지
};
</script>

<style scoped>
.input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 54px;
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

.button-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resend {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: bold;
  color: #f97b6d;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
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
