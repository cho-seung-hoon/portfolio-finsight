<template>
  <div class="subBox">
    <div
      v-for="(item, index) in processedData"
      :key="index"
      class="subItem">
      <div class="top-row">
        <img
          class="flag"
          :src="`https://flagcdn.com/${getCountryCode(item.cur_unit)}.svg`"
          width="20"
          alt="flag" />
        <div class="cur-name">{{ item.cur_nm }} {{ item.cur_unit.replace(/\(100\)/, '') }}</div>
      </div>
      <div class="bottom-row">
        <div class="won">{{ item.deal_bas_r }}</div>
        <div class="bottom-row-in">
          <div
            v-if="item.diff !== null"
            class="upNdown"
            :class="getDiffClass(item.diff)">
            <IconUp v-if="item.diff > 0" />
            <IconDown v-if="item.diff < 0" />
          </div>
          <div
            v-if="item.percentage !== null"
            class="value"
            :class="getDiffClass(item.diff)">
            {{ Math.abs(item.diff) }} ({{ item.diff > 0 ? '+' : '' }}{{ item.percentage }}%)
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="date">
    <span>기준일:</span>
    <span>{{ displayDate }}</span>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useExchangeRateStore } from '@/stores/exchangeRate';
import IconUp from '@/components/icons/IconUp.vue';
import IconDown from '@/components/icons/IconDown.vue';

const exchangeRateStore = useExchangeRateStore();

const { processedData, displayDate } = storeToRefs(exchangeRateStore);
const { fetchExchangeData } = exchangeRateStore;

const getDiffClass = diff => {
  if (diff > 0) return 'up';
  if (diff < 0) return 'down';
  return '';
};

const getCountryCode = curUnit => {
  const mapping = {
    USD: 'us',
    EUR: 'eu',
    'JPY(100)': 'jp',
    CNH: 'cn',
    THB: 'th'
  };
  return mapping[curUnit] || 'un';
};

onMounted(() => {
  fetchExchangeData();
});
</script>

<style scoped>
.subBox {
  margin: 10px 0px;
  display: flex;
  overflow-x: auto;
}

.subBox::-webkit-scrollbar {
  display: none;
}

.subItem {
  flex-shrink: 0;
  width: 130px;
  margin-right: 8px;
  background-color: var(--white);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--main04);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.top-row {
  display: flex;
  justify-content: space-between;
}

.flag {
  border: 1px solid var(--main02);
  width: 20px;
  height: 14px;
  object-fit: cover;
}

.cur-name {
  font-size: var(--font-size-sm);
  color: var(--main02);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.bottom-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  font-size: var(--font-size-sm);
  width: 100%;
}

.bottom-row-in {
  display: flex;
}

.diff {
  font-size: var(--font-size-xs);
}

.up {
  color: var(--text-red);
}

.down {
  color: var(--text-blue);
}

.won {
  font-weight: var(--font-weight-bold);
}

.date {
  text-align: right;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--main02);
}

.upNdown {
  width: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.value-left {
}

.value-right {
  display: flex;
  align-items: center;
}

.value {
}
</style>
