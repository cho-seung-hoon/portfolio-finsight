<template>
  <div
    v-if="error"
    class="error-message">
    <p style="color: red">에러: {{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  error: String
});
</script>

<style scoped>
.error-message {
  margin-top: 16px;
  text-align: center;
}
</style>
