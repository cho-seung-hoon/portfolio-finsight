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
        <!-- PDF 뷰어 -->
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
        <!-- 텍스트 내용 -->
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

// 모달 열기
const openModal = () => {
  if (modalRef.value) {
    modalRef.value.showModal();
    // 모바일에서 body 스크롤 방지
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }
};

// 모달 닫기
const closeModal = () => {
  if (isClosing.value) return;

  isClosing.value = true;

  if (modalRef.value) {
    modalRef.value.close();
  }
  // body 스크롤 복원
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  emit('close');

  // 100ms 후에 닫기 상태 초기화
  setTimeout(() => {
    isClosing.value = false;
  }, 100);
};

// 배경 클릭 처리
const handleBackdropClick = event => {
  if (event.target === modalRef.value) {
    closeModal();
  }
};

// 외부에서 모달 열기 메서드 노출
defineExpose({
  openModal,
  closeModal
});
</script>

<style scoped>
.modal {
  border: none;
  border-radius: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  overflow: hidden;
  max-width: 100vw;
  max-height: 100vh;
  overscroll-behavior: contain;
}

.modal::backdrop {
  background: #000000;
}

.modal-content {
  background: var(--white);
  border-radius: 0;
  width: calc(100% - 32px);
  height: 100%;
  max-width: 408px;
  box-shadow: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: calc(100vw - 32px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px 16px;
  border-bottom: 1px solid var(--main04);
  background: var(--main01);
  border-radius: 0;
  flex-shrink: 0;
  min-height: 60px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .modal-header {
    padding: 24px 24px 16px 24px;
  }
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
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
  padding-bottom: 80px; /* 푸터 높이만큼 패딩 추가 */
  max-width: 100%;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 768px) {
  .modal-body {
    padding: 24px;
  }

  .modal-footer {
    padding: 24px;
  }
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
  border-radius: 0;
  flex-shrink: 0;
  min-height: 60px;
  margin: 0;
  width: calc(100% - 32px);
  max-width: 408px;
  box-sizing: border-box;
  background: var(--white);
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
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
