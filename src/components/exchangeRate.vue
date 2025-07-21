<template>
  <div class="subtitle">현재 환율</div>

  <div class="subBox">
    <div class="subItem" v-for="(item, index) in filterData" :key="index">
      <div class="subItem-title"> {{ item.cur_nm }}  {{ item.cur_unit }} </div>
      <div class="subItem-content"> {{ item.deal_bas_r }} </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '@/api/exchangeRate.js';

const filterData = ref([]);

const fetchData = async () => {
  try{
    const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
    const data = await get({ 'authkey' : apiKey, 'data' : 'AP01'});

    const targetCurrencies = ['CNH', 'EUR', 'JPY(100)', 'USD', 'THB'];
    filterData.value = data.filter(item => targetCurrencies.includes(item.cur_unit));

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
.subtitle {
  margin: 15px 0px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
}
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
  margin: 5px 0;
}

.subItem-content{
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 5px 0;
}
</style>