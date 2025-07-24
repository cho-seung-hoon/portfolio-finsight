<template>
  <div class="layout-container">
    <div class="header">
      <Header />
    </div>
    <div class="content-container">
      <slot></slot>
    </div>

    <div class="footer">
      <NavBar />
    </div>
  </div>
</template>

<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
</script>

<style scoped>
.layout-container {
  display: flex;
  background-color: var(--off-white); /* 본문 배경색 */
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.header {
  height: 56px;
  flex-shrink: 0;
}

.content-container {
  flex: 1;
  position: relative;
  padding: 0px 20px 120px 20px;
}

.footer {
  position: fixed;
  bottom: 0;
  height: 60px;
  width: 100%;
  flex-shrink: 0;
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

@media (min-width: 769px) {
  .footer {
    max-width: 440px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
