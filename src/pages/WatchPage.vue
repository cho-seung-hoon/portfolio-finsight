<template>
  <div class="list-watch-page-container">
    <section class="list-watch-page-tab">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-btn', { active: selected === tab.value }]"
        @click="selectTab(tab.value)">
        {{ tab.label }}
      </button>
    </section>
    
    <section class="list-watch-page-contents">
      <!-- 예금 목록 -->
      <template v-if="selected === 'deposit'">
        <DepositItem
          v-for="item in deposits"
          :key="item.productCode"
          :item="item" />
        <div v-if="deposits.length === 0" class="empty-state">
          <img src="@/assets/cha4.png" alt="찜한 상품 없음" class="empty-image" />
          <p class="empty-text">찜한 예금 상품이 없습니다.</p>
        </div>
      </template>
      
      <!-- 펀드 목록 -->
      <template v-if="selected === 'fund'">
        <FundItem
          v-for="item in funds"
          :key="item.productCode"
          :item="item" />
        <div v-if="funds.length === 0" class="empty-state">
          <img src="@/assets/cha4.png" alt="찜한 상품 없음" class="empty-image" />
          <p class="empty-text">찜한 펀드 상품이 없습니다.</p>
        </div>
      </template>
      
      <!-- ETF 목록 -->
      <template v-if="selected === 'etf'">
        <EtfItem
          v-for="item in etfs"
          :key="item.productCode"
          :item="item" />
        <div v-if="etfs.length === 0" class="empty-state">
          <img src="@/assets/cha4.png" alt="찜한 상품 없음" class="empty-image" />
          <p class="empty-text">찜한 ETF 상품이 없습니다.</p>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import DepositItem from '@/components/list/DepositItem.vue';
import FundItem from '@/components/list/FundItem.vue';
import EtfItem from '@/components/list/EtfItem.vue';
import { getWatchDeposits, getWatchFunds, getWatchEtfs } from '@/api/watchApi';
import { useWebSocketStore } from '@/stores/websocket';
import { 
  subscribeToEtfPrice, 
  unsubscribeAll 
} from '@/utils/websocketUtils';

const tabs = [
  { label: '예금', value: 'deposit' },
  { label: '펀드', value: 'fund' },
  { label: 'ETF', value: 'etf' }
];

const selected = ref('deposit');
const deposits = ref([]);
const funds = ref([]);
const etfs = ref([]);

// 웹소켓 구독 관리
const etfMap = ref(new Map());
const subscribedCodes = ref(new Set());

async function selectTab(tab) {
  unsubscribeFromEtfs();
  selected.value = tab;
  await loadData();
}

// ETF 실시간 데이터 처리
const handleEtfRealtimeData = (data, productCode) => {
  if (etfMap.value.has(productCode)) {
    const etf = etfMap.value.get(productCode);
    
    const updatedEtf = {
      ...etf,
      currentPrice: data.currentPrice,
      changeRate: data.changeRate1s,
      currentVolume: data.currentVolume,
      volume: data.currentVolume,
      return3Months: data.return3Months,
      changeFromPrevDay: data.changeFromPrevDay,
      changeRateFromPrevDay: data.changeRateFromPrevDay,
      lastUpdate: data.timestamp
    };
    
    etfMap.value.set(productCode, updatedEtf);
    
    const etfIndex = etfs.value.findIndex(item => item.productCode === productCode);
    if (etfIndex !== -1) {
      etfs.value[etfIndex] = updatedEtf;
    }
  }
};

// ETF 웹소켓 구독 시작
const startEtfWebSocketSubscriptions = async () => {
  try {
    unsubscribeFromEtfs();
    
    for (const etf of etfs.value) {
      if (etf.productCode) {
        const subscription = await subscribeToEtfPrice(
          etf.productCode, 
          (data) => handleEtfRealtimeData(data, etf.productCode)
        );
        
        if (subscription) {
          subscribedCodes.value.add(etf.productCode);
        }
      }
    }
  } catch (error) {
    console.error('ETF 구독 실패:', error);
  }
};

// ETF 웹소켓 구독 해제
const unsubscribeFromEtfs = () => {
  unsubscribeAll();
  subscribedCodes.value.clear();
};

async function loadData() {
  try {
    if (selected.value === 'deposit') {
      const rawDeposits = await getWatchDeposits();
      deposits.value = rawDeposits.map(item => ({
        ...item,
        userWatches: true
      }));
    } else if (selected.value === 'fund') {
      const rawFunds = await getWatchFunds();
      funds.value = rawFunds.map(item => ({
        ...item,
        userWatches: true
      }));
    } else if (selected.value === 'etf') {
      const rawEtfs = await getWatchEtfs();
      etfs.value = rawEtfs.map(item => ({
        ...item,
        userWatches: true
      }));
      
      if (etfs.value.length > 0) {
        etfMap.value.clear();
        etfs.value.forEach(etf => {
          if (etf.productCode) {
            etfMap.value.set(etf.productCode, etf);
          }
        });
        await startEtfWebSocketSubscriptions();
      } else {
        unsubscribeFromEtfs();
      }
    }
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
}

onMounted(async () => {
  await loadData();
});

onBeforeUnmount(() => {
  unsubscribeFromEtfs();
});
</script>

<style scoped>
.list-watch-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  margin-bottom: 60px;
}

.list-watch-page-tab {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  justify-content: center;
}

.tab-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-semi-bold);
  transition:
    background 0.15s,
    color 0.15s;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--main01);
  color: var(--white);
}

.list-watch-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background: var(--main05);
  border-radius: 12px;
  border: 1px solid var(--main04);
  gap: 16px;
}

.empty-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.empty-text {
  color: var(--main02);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-align: center;
  margin: 0;
}
</style>
