// stores/exchangeRate.js

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { get } from '@/api/exchangeRate.js';

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


export const useExchangeRateStore = defineStore('exchangeRate', () => {
  const processedData = ref([]);
  const displayDate = ref('');

  async function fetchExchangeData() {
    if (processedData.value.length > 0) {
      return;
    }

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

        return { ...todayItem, diff, percentage };
      });
      processedData.value = result;
    } catch (error) {
      console.error('환율 데이터 로드 실패:', error);
    }
  }

  return { processedData, displayDate, fetchExchangeData };
});
