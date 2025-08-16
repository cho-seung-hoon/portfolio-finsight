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
import { ref, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import DepositItem from '@/components/list/DepositItem.vue';
import FundItem from '@/components/list/FundItem.vue';
import EtfItem from '@/components/list/EtfItem.vue';
import { getWatchDeposits, getWatchFunds, getWatchEtfs } from '@/api/watchApi';

const tabs = [
  { label: '예금', value: 'deposit' },
  { label: '펀드', value: 'fund' },
  { label: 'ETF', value: 'etf' }
];

const selected = ref('deposit');
const deposits = ref([]);
const funds = ref([]);
const etfs = ref([]);

// 탭 선택 시 해당 데이터 로드
async function selectTab(tab) {
  selected.value = tab;
  await loadData();
}

// 데이터 로드
async function loadData() {
  try {
    if (selected.value === 'deposit') {
      deposits.value = await getWatchDeposits();
      // 찜 목록이므로 모든 아이템의 userWatches를 true로 설정
      deposits.value.forEach(item => {
        item.userWatches = true;
      });
    } else if (selected.value === 'fund') {
      funds.value = await getWatchFunds();
      // 찜 목록이므로 모든 아이템의 userWatches를 true로 설정
      funds.value.forEach(item => {
        item.userWatches = true;
      });
    } else if (selected.value === 'etf') {
      etfs.value = await getWatchEtfs();
      // 찜 목록이므로 모든 아이템의 userWatches를 true로 설정
      etfs.value.forEach(item => {
        item.userWatches = true;
      });
    }
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
}

// 초기 데이터 로드
onMounted(async () => {
  await loadData();
});

// 페이지 떠날 때 정리
onBeforeRouteLeave(() => {
  // 필요한 정리 작업
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
