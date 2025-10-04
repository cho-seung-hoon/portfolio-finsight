<template>
  <div class="subBox">
    <div class="subItem-title">
      <span
        class="keyword"
        :style="{ color: props.color }"
        >{{ props.keyword }}</span
      >
      <span> 관련 투자 상품</span>
    </div>

    <div class="filter">
      <button
        :class="{ active: selectCategory === 'fund' }"
        @click="selectFilter('fund')">
        펀드
      </button>
      <button
        :class="{ active: selectCategory === 'etf' }"
        @click="selectFilter('etf')">
        ETF
      </button>
    </div>
    <div
      v-if="reactiveProducts.length > 0"
      class="product-list">
      <div v-if="selectCategory === 'etf'">
        <EtfItem
          class="productItem"
          v-for="item in reactiveProducts"
          :key="item.product_code"
          :item="item" />
      </div>
      <div v-else>
        <FundItem
          class="productItem"
          v-for="fund in reactiveProducts"
          :key="fund.product_code"
          :item="fund" />
      </div>
    </div>
    <div
      v-else
      class="no-products">
      관련된 상품이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount  } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';
import EtfItem from '@/components/list/EtfItem.vue';
import FundItem from '@/components/list/FundItem.vue';

const props = defineProps({
  keyword: String,
  color: String,
  fundList: Array, // 펀드 리스트
  etfList: Array   // ETF 리스트
});

const selectCategory = ref('fund'); // 기본값

function selectFilter(category) {
  selectCategory.value = category;
}

const filterProduct = computed(() => {
  if (selectCategory.value === 'fund') {
    return props.fundList;
  } else {
    return props.etfList;
  }
});

const ws = useWebSocketStore();
const subscribedCodes = ref(new Set()); // 현재 구독 중인 코드 Set
const indexByCode = ref(new Map()); // 빠른 조회를 위한 Map
const reactiveProducts = ref([]); // 실시간 업데이트를 반영할 반응형 데이터

function handleTick(payload) {
  console.log('📨 SOCKET MSG RECEIVED:', payload);
  const code = payload?.productCode;
  const idx = indexByCode.value.get(code);
  if (idx === undefined) return;

  const cur = reactiveProducts.value[idx];
  const merged = {
    ...cur,
    currentPrice: payload.currentPrice ?? cur.currentPrice,
    changeRate: payload.changeRate1s ?? payload.changeRate ?? cur.changeRate,
    currentVolume: payload.currentVolume ?? cur.currentVolume,
    volume: payload.currentVolume ?? payload.volume ?? cur.volume,
    return3Months: payload.return3Months ?? cur.return3Months,
    changeFromPrevDay: payload.changeFromPrevDay ?? cur.changeFromPrevDay,
    changeRateFromPrevDay: payload.changeRateFromPrevDay ?? cur.changeRateFromPrevDay,
    lastUpdate: payload.timestamp ?? cur.lastUpdate
  };
  reactiveProducts.value[idx] = merged;
}

async function resubscribe() {
  await ws.ensureConnection();

  const currentCodes = new Set();

  if (selectCategory.value === 'etf') {
    filterProduct.value.forEach(it => {
      if (it.productCode) currentCodes.add(it.productCode);
    });
  }

  // 구독 해지 대상: 이전에 구독했지만 현재 목록에는 없는 코드
  const toUnsub = [...subscribedCodes.value].filter(code => !currentCodes.has(code));
  if(toUnsub.length > 0) console.log('🔽 Unsubscribing from:', toUnsub);
  toUnsub.forEach(code => {
    ws.unsubscribe(`/topic/etf/${code}`);
    subscribedCodes.value.delete(code);
  });

  // 신규 구독 대상: 현재 목록에는 있지만 아직 구독하지 않은 코드
  const toSub = [...currentCodes].filter(code => !subscribedCodes.value.has(code));
  if(toSub.length > 0) console.log('🔼 Subscribing to:', toSub);

  toSub.forEach(code => {
    ws.subscribeToEtf(code, handleTick);
    subscribedCodes.value.add(code);
  });
}

// 화면에 보여줄 상품 목록이 바뀔 때마다 실행
watch(filterProduct, (newProducts) => {
  console.log('✅ Watch triggered! New product count:', newProducts.length);
  // 1. 실시간으로 업데이트할 반응형 데이터 교체
  reactiveProducts.value = [...newProducts];

  // 2. 빠른 조회를 위한 indexMap 업데이트
  const newMap = new Map();
  reactiveProducts.value.forEach((it, idx) => {
    if (it.productCode) newMap.set(it.productCode, idx);
  });
  indexByCode.value = newMap;

  // 3. 구독 상태 최신화
  resubscribe();
}, { immediate: true }); // immediate: true 옵션으로 컴포넌트 생성 시 최초 1회 즉시 실행

// 컴포넌트가 사라지기 직전에 모든 구독을 해지
onBeforeUnmount(() => {
  [...subscribedCodes.value].forEach(code => {
    ws.unsubscribe(`/topic/etf/${code}`);
  });
  subscribedCodes.value.clear();
});

</script>
<style scoped>
.subBox {
  background-color: var(--white);
  border-radius: 8px;
  border: 1px solid var(--main04);
  padding: 20px;
}
.subItem-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
}

.keyword {
  text-decoration: underline;
}

.product-list {
  margin-top: 10px;
}

.filter {
  margin: 12px 0;
  display: flex;
  gap: 8px;
}

.filter button {
  all: unset;
  padding: 6px 10px;
  border: 1px solid #ccc;
  background-color: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.filter button.active {
  background-color: var(--main01);
  color: var(--white);
  border-color: var(--main01);
}

.productItem{
  margin:10px 0;
}

.no-products{
  font-size:var(--font-size-ms);
  font-weight:var(--font-weight-light);
}
</style>
