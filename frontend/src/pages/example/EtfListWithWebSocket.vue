<template>
  <div class="etf-list-with-websocket">
    <h2>ETF 리스트 (웹소켓 실시간 데이터)</h2>

    <!-- 연결 상태 표시 -->
    <div class="connection-status">
      <span
        class="status-indicator"
        :class="{ connected: isConnected }"></span>
      {{ isConnected ? '웹소켓 연결됨' : '웹소켓 연결 안됨' }}
    </div>

    <!-- 필터 및 검색 -->
    <div class="controls">
      <button
        @click="loadMoreProducts"
        :disabled="isLoading">
        {{ isLoading ? '로딩 중...' : '더 많은 상품 로드' }}
      </button>
      <button @click="clearAllSubscriptions">모든 구독 해제</button>
    </div>

    <!-- 상품 리스트 -->
    <div class="product-list">
      <div
        v-for="product in products"
        :key="product.product_code"
        class="product-item"
        @click="goToDetail(product.product_code)">
        <!-- 상품 기본 정보 -->
        <div class="product-header">
          <h3>{{ product.product_name }}</h3>
          <span class="product-code">{{ product.product_code }}</span>
        </div>

        <!-- 실시간 데이터 표시 -->
        <div class="realtime-data">
          <div class="data-row">
            <span class="label">현재가:</span>
            <span
              class="value price"
              :class="getPriceClass(product.changeRate)">
              {{ formatPrice(product.currentPrice || product.nav) }}원
            </span>
          </div>

          <div class="data-row">
            <span class="label">전일대비:</span>
            <span
              class="value change-rate"
              :class="getPriceClass(product.changeRate)">
              {{ formatChangeRate(product.changeRate) }}
            </span>
          </div>

          <div class="data-row">
            <span class="label">거래량:</span>
            <span class="value">{{ formatVolume(product.volume) }}</span>
          </div>

          <div class="data-row">
            <span class="label">수익률:</span>
            <span class="value">{{ product.rate_of_return }}</span>
          </div>

          <div class="data-row">
            <span class="label">위험등급:</span>
            <span class="value">{{ product.risk_grade }}등급</span>
          </div>
        </div>

        <!-- 마지막 업데이트 시간 -->
        <div
          class="last-update"
          v-if="product.lastUpdate">
          마지막 업데이트: {{ formatTime(product.lastUpdate) }}
        </div>

        <!-- 구독 해제 버튼 -->
        <button
          @click.stop="unsubscribeProduct(product.product_code)"
          class="unsubscribe-btn">
          구독 해제
        </button>
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div
      v-if="isLoading"
      class="loading">
      상품을 불러오는 중...
    </div>

    <!-- 구독 상태 정보 -->
    <div class="subscription-info">
      <p>총 {{ products.length }}개 상품 구독 중</p>
      <p>활성 구독: {{ activeSubscriptions.length }}개</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductSubscription } from '@/composables/useProductSubscription';

const router = useRouter();
const {
  connectProductsToWebSocket,
  addProductsSubscription,
  unsubscribeFromSingleProduct,
  unsubscribeAll,
  isConnected
} = useProductSubscription();

// 상태 관리
const products = ref([]);
const activeSubscriptions = ref([]);
const isLoading = ref(false);

// Mock 데이터 (실제로는 API에서 가져옴)
const mockProducts = [
  {
    product_code: '192720',
    product_name: 'TIGER 미국S&P500',
    country: '미국',
    etf_type: '주식형',
    nav: 15000,
    volume: 1000000,
    rate_of_return: '+2.5%',
    risk_grade: 4,
    currentPrice: 15000,
    changeRate: 2.5,
    volume: 1000000,
    tradeAmount: 15000000000,
    marketCap: 500000000000,
    lastUpdate: new Date().toISOString()
  },
  {
    product_code: '279530',
    product_name: 'KODEX 200',
    country: '국내',
    etf_type: '주식형',
    nav: 12500,
    volume: 800000,
    rate_of_return: '-1.2%',
    risk_grade: 3,
    currentPrice: 12500,
    changeRate: -1.2,
    volume: 800000,
    tradeAmount: 10000000000,
    marketCap: 300000000000,
    lastUpdate: new Date().toISOString()
  },
  {
    product_code: '346000',
    product_name: 'TIGER 코스닥150',
    country: '국내',
    etf_type: '주식형',
    nav: 18000,
    volume: 1200000,
    rate_of_return: '+3.8%',
    risk_grade: 5,
    currentPrice: 18000,
    changeRate: 3.8,
    volume: 1200000,
    tradeAmount: 21600000000,
    marketCap: 400000000000,
    lastUpdate: new Date().toISOString()
  }
];

// 상품 데이터 업데이트 콜백
const updateProductData = (updatedProduct, productCode) => {
  const index = products.value.findIndex(p => p.product_code === productCode);
  if (index !== -1) {
    products.value[index] = { ...products.value[index], ...updatedProduct };
    console.log(`[UPDATE] 상품 ${productCode} 데이터 업데이트:`, updatedProduct);
  }
};

