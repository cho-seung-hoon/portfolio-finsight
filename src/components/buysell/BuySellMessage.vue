<template>
  <div
    v-if="error || success"
    class="message">
    <p
      v-if="error"
      style="color: red">
      에러: {{ error }}
    </p>
    <p
      v-else-if="success"
      style="color: green">
      성공: {{ success }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  error: String,
  success: String
});
</script>

<style scoped>
.message {
  margin-top: 16px;
  text-align: center;
}
</style>
