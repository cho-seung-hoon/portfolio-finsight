<template>
  <p
    v-if="message"
    class="msg">
    {{ message }}
  </p>
</template>

<script setup>
defineProps({ message: String });
</script>

<style scoped>
.msg {
  font-size: 12px;
  color: #f97b6d;
  margin-top: 4px;
  margin-left: 4px;
}
</style>
