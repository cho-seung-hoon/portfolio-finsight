<template>
  <div class="layout-container">
    <div class="content-container">
      <router-view v-slot="{ Component}">
        <component :is="Component"/>
      </router-view>
    </div>
    <div class="footer">
      <NavBar />
    </div>
  </div>
</template>

<script setup>
import NavBar from './NavBar.vue';
</script>

<style scoped>
.layout-container {
  display: flex;
  background-color: var(--off-white); /* 본문 배경색 */
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  margin-bottom: 60px;
  overflow-x:hidden;
}

.content-container {
  flex: 1;
  position:relative;
  padding: 0 20px;
}

.footer {
  position: fixed;
  bottom: 0;
  height: 60px;
  width: 100%;
  flex-shrink: 0;
}

.layout-container::-webkit-scrollbar {
  display: none;
}

@media (min-width: 769px) {
  .footer {
    max-width: 440px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
