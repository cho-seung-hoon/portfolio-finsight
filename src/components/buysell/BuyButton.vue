<template>
  <div class="buy-btn-fixed-wrapper">
    <button
      class="submit-btn"
      :disabled="loading || disabled"
      @click="$emit('click')">
      {{ loading ? '처리 중...' : label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
  disabled: Boolean,
  label: String
});
defineEmits(['click']);
</script>

<style scoped>
.buy-btn-fixed-wrapper {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  width: 100%;
  max-width: 408px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.submit-btn {
  width: 100%;
  border-radius: 20px;
  padding: 16px 0;
  background: var(--main01);
  color: var(--white);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  border: none;
  cursor: pointer;
  min-height: 56px;
  box-sizing: border-box;
}
@media (max-width: 480px) {
  .buy-btn-fixed-wrapper {
    width: calc(100% - 32px);
    max-width: 100vw;
  }
}
</style>
