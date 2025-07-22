<template>
  <div class="container">
    <FundItem></FundItem>
    <FundItem></FundItem>
    <FundItem></FundItem>
    <FundItem></FundItem>
    <FundItem></FundItem>
  </div>
</template>

<script setup>
import FundItem from '@/components/list/FundItem.vue';
</script>

<style scoped>
.container {
  width: 100%;
  background-color: pink;
}
</style>
