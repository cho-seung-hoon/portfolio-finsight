import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    type: 'success', // 'success', 'error', 'warning', 'info', 'remove'
    isVisible: false,
    duration: 3000
  }),

  actions: {
    showToast(message, type = 'success', duration = 3000) {
      this.message = message;
      this.type = type;
      this.duration = duration;
      this.isVisible = true;

      // 자동으로 숨기기
      setTimeout(() => {
        this.hideToast();
      }, this.duration);
    },

    hideToast() {
      this.isVisible = false;
    },

    // 토스트 타입별 메서드
    success(message, duration) {
      this.showToast(message, 'success', duration);
    },

    error(message, duration) {
      this.showToast(message, 'error', duration);
    },

    warning(message, duration) {
      this.showToast(message, 'warning', duration);
    },

    info(message, duration) {
      this.showToast(message, 'info', duration);
    },

    remove(message, duration) {
      this.showToast(message, 'remove', duration);
    },

    cancel(message, duration) {
      this.showToast(message, 'cancel', duration);
    }
  }
});
