<template>
  <div class="container">
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
.container {
  width: 100%;
  background-color: pink;
}
</style>
