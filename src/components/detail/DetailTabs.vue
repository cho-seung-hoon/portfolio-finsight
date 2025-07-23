<template>
  <div class="tabs">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      class="tab"
      :class="{ active: selectedTab === tab.key }"
      @click="$emit('update:selectedTab', tab.key)"
    >
      {{ tab.label }}
    </div>
    <div
      class="tab-indicator"
      :style="indicatorStyle"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  tabs: Array, // [{ key, label }]
  selectedTab: String,
});
const emit = defineEmits(['update:selectedTab']);

const indicatorStyle = computed(() => {
  const idx = props.tabs.findIndex(tab => tab.key === props.selectedTab);
  const width = 100 / props.tabs.length;
  return {
    left: `calc(${width * idx}% )`,
    width: `calc(${width}% )`
  };
});
</script>

<style scoped>
.tabs {
  background: var(--main05);
  border-bottom: 1px solid var(--main04);
  display: flex;
  align-items: center;
  position: relative;
  height: 62px;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}
.tab {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: var(--main02);
  padding: 20px 0 16px 0;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
  z-index: 1;
}
.tab.active {
  color: var(--main01);
  font-weight: 700;
}
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: var(--main01);
  border-radius: 2px;
  transition: left 0.3s, width 0.3s;
  z-index: 2;
}
</style> 