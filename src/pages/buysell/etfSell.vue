<template>
  <div class="fund-sell-container">
    <SellHeader
      title="ETF 매도하기"
      @back="goBack" />
    <SellProductInfo
      v-if="sellStore.productInfo"
      :title="sellStore.productInfo.title"
      :price="sellStore.productInfo.price"
      price-label="현재 1좌당" />
    <SellEtfFundCard
      v-if="sellStore.productInfo"
      :holding-quantity="sellStore.productInfo.holdingQuantity"
      :quantity="quantity"
      :max-quantity="sellStore.productInfo.holdingQuantity"
      :sale-date="formattedSaleDateDate"
      :sale-date-time="formattedSaleDateTime"
      :disabled="sellStore.isLoading"
      @update:quantity="val => (quantity.value = val)" />
    <SellButton
      :loading="sellStore.isLoading"
      :disabled="!quantity"
      label="입력 완료"
      @click="onSell" />
    <SellResultMessage
      :result="sellStore.sellResult"
      type="quantity" />
    <SellErrorMessage :error="sellStore.error" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSellStore } from '@/stores/sell';
import SellEtfFundCard from '@/components/buysell/SellEtfFundCard.vue';
import SellButton from '@/components/buysell/SellButton.vue';
import SellResultMessage from '@/components/buysell/SellResultMessage.vue';
import SellErrorMessage from '@/components/buysell/SellErrorMessage.vue';
import SellHeader from '@/components/buysell/BuySellHeader.vue';
import SellProductInfo from '@/components/buysell/ProductInfo.vue';

const route = useRoute();
const router = useRouter();
const sellStore = useSellStore();

const quantity = ref(1);
const saleDate = ref('');

onMounted(() => {
  if (route.params.id) {
    sellStore.fetchProduct(route.params.id).then(() => {
      if (sellStore.productInfo && sellStore.productInfo.date) {
        saleDate.value = sellStore.productInfo.date.slice(0, 16);
      }
    });
  }
});

function onSell() {
  if (!sellStore.productInfo) return;
  sellStore.sellProduct({
    quantity: quantity.value,
    price: sellStore.productInfo.price,
    saleDate: saleDate.value,
    category: 'ETF',
    code: sellStore.productInfo.code
  });
}

function goBack() {
  router.back();
}

watch(
  () => sellStore.sellResult,
  val => {
    if (val) setTimeout(() => router.back(), 1000);
  }
);

const formattedSaleDateDate = computed(() => {
  if (!saleDate.value) return '';
  const date = new Date(saleDate.value);
  if (isNaN(date.getTime())) return '';
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
});
const formattedSaleDateTime = computed(() => {
  if (!saleDate.value) return '';
  const date = new Date(saleDate.value);
  if (isNaN(date.getTime())) return '';
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(date.getHours())} : ${pad(date.getMinutes())} : ${pad(date.getSeconds())}`;
});
</script>

<style scoped>
.fund-sell-container {
  background: var(--main05);
  border-radius: 8px;
  padding: 0 0 32px 0;
}

.header {
  display: flex;
  align-items: center;
  height: 56px;
  background: var(--white);
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid var(--main04);
  padding: 0 16px;
  margin-bottom: 24px;
}

.chevron-left {
  font-size: 24px;
  color: var(--main01);
  margin-right: 16px;
  cursor: pointer;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
}

.fund-info-card {
  background: var(--main01);
  border-radius: 8px;
  padding: 22px 28px 16px 28px;
  margin: 0 20px 24px 20px;
}

.fund-title {
  color: var(--main05);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 8px;
}

.fund-desc {
  color: var(--main05);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
}

.sell-info-card {
  background: var(--white);
  border: 1px solid var(--main04);
  border-radius: 8px;
  margin: 0 20px 32px 20px;
  padding: 24px 28px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-label {
  color: var(--main02);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  flex: 1;
  text-align: left;
}

.info-value {
  color: var(--main01);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  flex: 1;
  text-align: right;
}

.info-value-input {
  width: 100px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--main01);
  border: 1px solid var(--main04);
  border-radius: 4px;
  padding: 4px 8px;
  text-align: right;
}

.submit-btn {
  width: 400px;
  height: 70px;
  background: var(--sub01);
  color: var(--white);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.result-message {
  margin-top: 24px;
  background: var(--main04);
  border-radius: 8px;
  padding: 16px;
  color: var(--main01);
  font-size: var(--font-size-md);
  text-align: center;
}
.error-message {
  margin-top: 16px;
  text-align: center;
}
</style>
