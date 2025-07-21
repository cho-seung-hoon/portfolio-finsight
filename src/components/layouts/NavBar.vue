<template>
  <div class="container">
    <router-link
      class="nav-item"
      v-for="item in config.menus"
      :key="item.name"
      :to="item.path">
      <component
        :is="item.icon"
        class="icon" />
      <span class="label">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script setup>
import config from '@/config';
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: var(--main05);
  border-top: 1px solid var(--main03);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  text-decoration: none;
  color: var(--main03);
  font-size: var(--font-size-sm);
}

.icon {
  width: var(--font-size-xxl);
  height: var(--font-size-xxl);
  margin-bottom: 2px;
}

.router-link-exact-active {
  color: var(--main01);
  font-weight: var(--font-weight-medium);
}
</style>
