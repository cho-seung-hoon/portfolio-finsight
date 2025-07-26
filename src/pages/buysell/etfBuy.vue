<template>
  <div class="fund-sell-container">
    <BuySellHeader
      title="ETF 매수"
      @back="goBack" />
    <ProductInfo
      :title="title"
      :price="price"
      price-label="현재 1좌당" />
    <EtfFundBuyCard
      :title="title"
      :quantity="quantity"
      :buy-date="buyDate" />
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
import EtfFundBuyCard from '@/components/buysell/EtfFundBuyCard.vue';
import BuyButton from '@/components/buysell/BuyButton.vue';
import BuySellMessage from '@/components/buysell/BuySellMessage.vue';
import { useBuyStore } from '@/stores/buy';
import { useRouter } from 'vue-router';

// mock 데이터 예시
const title = 'TIGER 미국나스닥100 ETF 선물';
const price = 10000;
const quantity = 123;
const buyDate = '2025.07.12';

const buyStore = useBuyStore();
const router = useRouter();

function goBack() {
  router.back();
}
async function onBuy() {
  await buyStore.buyProduct({
    // 필요한 payload 값 전달 (예시)
    quantity,
    code: 'etf-001'
    // 기타 필요한 값 추가
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
