<template>
  <div class="subBox2">
    <div class="action">회원탈퇴</div>
    <div class="verticalLine"></div>
    <div class="action">로그아웃</div>
  </div>
</template>

<script setup></script>
<style scoped>
.subBox2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center; /* 중앙 정렬 */
  gap: 16px; /* 요소 간 간격 */
}

.action {
  font-size: var(--font-size-sm);
  color: var(--main02); /* 원하는 색상 */
  cursor: pointer;
}

.verticalLine {
  width: 3px;
  height: 16px;
  margin: 0 50px;
  background-color: var(--main03); /* 구분선 색상 */
}
</style>
