<template>
  <div class="filter-sort-bar-container">
    <div
      class="filter-sort-bar-filters"
      v-if="showFilters">
      <div
        v-for="filter in filters"
        :key="filter.key"
        class="filter-sort-bar-filter-wrap"
        style="position: relative; display: inline-block">
        <button
          class="filter-sort-bar-filter-btn"
          @click="openFilter(filter.key)">
          <span class="filter-sort-bar-filter-label">{{ filter.label }}</span>
          <span class="filter-sort-bar-filter-value">{{ filter.selectedOption }}</span>
          <IconArrowDown class="icon-arrow-down" />
        </button>
        <DropDown
          v-if="openedFilter === filter.key"
          :options="filter.options"
          :selected="filter.selectedOption"
          @select="option => selectFilterOption(filter.key, option)"
          align="left" />
      </div>
    </div>
    <div
      class="filter-sort-bar-sort"
      style="position: relative; display: inline-block">
      <span
        class="filter-sort-bar-sort-label"
        @click="openSort">
        {{ selectedSort.label }}
      </span>
      <DropDown
        v-if="openedSort"
        :options="sortOptions.map(opt => opt.label)"
        @select="selectSortOption"
        :selected="selectedSort.label"
        align="right" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IconArrowDown from '@/components/icons/IconArrowDown.vue';
import DropDown from '@/components/list/DropDown.vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  filters: { type: Array, default: () => [] },
  showFilters: { type: Boolean, default: true },
  sortOptions: { type: Array, default: () => [] },
  selectedSort: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['filter-select', 'sort-select']);

const openedFilter = ref(null);
const openedSort = ref(false);

function openFilter(key) {
  openedSort.value = false;
  openedFilter.value = openedFilter.value === key ? null : key;
}

function selectFilterOption(filterKey, option) {
  emit('filter-select', { filterKey, option });
  openedFilter.value = null;
}

function openSort() {
  openedFilter.value = null;
  openedSort.value = !openedSort.value;
}

function selectSortOption(optionLabel) {
  const selected = props.sortOptions.find(opt => opt.label === optionLabel);
  if (selected) emit('sort-select', selected);
  openedSort.value = false;
}
</script>

<style scoped>
.filter-sort-bar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.filter-sort-bar-filters {
  display: flex;
  gap: 8px;
}

.filter-sort-bar-filter-wrap {
  position: relative;
}

.filter-sort-bar-filter-btn {
  background: var(--main01);
  border-radius: 8px;
  padding: 8px 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.filter-sort-bar-filter-label {
  color: var(--main04);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-md);
}

.filter-sort-bar-filter-value {
  color: var(--white);
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-md);
}

.icon-arrow-down {
  width: 16px;
  height: 16px;
}

.filter-sort-bar-sort {
  color: var(--main01);
  font-size: var(--font-size-ms);
  margin-left: auto;
  cursor: pointer;
}
</style>
