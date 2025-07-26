<template>
  <div
    class="search-suggest-item-container"
    @click="handleSuggestClick">
    <span
      class="search-suggest-item-name"
      v-html="highlightedName"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  productName: String
});

const router = useRouter();

// TODO: 사용자 입력에 따라 바꿔주기
const highlightedName = computed(() =>
  props.productName.replace(/삼/g, '<span class="highlight">삼</span>')
);

function handleSuggestClick() {
  router.push({ path: '/search/result', query: { query: props.productName } });
}
</script>

<style scoped>
.search-suggest-item-container {
  display: flex;
  width: 100%;
  border-bottom: 1px solid var(--main04);
  padding: 16px;
  cursor: pointer;
  align-items: center;
}

.search-suggest-item-name {
  font-size: var(--font-size-md);
  color: var(--main01);
  font-weight: var(--font-weight-medium);
}

::v-deep(.highlight) {
  color: var(--sub01);
  font-weight: bold;
}
</style>
