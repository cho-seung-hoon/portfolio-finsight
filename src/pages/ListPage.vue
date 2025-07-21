<template>
  <ListTab />
  <div class="page-content">
    <div v-if="category === 'deposits'">예금 리스트</div>
    <div v-else-if="category === 'fund'">펀드 리스트</div>
    <div v-else-if="category === 'etf'">ETF 리스트</div>
    <div v-else>존재하지 않는 카테고리입니다.</div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import ListTab from '@/components/list/ListTab.vue';

const route = useRoute();
const category = computed(() => route.params.category);
</script>

<style scoped>
.page-content {
  width: 100%;
  height: 2000px;
  padding: 20px;
}
</style>
