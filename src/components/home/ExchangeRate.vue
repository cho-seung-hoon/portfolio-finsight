<template>
  <div class="subBox">
    <div
      v-for="(item, index) in filterData"
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
        <div class="value-left">
          <span class="won">{{ item.deal_bas_r }}</span>
        </div>
        <div class="value-right">
          <span
            v-if="item.diff !== null"
            class="upNdown"
            :class="getDiffClass(item.diff)">
            <IconUp v-if="item.diff > 0" />
            <IconDown v-if="item.diff < 0" />
          </span>
          <span
            v-if="item.percentage !== null"
            class="value"
            :class="getDiffClass(item.diff)"
            >{{ Math.abs(item.diff) }} ({{ item.diff > 0 ? '+' : '' }}{{ item.percentage }}%)</span
          >
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
import { ref, onMounted } from 'vue';
import { get } from '@/api/exchangeRate.js';
import IconUp from '@/components/icons/IconUp.vue';
import IconDown from '@/components/icons/IconDown.vue';

const filterData = ref([]);
const displayDate = ref('');

const getDiffClass = diff => {
  if (diff > 0) return 'up';
  if (diff < 0) return 'down';
  return '';
};

// --- 이하 로직은 기존과 동일합니다 ---
const holidays = [
  '2025-01-01',
  '2025-03-01',
  '2025-05-05',
  '2025-06-06',
  '2025-08-15',
  '2025-09-12',
  '2025-09-13',
  '2025-09-14',
  '2025-10-03',
  '2025-10-09',
  '2025-12-25'
];
const isWeekend = date => [0, 6].includes(date.getDay());
const isHoliday = date => holidays.includes(date.toISOString().split('T')[0]);
const isNonWorkingDay = date => isWeekend(date) || isHoliday(date);
const getPreviousWorkingDay = date => {
  const newDate = new Date(date);
  while (isNonWorkingDay(newDate)) {
    newDate.setDate(newDate.getDate() - 1);
  }
  return newDate;
};
const getBaseDate = () => {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(11, 0, 0, 0);
  const base = new Date(now);
  if (now < cutoff) {
    base.setDate(base.getDate() - 1);
  }
  return getPreviousWorkingDay(base);
};
const getPreviousDate = baseDate => {
  const prev = new Date(baseDate);
  prev.setDate(prev.getDate() - 1);
  return getPreviousWorkingDay(prev);
};
const formatDate = date => date.toISOString().split('T')[0].replace(/-/g, '');
const formatDisplayDate = date => date.toISOString().split('T')[0].replace(/-/g, '.');
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

const fetchData = async () => {
  try {
    const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;

    const todayDate = getBaseDate();
    const yestDate = getPreviousDate(todayDate);
    displayDate.value = formatDisplayDate(todayDate);

    const todayStr = formatDate(todayDate);
    const yestStr = formatDate(yestDate);

    const [todayData, yestData] = await Promise.all([
      get({ authkey: apiKey, data: 'AP01', searchdate: todayStr }),
      get({ authkey: apiKey, data: 'AP01', searchdate: yestStr })
    ]);

    const targetCurrencies = ['CNH', 'EUR', 'JPY(100)', 'USD', 'THB'];

    const todayFiltered = todayData.filter(item => targetCurrencies.includes(item.cur_unit));
    const yestFiltered = yestData.filter(item => targetCurrencies.includes(item.cur_unit));

    const result = todayFiltered.map(todayItem => {
      const yestItem = yestFiltered.find(item => item.cur_unit === todayItem.cur_unit);

      const todayRate = parseFloat(todayItem.deal_bas_r.replace(',', ''));
      const yestRate = yestItem ? parseFloat(yestItem.deal_bas_r.replace(',', '')) : null;

      let diff = null;
      let percentage = null;

      if (yestRate !== null && yestRate !== 0) {
        diff = (todayRate - yestRate).toFixed(2);
        percentage = (((todayRate - yestRate) / yestRate) * 100).toFixed(2);
      }

      return {
        ...todayItem,
        diff,
        percentage
      };
    });

    filterData.value = result;
  } catch (error) {
    console.error('환율 데이터 로드 실패:', error);
  }
};

onMounted(() => {
  fetchData();
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
  width: 165px;
  margin-right: 8px;
  background-color: var(--white);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--main04);
  display: flex;
  flex-direction: column;
  gap:5px;

}
.top-row {
  display: flex;
  align-items: center;
  gap: 6px;
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
  align-items: center;
  justify-content: space-between;
  gap: 1px;
  font-size: var(--font-size-sm);
  width: 100%;
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
.value{

}
</style>
