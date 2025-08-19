<template>
  <dialog
    ref="modalRef"
    class="modal"
    @click="handleBackdropClick">
    <div
      class="modal-content"
      @click.stop>
      <div class="modal-header">
        <h2>{{ term.title }}</h2>
        <button
          class="close-btn"
          @click="closeModal">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <div
          v-if="term.pdfUrl"
          class="pdf-viewer">
          <iframe
            :src="term.pdfUrl"
            width="100%"
            height="100%"
            frameborder="0"
            title="약관 PDF">
          </iframe>
        </div>
        <div
          v-else
          class="term-content">
          {{ term.content }}
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-primary"
          @click="closeModal">
          확인
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  term: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const modalRef = ref(null);
const isClosing = ref(false);

const openModal = () => {
  if (modalRef.value) {
    modalRef.value.show();
  }
};

const closeModal = () => {
  if (isClosing.value) return;

  isClosing.value = true;

  if (modalRef.value) {
    modalRef.value.close();
  }
  emit('close');

  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

const handleBackdropClick = event => {
  if (event.target === modalRef.value) {
    closeModal();
  }
};

defineExpose({
  openModal,
  closeModal
});
</script>

<style scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  border-radius:0;
}

.modal-content {
  background: var(--white);
  width: calc(100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px 16px;
  border-bottom: 1px solid var(--main04);
  background: var(--main01);
  flex-shrink: 0;
  min-height: 60px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  border-radius: 0;
}



.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--white);
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-xxl);
  color: var(--white);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--sub01);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  word-wrap: break-word;
  word-break: break-word;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
  max-width: 100%;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}


.term-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--main01);
  white-space: pre-line;
  overflow-x: hidden;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  min-height: 0;
  box-sizing: border-box;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.pdf-viewer iframe {
  border: none;
  width: 100%;
  height: 100%;
  max-width: 100%;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid var(--main04);
  flex-shrink: 0;
  min-height: 60px;
  margin: 0;
  width: calc(100%);
  box-sizing: border-box;
  background: var(--white);
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-radius:0;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--sub01);
  color: var(--white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--main01);
}

.btn-primary:disabled {
  background: var(--main04);
  color: var(--main02);
  cursor: not-allowed;
}
</style>
