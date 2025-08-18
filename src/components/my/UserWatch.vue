<template>
  <div class="wishlist-header">
    <h3 class="wishlist-title">찜한 상품</h3>
    <button
      class="more-button"
      @click="goToWatchPage">
      더보기
    </button>
  </div>
  <div class="subBox">
    <template v-if="wishlistData.length > 0">
      <div
        v-for="(item, index) in wishlistData"
        :key="index"
        class="subItem"
        @click="goToProductDetail(item)">
        <div class="subItem-header">
          <div
            class="product-type-badge"
            :class="getProductTypeClass(item.category)">
            {{ getProductTypeText(item.category) }}
          </div>
          <button
            class="wishlist-btn active"
            @click.stop="toggleWishlist(item)"></button>
        </div>

        <div class="subItem-title">{{ truncateProductName(item.productName) }}</div>

        <div class="subItem-content">
          <!-- 예금 -->
          <div
            v-if="item.category === 'deposit'"
            class="amount-info">
            <span class="amount-value">(최고금리) 1년</span>
            <span class="amount-per">{{ item.depositIntrRate2 }}%</span>
          </div>

          <!-- 펀드 -->
          <div
            v-if="item.category === 'fund'"
            class="return-rate">
            <div :class="getReturnRateClass(item.percentChangeFromYesterday || 0)">
              <span class="change-label">(전일대비)</span>
              {{
                item.percentChangeFromYesterday
                  ? (item.percentChangeFromYesterday > 0 ? '+' : '') +
                    item.percentChangeFromYesterday.toFixed(2) +
                    '%'
                  : '수익률 정보 준비중'
              }}
            </div>
            <div class="amount-value-fundNEtf">
              {{ item.currentNav ? `${item.currentNav.toLocaleString()}원` : '가격 정보 준비중' }}
            </div>
          </div>

          <!-- ETF -->
          <div
            v-if="item.category === 'etf'"
            class="return-rate">
            <div :class="getReturnRateClass(item.changeRateFromPrevDay || 0)">
              <span class="change-label">(전일대비)</span>
              {{
                item.changeRateFromPrevDay
                  ? (item.changeRateFromPrevDay > 0 ? '+' : '') +
                    item.changeRateFromPrevDay.toFixed(2) +
                    '%'
                  : '수익률 정보 준비중'
              }}
            </div>
            <div class="amount-value-fundNEtf">
              {{
                item.currentPrice ? `${item.currentPrice.toLocaleString()}원` : '가격 정보 준비중'
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- 더보기 아이템 -->
      <div
        class="subItem more-item"
        @click="goToWatchPage">
        <div class="more-item-content">
          <div class="more-icon">+</div>
          <div class="more-text">더보기</div>
        </div>
      </div>
    </template>

    <div
      v-else
      class="empty-state">
      <div class="empty-text">찜한 상품이 없습니다</div>
      <div class="empty-subtext">관심 있는 상품을 등록해보세요</div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getWatchPreview } from '@/api/watchApi';
import { subscribeToEtfPrice, unsubscribeAll } from '@/utils/websocketUtils';

const wishlistData = ref([]);

// 웹소켓 구독 관리
const etfMap = ref(new Map());
const subscribedCodes = ref(new Set());

const getProductTypeText = type => {
  const typeMap = {
    deposit: '예금',
    fund: '펀드',
    etf: 'ETF'
  };
  return typeMap[type] || '상품';
};

const getProductTypeClass = type => {
  if (!type) return 'product-type-unknown';
  return `product-type-${type}`;
};

const getReturnRateClass = rate => {
  if (rate > 0) {
    return 'return-rate-positive';
  } else if (rate < 0) {
    return 'return-rate-negative';
  } else {
    return 'return-rate-neutral';
  }
};

const truncateProductName = (name, maxLength = 15) => {
  if (name && name.length > maxLength) {
    return name.substring(0, maxLength) + '...';
  }
  return name;
};

const goToProductDetail = item => {
  if (item.category === 'deposit') {
    router.push(`/deposit/${item.productCode}`);
  } else if (item.category === 'fund') {
    router.push(`/fund/${item.productCode}`);
  } else if (item.category === 'etf') {
    router.push(`/etf/${item.productCode}`);
  }
};

// ETF 실시간 데이터 처리
const handleEtfRealtimeData = (data, productCode) => {
  if (etfMap.value.has(productCode)) {
    const etf = etfMap.value.get(productCode);

    const updatedEtf = {
      ...etf,
      currentPrice: data.currentPrice,
      changeRateFromPrevDay: data.changeRateFromPrevDay,
      lastUpdate: data.timestamp
    };

    etfMap.value.set(productCode, updatedEtf);

    const etfIndex = wishlistData.value.findIndex(
      item => item.category === 'etf' && item.productCode === productCode
    );
    if (etfIndex !== -1) {
      wishlistData.value[etfIndex] = updatedEtf;
    }
  }
};

// ETF 웹소켓 구독 시작
const startEtfWebSocketSubscriptions = async () => {
  try {
    unsubscribeFromEtfs();

    const etfItems = wishlistData.value.filter(item => item.category === 'etf');

    for (const etfItem of etfItems) {
      if (etfItem.productCode) {
        const subscription = await subscribeToEtfPrice(etfItem.productCode, data =>
          handleEtfRealtimeData(data, etfItem.productCode)
        );

        if (subscription) {
          subscribedCodes.value.add(etfItem.productCode);
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

const fetchWishlistData = async () => {
  try {
    const data = await getWatchPreview();

    const transformedData = [];

    if (data.watchItems && data.watchItems.length > 0) {
      data.watchItems.forEach(watchItem => {
        const item = {
          ...watchItem.detail,
          category: watchItem.productCategory,
          watchListId: watchItem.watchListId
        };
        transformedData.push(item);
      });
    }

    wishlistData.value = transformedData;

    const etfItems = transformedData.filter(item => item.category === 'etf');
    if (etfItems.length > 0) {
      etfMap.value.clear();
      etfItems.forEach(etf => {
        if (etf.productCode) {
          etfMap.value.set(etf.productCode, etf);
        }
      });
      await startEtfWebSocketSubscriptions();
    } else {
      unsubscribeFromEtfs();
    }
  } catch (error) {
    console.error('찜한 상품 데이터 로딩 실패:', error);
    wishlistData.value = [];
  }
};

const goToWatchPage = () => {
  router.push('/watch');
};

onMounted(() => {
  fetchWishlistData();
});

onBeforeUnmount(() => {
  unsubscribeFromEtfs();
});
</script>

<style scoped>
.wishlist-container {
  margin: 20px 0;
}

.wishlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.wishlist-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
  margin: 0;
}

.more-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--main02);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.more-button:hover {
  background-color: var(--main04);
  color: var(--main01);
}

.subBox {
  margin: 15px 0px;
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
}

.subBox::-webkit-scrollbar {
  display: none;
}

.subItem {
  flex-shrink: 0;
  width: 180px;
  margin-right: 12px;
  background-color: var(--white);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--main04);
  cursor: pointer;
  transition: all 0.2s ease;
}

.subItem:last-child {
  margin-right: 0;
}

.subItem:hover {
  background-color: var(--main04);
}

.subItem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.product-type-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semi-bold);
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  text-align: left;
}

.product-type-deposit {
  background-color: var(--main04);
  color: var(--main02);
}

.product-type-fund {
  background-color: var(--main04);
  color: var(--main02);
}

.product-type-etf {
  background-color: var(--main04);
  color: var(--main02);
  font-weight: var(--font-weight-semi-bold);
}

.product-type-unknown {
  background-color: var(--sub02);
  color: var(--orange01);
  font-weight: var(--font-weight-semi-bold);
}

.wishlist-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.wishlist-btn:hover {
  background-color: var(--main04);
}

.wishlist-btn.active .heart-icon {
  color: #ef4444;
  fill: #ef4444;
}

.heart-icon {
  width: 16px;
  height: 16px;
  color: #d1d5db;
  transition: all 0.2s ease;
}

.subItem-title {
  font-size: var(--font-size-md);
  color: #1f2937;
  font-weight: var(--font-weight-semi-bold);
  margin-bottom: 12px;
  line-height: 1.3;
  height: 2.6em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
}

.subItem-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
  min-height: 40px;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
}

.amount-label {
  font-size: var(--font-size-xs);
  color: var(--main02);
  font-weight: var(--font-weight-medium);
}

.amount-value {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--main02);
}
.amount-per {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}
.amount-value-fundNEtf {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.return-rate {
  text-align: right;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semi-bold);
}

.return-rate > div:last-child {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.return-rate-positive {
  color: var(--red01);
}

.return-rate-negative {
  color: var(--newsPositive);
}

.return-rate-neutral {
  color: var(--main02);
}

.change-label {
  color: var(--main02);
  font-size: 9px;
  font-weight: var(--font-weight-medium);
  margin-right: 4px;
  opacity: 0.8;
}

.more-item {
  background-color: var(--white);
  border: 1px solid var(--main04);
}

.more-item:hover {
  background-color: var(--main04);
  border-color: var(--main02);
}

.more-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
}

.more-icon {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: var(--main02);
}

.more-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--main02);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

.empty-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main02);
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: var(--font-size-sm);
  color: var(--main02);
  opacity: 0.7;
}
</style>
