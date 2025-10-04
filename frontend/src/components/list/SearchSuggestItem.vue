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
  productName: String,
  searchWord: String
});

const router = useRouter();

const highlightedName = computed(() => {
  if (!props.searchWord) return props.productName;

  const escaped = props.searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');

  return props.productName.replace(regex, '<span class="highlight">$1</span>');
});

function handleSuggestClick() {
  router.push({ path: '/search/result', query: { query: props.productName } });
}
</script>

<style scoped>
.search-suggest-item-container {
  display: flex;
  width: 100%;
  border-bottom: 1px solid var(--main04);
  padding: 16px 28px;
  cursor: pointer;
  align-items: center;
}

.search-suggest-item-name {
  font-size: var(--font-size-md);
  color: var(--main01);
  font-weight: var(--font-weight-medium);
}

:deep(.highlight) {
  color: var(--sub01);
  font-weight: bold;
}
</style>
