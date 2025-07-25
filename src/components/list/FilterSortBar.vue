<template>
  <div class="filter-sort-bar-container">
    <div class="filter-sort-bar-filters">
      <div
        v-for="filter in filterList"
        :key="filter.key"
        class="filter-sort-bar-filter-wrap"
        style="position: relative; display: inline-block">
        <button
          class="filter-sort-bar-filter-btn"
          @click="openFilter(filter.key)">
          <span class="filter-sort-bar-filter-label">{{ filter.label }}</span>
          <span class="filter-sort-bar-filter-value">{{ selected[filter.key] }}</span>
          <IconArrowDown class="icon-arrow-down" />
        </button>
        <DropDown
          v-if="openedFilter === filter.key"
          :options="filter.options"
          :selected="selected[filter.key]"
          @select="option => selectFilterOption(filter.key, option)"
          @click-outside="openedFilter = null"
          align="left" />
      </div>
    </div>
    <div
      class="filter-sort-bar-sort"
      style="position: relative; display: inline-block"
      v-if="sortFilter">
      <span
        class="filter-sort-bar-sort-label"
        @click="openSort">
        {{ selected[sortFilter.key] }}
      </span>
      <DropDown
        v-if="openedSort"
        :options="sortFilter.options"
        :selected="selected[sortFilter.key]"
        @select="option => selectFilterOption(sortFilter.key, option)"
        @click-outside="openedSort = false"
        align="right" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconArrowDown from '@/components/icons/IconArrowDown.vue';
import DropDown from '@/components/list/DropDown.vue';

const props = defineProps({
  filters: { type: Array, default: () => [] },
  selected: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['change']);
const openedFilter = ref(null);
const openedSort = ref(false);
const sortFilter = computed(() => props.filters.find(f => f.key === 'sort'));
const filterList = computed(() => props.filters.filter(f => f.key !== 'sort'));

function openFilter(key) {
  openedSort.value = false;
  openedFilter.value = openedFilter.value === key ? null : key;
}

function openSort() {
  openedFilter.value = null;
  openedSort.value = !openedSort.value;
}

function selectFilterOption(filterKey, option) {
  emit('change', filterKey, option);
  openedFilter.value = null;
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
