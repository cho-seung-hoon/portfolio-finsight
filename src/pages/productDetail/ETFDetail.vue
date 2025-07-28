<template>
  <DetailProductHeader
    title="내 ETF 상품 현황"
    @back="goBack" />
  <DetailProductInfo />
</template>
<script setup>
import DetailProductHeader from '@/components/productDetail/DetailProductHeader.vue';
import DetailProductInfo from '@/components/productDetail/DetailProductInfo.vue';
</script>
<scope scope></scope>
