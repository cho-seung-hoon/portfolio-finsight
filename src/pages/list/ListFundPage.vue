<template>
  <div class="list-fund-page-container">
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
.list-fund-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}
</style>
