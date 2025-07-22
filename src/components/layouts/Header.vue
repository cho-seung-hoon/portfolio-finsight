<template>
  <div class="container" :class="{'no-border' : !showBorder}">
     <button class="backButton" v-if="headerStore.showBackButton" @click="goBack">
       <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5 9L13.5 18L22.5 27" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
     </button>
    <div class="title">
      <span
        v-for="(part, index) in headerStore.titleParts"
        :key="index"
        :style="{ color: part.color }">
        {{ part.text }}
      </span>
    </div>
    <div class="actions" v-if="headerStore.actions.length > 0">
      <div v-for="(action, index) in headerStore.actions"
           :key="index"
           @click="action.handler">
        <component :is="iconComponents[action.icon]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHeaderStore } from '@/stores/header';
import { useRouter } from 'vue-router';
import IconSearch from '@/components/icons/IconSearch.vue';
import IconWatch from '@/components/icons/IconWatch.vue';


const router = useRouter();
const headerStore = useHeaderStore();

const showBorder = computed(()=> headerStore.showBorder);

const goBack = () => router.back();

const iconComponents = {
  search: IconSearch,
  watch: IconWatch,
};
</script>

<style scoped>

.container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: var(--main05);
  border-bottom: 1px solid var(--main03);
}

.container.no-border{
  border-bottom: none;
}
.backButton{
  all:unset;
  display: flex;
  align-items: center;
}
.title {
  min-width: 0px;
  flex: 1;
  padding: 0 20px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  align-content: center;
}

.actions{
  margin:0 10px;
  display: flex;
  align-items: center;
  gap:12px;
}
</style>
