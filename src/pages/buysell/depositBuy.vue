<template>
  <div class="fund-sell-container">
    <BuySellHeader
      title="예금 등록"
      @back="goBack" />
    <ProductInfo
      :title="buyStore.productInfo?.title"
      :price="buyStore.productInfo?.amount"
      price-label="예금액" />
    <DepositBuyCard
      :period="period"
      :start-date="buyStore.productInfo?.date"
      :amount="amount"
      @update:period="val => (period.value = val)"
      @update:amount="val => (amount.value = val)" />
    <BuyButton
      :loading="buyStore.isLoading"
      :disabled="buyStore.isLoading"
      label="입력 완료"
      @click="onBuy" />
    <BuySellMessage
      :error="buyStore.error"
      :success="buyStore.buyResult?.message" />
    
  </div>
</template>

<script setup>
import BuySellHeader from '@/components/buysell/BuySellHeader.vue';
import ProductInfo from '@/components/buysell/ProductInfo.vue';
import DepositBuyCard from '@/components/buysell/DepositBuyCard.vue';
import BuyButton from '@/components/buysell/BuyButton.vue';
import BuySellMessage from '@/components/buysell/BuySellMessage.vue';
import AgreememtModal from './AgreememtModal.vue';
import { ref, onMounted } from 'vue';
import { useBuyStore } from '@/stores/buy';
import { useRoute, useRouter } from 'vue-router';

const buyStore = useBuyStore();
const route = useRoute();
const router = useRouter();

const period = ref('12');
const amount = ref(100000);

onMounted(() => {
  if (route.params.id) {
    buyStore.fetchProduct(route.params.id);
  }
});

function goBack() {
  router.back();
}
async function onBuy() {
  await buyStore.buyProduct({
    period: period.value,
    amount: amount.value,
    code: buyStore.productInfo?.code
  });
  if (buyStore.buyResult && buyStore.buyResult.message) {
    setTimeout(() => router.back(), 1000);
  }
}
</script>

<style scoped>
.fund-sell-container {
  background: var(--main05);
  border-radius: 8px;
  padding: 0 0 32px 0;
}
</style>
