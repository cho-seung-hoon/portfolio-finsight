<template>
  <div class="list-etf-page-container">
    <EtfItem></EtfItem>
    <EtfItem></EtfItem>
    <EtfItem></EtfItem>
    <EtfItem></EtfItem>
  </div>
</template>

<script setup>
import EtfItem from '@/components/list/EtfItem.vue';
</script>

<style scoped>
.list-etf-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}
</style>
