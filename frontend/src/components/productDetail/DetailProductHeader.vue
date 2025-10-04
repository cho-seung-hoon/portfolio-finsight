<template>
  <div class="sell-header">
    <span
      class="chevron-left"
      @click="$emit('back')">
      &#60;
    </span>
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
:root {
  --white: #f8e3e0;
  --main01: #2c3e50;
  --main04: #ecf0f1;
  --font-size-md: 16px;
  --font-weight-bold: 700;
}

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
  user-select: none;
  transition: opacity 0.2s;
}

.chevron-left:hover {
  opacity: 0.7;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
  margin-right: 40px; /* 뒤로가기 버튼과 균형을 맞추기 위해 */
}
</style>
