<template>
  <div class="subBox">
    <div class="subItem" v-for="(item, index) in filterData" :key="index">
      <div class="subItem-title"> {{ item.cur_nm }}  {{ item.cur_unit }} </div>
      <div class="subItem-content">
        <img class="flag"
        :src="`https://flagcdn.com/${getCountryCode(item.cur_unit)}.svg`"
        width="20"
        alt="item.cur_unit">
         {{ item.deal_bas_r }} </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/api/exchangeRate.js';

const filterData = ref([]);
const getCountryCode = (curUnit) => {
  const mapping = {
    USD: 'us',
    EUR: 'eu',
    'JPY(100)': 'jp',
    CNH: 'cn',
    THB: 'th',
  };
  return mapping[curUnit] || 'un'; // 매핑되지 않은 경우 'un' (Unknown)
};

const fetchData = async () => {
  try{
    const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
    const data = await get({ 'authkey' : apiKey, 'data' : 'AP01', 'searchdate' : '20250721'});

    const targetCurrencies = ['CNH', 'EUR', 'JPY(100)', 'USD', 'THB'];
    filterData.value = data.filter(item => targetCurrencies.includes(item.cur_unit));
    console.log("test - test01");
    console.log(filterData);
  } catch (error){
    console.error("error");
  }
}

onMounted(() => {
  fetchData();
});
</script>
<style scoped>
.subBox {
  margin: 15px 0px;
  display: flex;
  overflow-x: auto;
}

.subBox::-webkit-scrollbar {
  display: none;
}
.subItem {
  flex-shrink: 0;
  width: 140px;
  margin-right: 10px;
  background-color: var(--white);
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--main04);
}

.subItem-title{
  font-size: var(--font-size-sm);
  color:var(--main02);
  font-weight: var(--font-weight-medium);
  margin: 5px 0;
}
.flag{
  border:1px solid var(--main02);
}
.subItem-content{
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 5px 0;
}
</style>