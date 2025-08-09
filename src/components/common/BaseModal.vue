<!-- BaseModal.vue -->
<template>
  <div
    v-if="visible"
    class="modal-overlay">
    <div class="modal-content">
      <div
        v-if="showIcon"
        class="check-icon">
        ✔
      </div>

      <!-- ✅ 제목 슬롯 -->
      <h3
        v-if="$slots.title"
        class="modal-title"
        :class="$attrs.class">
        <slot name="title" />
      </h3>

      <!-- ✅ 메시지 slot 방식으로 변경 -->
      <div
        class="message"
        :class="$attrs.class">
        <slot>
          {{ message }}
        </slot>
      </div>

      <hr class="divider" />

      <!-- <button
        class="confirm-btn"
        @click="handleConfirm">
        확인
      </button> -->

      <!-- ✅ 수정된 버튼 영역 -->
      <!-- 조건: showCancel이 true일 경우 → 취소/확인 두 개의 버튼 -->
      <div
        v-if="showCancel"
        class="button-group">
        <button
          class="confirm-btn"
          @click="handleConfirm">
          {{ confirmText }}
        </button>
        <button
          class="cancel-btn"
          @click="handleCancel">
          {{ cancelText }}
        </button>
      </div>

      <!-- ✅ "확인만 있는 모달"일 때는 class="confirm-only-btn" -->
      <button
        v-else
        class="confirm-only-btn"
        @click="handleConfirm">
        {{ confirmText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  visible: Boolean,
  message: {
    type: String,
    default: '완료되었습니다.'
  },
  redirect: {
    type: String,
    default: ''
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  showCancel: {
    type: Boolean,
    default: false // ✅ 기본은 "확인만 있는 모달"
  },
  confirmText: {
    type: String,
    default: '확인'
  },
  cancelText: {
    type: String,
    default: '취소'
  },
  onConfirm: Function,
  onClose: Function
});

const handleConfirm = () => {
  props.onConfirm?.();
  if (props.redirect) {
    router.push(props.redirect);
  }
};

const handleCancel = () => {
  props.onClose?.();
};
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  width: 280px;
  padding: 32px 20px 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.message.align-left {
  text-align: left;
}

.check-icon {
  font-size: 32px;
  color: #f97b6d;
  margin-bottom: 16px;
}

.message {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin-bottom: 30px;

  /* ✅ 추가: 가운데 정렬 */
  /* display: flex;
  align-items: center;
  justify-content: center; */
  height: auto; /* 또는 auto → 필요시 조정 */
  text-align: center;

  white-space: pre-line;
  line-height: 1.6;
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0 0 16px;
}

/* ✅ 새롭게 정의 */
.confirm-only-btn {
  width: 100%;
  background-color: #111e3d;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.highlight-blue {
  color: var(--text-blue);
  font-weight: bold;
}

.highlight-red {
  color: var(--text-red);
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%; /* ✅ 부모 기준 너비 지정 */
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  border-radius: 6px;
  padding: 10px 0;
  cursor: pointer;
  text-align: center;
}

.cancel-btn {
  background-color: #111e3d;
  color: #fff;
  border: none;
}

.confirm-btn {
  background-color: #ddd;
  color: #333;
  border: 1.5px solid #ccc;
}
</style>
