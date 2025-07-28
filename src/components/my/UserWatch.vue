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
      class="subItem"
      v-for="(item, index) in wishlistData"
      :key="index"
      @click="goToProductDetail(item)">
      <div class="subItem-header">
        <div
          class="product-type-badge"
          :class="getProductTypeClass(item.type)">
          {{ getProductTypeText(item.type) }}
        </div>
        <button
          class="wishlist-btn active"
          @click.stop="toggleWishlist(item)"></button>
      </div>

      <div class="subItem-title">{{ item.name }}</div>

      <div class="subItem-content">
        <div class="amount-info">
          <span class="amount-label">
            {{ getAmountLabel(item.type) }}
          </span>
          <span
            class="amount-value"
            :class="getAmountClass(item.type)">
            {{ formatAmount(item.amount) }}원
          </span>
        </div>

        <!-- 펀드/ETF의 경우 수익률 표시 -->
        <div
          v-if="item.type !== 'deposit' && item.returnRate"
          class="return-rate">
          <span :class="getReturnRateClass(item.returnRate)">
            {{ item.returnRate > 0 ? '+' : '' }}{{ item.returnRate.toFixed(2) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';

const wishlistData = ref([]);

// 찜한 상품 데이터 (실제로는 API에서 가져올 데이터)
const mockWishlistData = [
  {
    id: 1,
    type: 'deposit',
    name: 'SH 첫만남우대예금',
    amount: 1000000, // 가입 금액
    interestRate: 3.5,
    bank: 'SH수협은행'
  },
  {
    id: 2,
    type: 'deposit',
    name: '정기예금 특판',
    amount: 5000000,
    interestRate: 4.2,
    bank: '국민은행'
  },
  {
    id: 3,
    type: 'fund',
    name: '삼성 글로벌 펀드',
    amount: 2500000, // 평가 금액
    returnRate: 8.5,
    company: '삼성자산운용'
  },
  {
    id: 4,
    type: 'fund',
    name: '미래에셋 코리아 펀드',
    amount: 1800000,
    returnRate: -2.3,
    company: '미래에셋자산운용'
  },
  {
    id: 5,
    type: 'etf',
    name: 'KODEX 200',
    amount: 3200000, // 평가 금액
    returnRate: 12.7,
    company: '삼성자산운용'
  },
  {
    id: 6,
    type: 'etf',
    name: 'TIGER 미국S&P500',
    amount: 4500000,
    returnRate: 15.2,
    company: 'mirae에셋자산운용'
  }
];

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

const getReturnRateClass = returnRate => {
  if (returnRate > 0) {
    return 'return-rate-positive';
  } else if (returnRate < 0) {
    return 'return-rate-negative';
  } else {
    return 'return-rate-neutral';
  }
};

const toggleWishlist = item => {
  // 찜하기 토글 로직
  console.log('찜하기 토글:', item.name);
  // 실제로는 API 호출하여 찜하기 상태 변경
};

const goToProductDetail = item => {
  // 상품 상세 페이지로 이동
  console.log('상품 상세로 이동:', item);
  // 실제로는 라우터를 사용하여 페이지 이동
};

const fetchWishlistData = async () => {
  try {
    // 실제로는 API에서 찜한 상품 데이터를 가져옴
    // const data = await getWishlistProducts()

    // 목업 데이터 사용
    wishlistData.value = mockWishlistData;
    console.log('찜한 상품 데이터:', wishlistData.value);
  } catch (error) {
    console.error('찜한 상품 데이터 로딩 실패:', error);
  }
};

const goToWatchPage = () => {
  router.push('/watch');
};

onMounted(() => {
  fetchWishlistData();
});
</script>

<style scoped>
:root {
  --white: #ffffff;
  --main02: #6b7280;
  --main04: #e5e7eb;
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
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
  font-weight: var(--font-weight-semibold);
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}

.product-type-deposit {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.product-type-fund {
  background-color: #fef3c7;
  color: #d97706;
}

.product-type-etf {
  background-color: #d1fae5;
  color: #059669;
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
  font-weight: var(--font-weight-semibold);
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.subItem-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.amount-label {
  font-size: var(--font-size-xs);
  color: var(--main02);
  font-weight: var(--font-weight-medium);
}

.amount-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.deposit-amount {
  color: #1d4ed8;
}

.evaluation-amount {
  color: #1f2937;
}

.return-rate {
  text-align: right;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
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
</style>
