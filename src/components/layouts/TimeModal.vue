<template>
  <div
    class="modal-backdrop"
    @click.self="$emit('close')">
    <div class="modal-content">
      <h2>시간 설정 모달</h2>
      <p>이곳에 원하시는 내용을 채워 넣을 수 있습니다.</p>

      <button @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script setup>
// 이 컴포넌트가 'close'라는 이벤트를 부모에게 보낼 수 있다고 정의합니다.
defineEmits(['close']);
</script>

<style scoped>
.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

button {
  margin-top: 16px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
