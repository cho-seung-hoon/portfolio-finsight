<template>
  <div class="layout-container">
    <div class="content-container">
      <router-view v-slot="{ Component}">
        <component :is="Component"/>
      </router-view>
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
  overflow-x:hidden;
}

.content-container {
  flex: 1;
  position:relative;
  padding: 0 20px;
}

.layout-container::-webkit-scrollbar {
  display: none;
}

</style>
