<template>
  <div class="sell-header">
    <span
      class="chevron-left"
      @click="$emit('back')"
      >&#60;</span
    >
    <span class="header-title">{{ title }}</span>
  </div>
</template>

<script setup>
defineProps({
  title: String
});
defineEmits(['back']);
</script>

<style scoped>
.sell-header {
  display: flex;
  align-items: center;
  height: 56px;
  background: var(--white);
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid var(--main04);
  padding: 0 16px;
  margin-bottom: 24px;
}
.chevron-left {
  font-size: 24px;
  color: var(--main01);
  margin-right: 16px;
  cursor: pointer;
}
.header-title {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
}
</style>
