<template>
  <div class="main-section">
    <div class="product-bank">{{ bank }}</div>
    <div class="product-title-row">
      <div class="product-title">{{ title }}</div>
      <IconFullHeart
        v-if="heartActive"
        class="heart-icon"
        @click="toggleHeart"
      />
      <IconEmptyHeart
        v-else
        class="heart-icon"
        @click="toggleHeart"
      />
    </div>
    <div class="rate-box">
      <div class="rate-info left">
        <div class="rate-label">순자산 총액</div>
        <div class="rate-value">{{ formattedNetAssets }}</div>
      </div>
      <div class="rate-divider"></div>
      <div class="rate-info right">
        <div class="rate-label">위험 등급</div>
        <div class="star-row">
          <component
            v-for="n in 6"
            :is="n <= risk ? IconFillStar : IconEmptyStar"
            :key="n"
            class="star-icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import IconEmptyHeart from '@/components/icons/IconEmptyHeart.vue';
import IconFullHeart from '@/components/icons/IconFullHeart.vue';
import IconFillStar from '@/components/icons/IconFillStar.vue';
import IconEmptyStar from '@/components/icons/IconEmptyStar.vue';

const props = defineProps({
  bank: String,
  title: String,
  net_assets: String, // 순자산 총액 (단위 없는 숫자 문자열)
  risk: Number        // 위험 등급 (1~6)
});

const formattedNetAssets = computed(() => {
  // 이미 억원 단위(소수점 포함)로 들어온다고 가정
  if (!props.net_assets) return '-';
  // 숫자만 추출(소수점 포함)
  const num = Number((props.net_assets + '').replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '-';
  // 소수점 두 자리까지, 천 단위 콤마
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '억원';
});

const heartActive = ref(false);
function toggleHeart() {
  heartActive.value = !heartActive.value;
}
</script>

<style scoped>
.main-section {
  background: var(--main01);
  padding: 32px 32px 24px 32px;
  text-align: left;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}
.product-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  justify-content: space-between;
}
.product-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--main05);
}
.heart-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  user-select: none;
  display: inline-block;
}
.product-bank {
  font-size: 18px;
  font-weight: 500;
  color: var(--main05);
  margin-bottom: 4px;
}
.rate-box {
  background: var(--main05);
  border-radius: 20px;
  padding: 16px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}
.rate-info {
  text-align: center;
  flex: 1;
}
.rate-divider {
  width: 1px;
  height: 48px;
  background: #e0e0e0;
  margin: 0 30px;
}
.rate-label {
  font-size: 12px;
  color: var(--main02);
  margin-bottom: 2px;
}
.rate-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--main01);
}
.star-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2px;
}
.star-icon {
  width: 20px;
  height: 20px;
}
</style> 