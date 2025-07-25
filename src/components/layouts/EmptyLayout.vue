<template>
  <div class="layout-container">
    <div class="content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.layout-container {
  display: flex;
  background-color: var(--off-white); /* 본문 배경색 */
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}


.content-container {
  flex: 1;
  position:relative;
}


/* 스크롤바 커스터마이징 */
.layout-container::-webkit-scrollbar {
  width: 8px;
}

.layout-container::-webkit-scrollbar-track {
  background-color: var(--off-white); /* 본문 배경색 */
}

.layout-container::-webkit-scrollbar-thumb {
  background-color: var(--main03);
  border-radius: 6px;
  border: 2px solid var(--off-white);
}

.layout-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--sub01);
}

</style>
