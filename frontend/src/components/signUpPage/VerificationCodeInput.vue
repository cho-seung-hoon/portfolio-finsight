<template>
  <div
    class="input-row"
    :class="{ error, focus: isFocused, disabled: disabled }">
    <div class="left">
      <i
        class="fas fa-key icon"
        :class="{ error, valid: valid && !error }"
        aria-hidden="true"></i>
      <input
        type="text"
        :value="modelValue"
        placeholder="인증코드 입력"
        :disabled="disabled"
        :aria-disabled="disabled ? 'true' : 'false'"
        @input="onInput"
        @focus="handleFocus"
        @blur="handleBlur" />
    </div>
    <div class="button-group">
      <button
        type="button"
        class="resend"
        :disabled="disabled"
        @click="$emit('resend')">
        재요청
      </button>
      <button
        type="button"
        class="action-btn"
        :disabled="disabled"
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
  error: Boolean,
  valid: Boolean,
  disabled: { type: Boolean, default: false } // ✅ 부모가 제어
});

const emit = defineEmits(['update:modelValue', 'verify', 'resend', 'blur', 'focus']);

const isFocused = ref(false);

// 입력 시: 비활성 상태면 무시
const onInput = e => {
  if (props.disabled) return; // ✅ 가드
  emit('update:modelValue', e.target.value);
};

const handleFocus = e => {
  if (props.disabled) return; // ✅ 가드
  isFocused.value = true;
  emit('focus', e);
};

const handleBlur = e => {
  if (props.disabled) return; // ✅ 가드
  isFocused.value = false;
  emit('blur', e);
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
  transition:
    border-color 0.2s ease,
    opacity 0.2s ease;
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

/* ✅ 비활성화 시 시각/상호작용 모두 차단 */
.input-row.disabled {
  opacity: 0.6;
  pointer-events: none;
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
  color: #28a745;
}

input {
  width: 100%;
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

.resend:disabled {
  text-decoration: none;
  cursor: default;
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

.action-btn:disabled {
  opacity: 0.8;
  cursor: default;
}
</style>
