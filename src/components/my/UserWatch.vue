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
                  <!-- 예금의 경우 -->
          <div
            v-if="item.category === 'deposit'"
            class="amount-info">
            <span class="amount-value">1년</span>
            <span class="amount-per">{{ item.depositIntrRate2 }}%</span>
          </div>

                     <!-- 펀드의 경우 -->
           <div
             v-if="item.category === 'fund' && item.productRateOfReturn"
             class="return-rate">
             <div class="amount-value-fundNEtf">가격 정보 준비중</div>
             <div :class="getReturnRateClass(item.productRateOfReturn)">
               <span class="change-label">(전일대비)</span>
               {{ item.productRateOfReturn > 0 ? '+' : '' }}{{ item.productRateOfReturn.toFixed(2) }}%
             </div>
           </div>

                     <!-- ETF의 경우 -->
           <div
             v-if="item.category === 'etf'"
             class="return-rate">
             <div class="amount-value-fundNEtf">
               {{ item.currentPrice ? `${item.currentPrice.toLocaleString()}원` : '가격 정보 준비중' }}
             </div>
             <div :class="getReturnRateClass(item.changeRateFromPrevDay || 0)">
               <span class="change-label">(전일대비)</span>
               {{ item.changeRateFromPrevDay ? 
                 (item.changeRateFromPrevDay > 0 ? '+' : '') + item.changeRateFromPrevDay.toFixed(2) + '%' : 
                 '수익률 정보 준비중' 
               }}
             </div>
           </div>
          
          <!-- 디버깅용: 카테고리가 없는 경우 -->
          <div
            v-if="!item.category"
            class="debug-info"
            style="font-size: 10px; color: #999; padding: 4px; background: #f5f5f5; border-radius: 4px;">
            카테고리 없음: {{ JSON.stringify(item) }}
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
  </div>
</template>

<script setup>
import router from '@/router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getWatchPreview } from '@/api/watchApi';
import { 
  subscribeToEtfPrice, 
  unsubscribeAll 
} from '@/utils/websocketUtils';

const wishlistData = ref([]);
const mockWishlistData = [];

// 웹소켓 관련 - WatchPage.vue와 동일한 패턴
const etfMap = ref(new Map()); // ETF 데이터를 Map으로 관리
const subscribedCodes = ref(new Set()); // 구독 중인 상품코드들

// 컴포넌트 메서드들
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

const getAmountLabel = type => {
  if (type === 'deposit') {
    return '가입금액';
  } else {
    return '평가금액';
  }
};

const getAmountClass = type => {
  return type === 'deposit' ? 'deposit-amount' : 'evaluation-amount';
};

const formatAmount = amount => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

const getReturnRateClass = productRateOfReturn => {
  if (productRateOfReturn > 0) {
    return 'return-rate-positive';
  } else if (productRateOfReturn < 0) {
    return 'return-rate-negative';
  } else {
    return 'return-rate-neutral';
  }
};

// 상품명이 길면 ...으로 줄이기
const truncateProductName = (name, maxLength = 15) => {
  if (name && name.length > maxLength) {
    return name.substring(0, maxLength) + '...';
  }
  return name;
};

const goToProductDetail = item => {
  // 상품 상세 페이지로 이동
  console.log('상품 상세로 이동:', item);
  
  // 상품 카테고리에 따라 다른 라우트로 이동
  if (item.category === 'deposit') {
    router.push(`/deposit/${item.productCode}`);
  } else if (item.category === 'fund') {
    router.push(`/fund/${item.productCode}`);
  } else if (item.category === 'etf') {
    router.push(`/etf/${item.productCode}`);
  }
};

// ETF 실시간 데이터 처리 - WatchPage.vue와 동일한 패턴
const handleEtfRealtimeData = (data, productCode) => {
  console.log(`[ETF 실시간] ${productCode}:`, data);
  
  // Map에서 해당 ETF 찾아서 업데이트
  if (etfMap.value.has(productCode)) {
    const etf = etfMap.value.get(productCode);
    
    // 실시간 데이터로 업데이트
    const updatedEtf = {
      ...etf,
      currentPrice: data.currentPrice,
      changeRateFromPrevDay: data.changeRateFromPrevDay,
      changeFromPrevDay: data.changeFromPrevDay,
      lastUpdate: data.timestamp
    };
    
    // Map 업데이트 (부분 업데이트로 성능 최적화)
    etfMap.value.set(productCode, updatedEtf);
    
    // wishlistData 배열도 업데이트 (UI 반영을 위해)
    const etfIndex = wishlistData.value.findIndex(item => 
      item.category === 'etf' && item.productCode === productCode
    );
    if (etfIndex !== -1) {
      wishlistData.value[etfIndex] = updatedEtf;
    }
    
    console.log(`[ETF 업데이트] ${productCode}:`, updatedEtf);
  }
};

