<!-- components/common/AlertModal.vue -->
<template>
  <div
    v-if="visible"
    class="modal-overlay">
    <div class="modal-content">
      <p class="message">{{ message }}</p>
      <button
        class="confirm-btn"
        @click="close">
        확인
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ message: String });
const emit = defineEmits(['close']);

const visible = ref(true);
const close = () => {
  visible.value = false;
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 40px);
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  margin: 0 -20px;
}
.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  width: 280px;
}
.message {
  margin-bottom: 20px;
  font-size: 15px;
}
.confirm-btn {
  background: #f97b6d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  cursor: pointer;
}
</style>
