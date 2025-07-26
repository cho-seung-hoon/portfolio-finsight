<template>
  <div class="fund-sell-container">
    <SellHeader
      title="예금 해지하기"
      @back="goBack" />
    <SellProductInfo
      v-if="sellStore.productInfo"
      :title="sellStore.productInfo.title"
      :price="sellStore.productInfo.amount"
      price-label="현재 예금액" />
    <SellDepositCard
      :maturity-date="formattedMaturityDate"
      :sale-date="formattedSaleDateDate" />
    <SellButton
      :loading="sellStore.isLoading"
      :disabled="sellStore.isLoading"
      label="해지하기"
      @click="onSell" />
    <SellResultMessage
      :result="sellStore.sellResult"
      type="amount" />
    <SellErrorMessage :error="sellStore.error" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSellStore } from '@/stores/sell';
import SellProductInfo from '@/components/buysell/ProductInfo.vue';
import SellButton from '@/components/buysell/SellButton.vue';
import SellResultMessage from '@/components/buysell/SellResultMessage.vue';
import SellErrorMessage from '@/components/buysell/SellErrorMessage.vue';
import SellHeader from '@/components/buysell/BuySellHeader.vue';
import SellDepositCard from '@/components/buysell/SellDepositCard.vue';

const route = useRoute();
const router = useRouter();
const sellStore = useSellStore();

const saleDate = ref('');

onMounted(() => {
  if (route.params.id) {
    sellStore.fetchProduct(route.params.id).then(() => {
      if (sellStore.productInfo && sellStore.productInfo.date) {
        saleDate.value = sellStore.productInfo.date.slice(0, 10); // 년월일만
      }
    });
  }
});

function onSell() {
  if (!sellStore.productInfo) return;
  sellStore.sellProduct({
    saleDate: saleDate.value,
    category: 'DEPOSIT',
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
  return saleDate.value.replace(/-/g, '/');
});
const formattedMaturityDate = computed(() => {
  if (!sellStore.productInfo || !sellStore.productInfo.maturityDate) return '';
  return sellStore.productInfo.maturityDate.replace(/-/g, '/');
});
</script>

<style scoped>
.fund-sell-container {
  background: var(--main05);
  border-radius: 8px;
  padding: 0 0 32px 0;
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
</style>
