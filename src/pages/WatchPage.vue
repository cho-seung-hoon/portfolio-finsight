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

// 웹소켓 관련
const etfMap = ref(new Map()); // ETF 데이터를 Map으로 관리 (방법 2)
const subscribedCodes = ref(new Set()); // 구독 중인 상품코드들

// 탭 선택 시 해당 데이터 로드
async function selectTab(tab) {
  // 매번 ETF 구독 정리 (안전성과 단순성)
  unsubscribeFromEtfs();
  selected.value = tab;
  await loadData();
}

// ETF 실시간 데이터 처리
const handleEtfRealtimeData = (data, productCode) => {
  console.log(`[ETF 실시간] ${productCode}:`, data);
  
  // Map에서 해당 ETF 찾아서 업데이트
  if (etfMap.value.has(productCode)) {
    const etf = etfMap.value.get(productCode);
    
    // 실시간 데이터로 업데이트
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
    
    // Map 업데이트 (부분 업데이트로 성능 최적화)
    etfMap.value.set(productCode, updatedEtf);
    
    // etfs 배열도 업데이트 (UI 반영을 위해)
    const etfIndex = etfs.value.findIndex(item => item.productCode === productCode);
    if (etfIndex !== -1) {
      etfs.value[etfIndex] = updatedEtf;
    }
    
    console.log(`[ETF 업데이트] ${productCode}:`, updatedEtf);
  }
};

// ETF 웹소켓 구독 시작
const startEtfWebSocketSubscriptions = async () => {
  try {
    // 기존 구독 해제
    unsubscribeFromEtfs();
    
    // 새로운 ETF들 구독
    for (const etf of etfs.value) {
      if (etf.productCode) {
        const subscription = await subscribeToEtfPrice(
          etf.productCode, 
          (data) => handleEtfRealtimeData(data, etf.productCode)
        );
        
        if (subscription) {
          subscribedCodes.value.add(etf.productCode);
          console.log(`[ETF 구독] ${etf.productName || etf.productCode} 구독 성공`);
        } else {
          console.warn(`[ETF 구독] ${etf.productName || etf.productCode} 구독 실패`);
        }
      }
    }
    
    console.log(`[ETF 구독] ${subscribedCodes.value.size}개 ETF 구독 완료`);
    
  } catch (error) {
    console.error('[ETF 웹소켓] 구독 실패:', error);
  }
};

// ETF 웹소켓 구독 해제
const unsubscribeFromEtfs = () => {
  unsubscribeAll();
  subscribedCodes.value.clear();
  console.log('[ETF] 모든 구독 해제 완료');
};

// 데이터 로드
async function loadData() {
  try {
    if (selected.value === 'deposit') {
      const rawDeposits = await getWatchDeposits();
      // 찜목록이므로 모든 아이템의 userWatches를 true로 설정
      deposits.value = rawDeposits.map(item => ({
        ...item,
        userWatches: true
      }));
    } else if (selected.value === 'fund') {
      const rawFunds = await getWatchFunds();
      // 찜목록이므로 모든 아이템의 userWatches를 true로 설정
      funds.value = rawFunds.map(item => ({
        ...item,
        userWatches: true
      }));
    } else if (selected.value === 'etf') {
      const rawEtfs = await getWatchEtfs();
      // 찜목록이므로 모든 아이템의 userWatches를 true로 설정
      etfs.value = rawEtfs.map(item => ({
        ...item,
        userWatches: true
      }));
      
      // ETF 데이터가 있으면 Map에 저장하고 웹소켓 구독 시작
      if (etfs.value.length > 0) {
        // ETF 데이터를 Map에 저장
        etfMap.value.clear();
        etfs.value.forEach(etf => {
          if (etf.productCode) {
            etfMap.value.set(etf.productCode, etf);
          }
        });
        // 웹소켓 구독 시작
        await startEtfWebSocketSubscriptions();
      } else {
        // ETF가 없으면 기존 구독 해제
        unsubscribeFromEtfs();
      }
    }
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
}

// 초기 데이터 로드
onMounted(async () => {
  await loadData();
});

// 컴포넌트 언마운트 시 정리 (라우트 변경과 무관하게)
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
