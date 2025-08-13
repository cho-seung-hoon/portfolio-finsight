<!-- src\components\common\SessionExpireModal.vue -->
<template>
  <div
    v-if="visible"
    class="modal-overlay"
    @keydown.esc="emitClose">
    <div
      class="modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expire-title">
      <h3
        id="expire-title"
        class="modal-title">
        세션 만료 안내
      </h3>

      <div class="message">
        <template v-if="mode === 'countdown'">
          세션이 곧 만료됩니다.<br />
          남은 시간: <strong>{{ remainingTime }}</strong
          ><br />
          연장하시겠습니까?
        </template>
        <template v-else> 세션이 만료되어<br />자동 로그아웃 되었습니다. </template>
      </div>

      <hr class="divider" />

      <div
        class="button-group"
        v-if="mode === 'countdown'">
        <button
          class="cancel-btn"
          type="button"
          @click="emitLogout">
          로그아웃
        </button>
        <button
          class="confirm-btn"
          type="button"
          @click="emitExtend">
          연장
        </button>
      </div>

      <button
        v-else
        class="confirm-only-btn"
        type="button"
        @click="emitClose">
        확인
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  remainingTime: { type: String, default: '00:00' },
  mode: { type: String, default: 'countdown' } // 🔹 'countdown' | 'expired'
});
const emit = defineEmits(['extend', 'logout', 'close']);

const emitExtend = () => emit('extend');
const emitLogout = () => emit('logout');
const emitClose = () => emit('close');
</script>

<style scoped>
/* 세션 만료 모달 오버레이 */
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

/* 모달 컨텐츠 박스 */
.modal-content {
  width: 280px;
  padding: 32px 20px 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* 모달 제목 */
.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

/* 왼쪽 정렬 메시지 */
.message.align-left {
  text-align: left;
}

/* 체크 아이콘 */
.check-icon {
  font-size: 32px;
  color: #f97b6d;
  margin-bottom: 16px;
}

/* 메시지 본문 */
.message {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin-bottom: 30px;
  height: auto;
  text-align: center;
  white-space: pre-line;
  line-height: 1.6;
}

/* 구분선 */
.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0 0 16px;
}

/* 확인 버튼(단일) */
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

/* 텍스트 강조 */
.highlight-blue {
  color: var(--text-blue);
  font-weight: bold;
}
.highlight-red {
  color: var(--text-red);
  font-weight: bold;
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

/* 취소, 확인 버튼 스타일 */
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

/* 취소 버튼 */
.cancel-btn {
  background-color: #ddd;
  color: #333;
  border: 1.5px solid #ccc;
}

/* 확인 버튼 */
.confirm-btn {
  background-color: #111e3d;
  color: #fff;
  border: none;
}
</style>
