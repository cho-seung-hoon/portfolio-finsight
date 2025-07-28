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
  white-space: pre-line; /* ✅ \n 줄바꿈 허용 */
  word-break: keep-all; /* ✅ 단어 단위로 줄바꿈 */
  line-height: 1.4;
}
</style>
<!-- ValidationMessage.vue -->
<!-- <template>
  <p class="msg">
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
  white-space: pre-line;
  word-break: keep-all;
  line-height: 1.4;

  /* ✅ 항상 일정한 높이 확보 */
  min-height: 18px;
}
</style> -->