// 초기 상품 로드 및 구독 연결
const loadInitialProducts = async () => {
  isLoading.value = true;
  try {
    // Mock 데이터로 초기 상품 설정
    products.value = [...mockProducts];

    // 웹소켓 구독 연결
    const subscriptions = await connectProductsToWebSocket(products.value, updateProductData);
    activeSubscriptions.value = subscriptions;

    console.log(`[INIT] ${subscriptions.length}개 상품 구독 시작`);
  } catch (error) {
    console.error('[INIT ERROR] 초기 상품 로드 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// 더 많은 상품 로드 (페이지네이션 시뮬레이션)
const loadMoreProducts = async () => {
  isLoading.value = true;
  try {
    // 새로운 Mock 상품들
    const newProducts = [
      {
        product_code: '456789',
        product_name: 'TIGER 유럽STOXX50',
        country: '유럽',
        etf_type: '주식형',
        nav: 22000,
        volume: 500000,
        rate_of_return: '+1.5%',
        risk_grade: 4,
        currentPrice: 22000,
        changeRate: 1.5,
        volume: 500000,
        tradeAmount: 11000000000,
        marketCap: 200000000000,
        lastUpdate: new Date().toISOString()
      },
      {
        product_code: '789012',
        product_name: 'KODEX 반도체',
        country: '국내',
        etf_type: '주식형',
        nav: 28000,
        volume: 1500000,
        rate_of_return: '+5.2%',
        risk_grade: 5,
        currentPrice: 28000,
        changeRate: 5.2,
        volume: 1500000,
        tradeAmount: 42000000000,
        marketCap: 600000000000,
        lastUpdate: new Date().toISOString()
      }
    ];

    // 기존 상품 리스트에 추가
    products.value.push(...newProducts);

    // 새로운 상품들에 대한 구독 추가
    const newSubscriptions = await addProductsSubscription(newProducts, updateProductData);
    activeSubscriptions.value.push(...newSubscriptions);

    console.log(`[LOAD MORE] ${newSubscriptions.length}개 추가 상품 구독`);
  } catch (error) {
    console.error('[LOAD MORE ERROR] 추가 상품 로드 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// 단일 상품 구독 해제
const unsubscribeProduct = productCode => {
  unsubscribeFromSingleProduct(productCode);

  // 구독 목록에서 제거
  activeSubscriptions.value = activeSubscriptions.value.filter(sub => sub.code !== productCode);

  // 상품 리스트에서 제거 (선택사항)
  products.value = products.value.filter(p => p.product_code !== productCode);

  console.log(`[UNSUBSCRIBE] 상품 ${productCode} 구독 해제`);
};

// 모든 구독 해제
const clearAllSubscriptions = () => {
  unsubscribeAll();
  activeSubscriptions.value = [];
  console.log('[CLEAR ALL] 모든 구독 해제');
};

// 상세 페이지로 이동
const goToDetail = productCode => {
  router.push(`/etf/${productCode}`);
};

// 포맷팅 함수들
const formatPrice = price => {
  if (!price) return '-';
  return new Intl.NumberFormat('ko-KR').format(price);
};

const formatChangeRate = rate => {
  if (!rate) return '-';
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(2)}%`;
};

const formatVolume = volume => {
  if (!volume) return '-';
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('ko-KR').format(volume);
};

const formatTime = timestamp => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleTimeString('ko-KR');
};

const getPriceClass = changeRate => {
  if (!changeRate) return '';
  return changeRate > 0 ? 'positive' : changeRate < 0 ? 'negative' : 'neutral';
};

// 컴포넌트 마운트 시 초기 로드
onMounted(() => {
  loadInitialProducts();
});

// 컴포넌트 언마운트 시 모든 구독 해제
onUnmounted(() => {
  if (activeSubscriptions.value.length > 0) {
    clearAllSubscriptions();
  }
});
</script>

<style scoped>
.etf-list-with-websocket {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #dc3545;
  transition: background-color 0.3s ease;
}

.status-indicator.connected {
  background-color: #28a745;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.controls button:first-child {
  background-color: #007bff;
  color: white;
}

.controls button:first-child:hover:not(:disabled) {
  background-color: #0056b3;
}

.controls button:first-child:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.controls button:last-child {
  background-color: #dc3545;
  color: white;
}

.controls button:last-child:hover {
  background-color: #c82333;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.product-item {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.product-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.product-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  flex: 1;
}

.product-code {
  font-size: 12px;
  color: #6c757d;
  background-color: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.realtime-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 15px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.value {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.value.price.positive {
  color: #dc3545;
}

.value.price.negative {
  color: #007bff;
}

.value.change-rate.positive {
  color: #dc3545;
}

.value.change-rate.negative {
  color: #007bff;
}

.last-update {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 10px;
}

.unsubscribe-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.product-item:hover .unsubscribe-btn {
  opacity: 1;
}

.unsubscribe-btn:hover {
  background-color: #c82333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 16px;
}

.subscription-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.subscription-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #495057;
}
</style>
