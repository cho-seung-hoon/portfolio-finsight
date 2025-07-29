<template>
  <Transition name="toast">
    <div
      v-if="isVisible"
      class="toast-message"
      :class="type">
      <div class="toast-content">
        <IconCheck
          v-if="type === 'success'"
          :width="20"
          color="var(--white)" />
        <span
          v-else-if="type === 'error'"
          class="error-icon"
          >×</span
        >
        <div class="toast-text-container">
          <span class="toast-text">{{ message }}</span>
          <span
            v-if="timestamp && type === 'success'"
            class="toast-timestamp"
            >{{ timestamp }}</span
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import IconCheck from '@/components/icons/IconCheck.vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // 'success', 'error', 'cancel', 'remove'
    validator: value => ['success', 'error', 'cancel', 'remove'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000 // 3초
  },
  timestamp: {
    type: String,
    default: null
  }
});

const isVisible = ref(false);

const show = () => {
  isVisible.value = true;
  if (props.duration > 0) {
    window.toastTimer = setTimeout(() => {
      hide();
    }, props.duration);
  }
};

const hide = () => {
  isVisible.value = false;
};

// 외부에서 호출할 수 있도록 expose
defineExpose({
  show,
  hide
});

// props가 변경될 때마다 토스트 표시
watch(
  () => [props.message, props.type, props.timestamp],
  () => {
    if (props.message) {
      // 기존 타이머가 있다면 클리어
      if (window.toastTimer) {
        clearTimeout(window.toastTimer);
      }
      show();
    }
  },
  { immediate: true }
);

// 컴포넌트가 언마운트될 때 타이머 정리
onUnmounted(() => {
  if (window.toastTimer) {
    clearTimeout(window.toastTimer);
  }
});
</script>

<style scoped>
.toast-message {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 990;
  padding: 12px 20px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid;
  min-width: 280px;
  max-width: 90vw;
}

.toast-message.success {
  background: rgba(40, 202, 110, 0.9);
  color: var(--white);
  border-color: rgba(40, 202, 110, 0.5);
}

.toast-message.error {
  background: rgba(255, 59, 48, 0.9);
  color: var(--white);
  border-color: rgba(255, 59, 48, 0.5);
}

.toast-message.remove {
  background: rgba(128, 128, 128, 0.9);
  color: var(--white);
  border-color: rgba(128, 128, 128, 0.5);
}

.toast-message.cancel {
  background: rgba(255, 193, 7, 0.9);
  color: var(--white);
  border-color: rgba(255, 193, 7, 0.5);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.toast-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.toast-text {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

.toast-timestamp {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  opacity: 0.9;
  text-align: center;
}

.error-icon {
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}

/* 토스트 애니메이션 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateX(100px);
}
</style>
