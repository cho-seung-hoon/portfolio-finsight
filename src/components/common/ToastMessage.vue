<template>
  <Transition name="toast">
    <div
      v-if="props.isVisible"
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
import IconCheck from '@/components/icons/IconCheck.vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // 'success', 'error', 'warning', 'info', 'remove'
    validator: value => ['success', 'error', 'warning', 'info', 'remove'].includes(value)
  },
  timestamp: {
    type: String,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: true
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
