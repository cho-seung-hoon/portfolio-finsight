<template>
  <div class="list-search-page-container">
    <input
      type="text"
      v-model="search"
      placeholder="상품을 입력하세요"
      class="list-search-page-input" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const search = ref('');

</script>

<style scoped>
.list-search-page-container {
  padding: 24px 16px;
}

.list-search-page-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--main03);
  border-radius: 12px;
  font-size: var(--font-size-md);
  outline: none;
}
</style>