// ETF 웹소켓 구독 시작 - WatchPage.vue와 동일한 패턴
const startEtfWebSocketSubscriptions = async () => {
  try {
    // 기존 구독 해제
    unsubscribeFromEtfs();
    
    // ETF 아이템들에 대해 구독 시작
    const etfItems = wishlistData.value.filter(item => item.category === 'etf');
    
    for (const etfItem of etfItems) {
      if (etfItem.productCode) {
        const subscription = await subscribeToEtfPrice(
          etfItem.productCode, 
          (data) => handleEtfRealtimeData(data, etfItem.productCode)
        );
        
        if (subscription) {
          subscribedCodes.value.add(etfItem.productCode);
          console.log(`[ETF 구독] ${etfItem.productName || etfItem.productCode} 구독 성공`);
        } else {
          console.warn(`[ETF 구독] ${etfItem.productName || etfItem.productCode} 구독 실패`);
        }
      }
    }
    
    console.log(`[ETF 구독] ${subscribedCodes.value.size}개 ETF 구독 완료`);
    
  } catch (error) {
    console.error('[ETF 웹소켓] 구독 실패:', error);
  }
};

// ETF 웹소켓 구독 해제 - WatchPage.vue와 동일한 패턴
const unsubscribeFromEtfs = () => {
  unsubscribeAll();
  subscribedCodes.value.clear();
  console.log('[ETF] 모든 구독 해제 완료');
};

const fetchWishlistData = async () => {
  try {
    // 새로운 통합 API 사용
    const data = await getWatchPreview();
    
    console.log('API 응답 데이터:', data);
    
    // API 응답 데이터를 컴포넌트에서 사용할 수 있는 형태로 변환
    const transformedData = [];
    
    // 예금 데이터 변환
    if (data.deposits && data.deposits.length > 0) {
      data.deposits.forEach(item => {
        transformedData.push({
          ...item,
          category: 'deposit'
        });
      });
    }
    
    // 펀드 데이터 변환
    if (data.funds && data.funds.length > 0) {
      data.funds.forEach(item => {
        transformedData.push({
          ...item,
          category: 'fund'
        });
      });
    }
    
    // ETF 데이터 변환
    if (data.etfs && data.etfs.length > 0) {
      data.etfs.forEach(item => {
        transformedData.push({
          ...item,
          category: 'etf'
        });
      });
    }
    
    // 데이터가 비어있으면 기본 데이터로 테스트
    if (transformedData.length === 0) {
      console.log('API 데이터가 비어있음, 기본 데이터 사용');
      transformedData.push({
        productCode: '248270',
        productName: 'TIGER S&P글로벌헬스케어',
        category: 'etf',
        currentPrice: 8785.19,
        changeRateFromPrevDay: -1.37
      });
    }
    
    wishlistData.value = transformedData;
    console.log('변환된 찜한 상품 데이터:', wishlistData.value);
    
    // ETF 데이터가 있으면 Map에 저장하고 웹소켓 구독 시작
    const etfItems = transformedData.filter(item => item.category === 'etf');
    if (etfItems.length > 0) {
      // ETF 데이터를 Map에 저장
      etfMap.value.clear();
      etfItems.forEach(etf => {
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
  } catch (error) {
    console.error('찜한 상품 데이터 로딩 실패:', error);
    // 에러 시 기본 ETF 데이터 사용
    wishlistData.value = [{
      productCode: '248270',
      productName: 'TIGER S&P글로벌헬스케어',
      category: 'etf',
      currentPrice: 8785.19,
      changeRateFromPrevDay: -1.37
    }];
    
    // ETF Map 설정
    etfMap.value.set('248270', wishlistData.value[0]);
    await startEtfWebSocketSubscriptions();
  }
};

const goToWatchPage = () => {
  router.push('/watch');
};

onMounted(() => {
  fetchWishlistData();
});

onBeforeUnmount(() => {
  // 컴포넌트 언마운트 시 모든 ETF 구독 해제
  unsubscribeFromEtfs();
});
</script>

<style scoped>
:root {
  --white: #ffffff;
  --main01: #1f2937;
  --main02: #6b7280;
  --main04: #e5e7eb;
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-weight-medium: 500;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
}
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
  background-color: #f3f4f6;
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
  color: #757c8c;
}

.product-type-fund {
  background-color: var(--main04);
  color: #757c8c;
}

.product-type-etf {
  background-color: var(--main04);
  color: #757c8c;
  font-weight: var(--font-weight-semi-bold);
}

.product-type-unknown {
  background-color: #fef3c7;
  color: #92400e;
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
  background-color: #f3f4f6;
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
}
.amount-per {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
.amount-value-fundNEtf {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.return-rate {
  text-align: right;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semi-bold);
}

.return-rate-positive {
  color: #dc2626;
}

.return-rate-negative {
  color: #2563eb;
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
  background-color: #f3f4f6;
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
</style>
