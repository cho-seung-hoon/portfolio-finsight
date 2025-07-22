<template>
  <div class="list-deposit-page-container">
    <DepositsItem></DepositsItem>
    <DepositsItem></DepositsItem>
    <DepositsItem></DepositsItem>
    <DepositsItem></DepositsItem>
  </div>
</template>

<script setup>
import DepositsItem from '@/components/list/DepositsItem.vue';
</script>

<style scoped>
.list-deposit-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}
</style>
