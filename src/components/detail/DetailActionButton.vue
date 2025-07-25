<template>
  <div class="asset-record-btn-fixed-wrapper">
    <button
      type="button"
      class="asset-record-btn-fixed"
      :class="{ active }"
      @click="handleClick">
      <span
        v-if="active"
        class="asset-record-desc"
        >현재 보유자산입니다.</span
      >
      <!-- <span :class="['asset-record-btn-text', { center: !active }]">{{
        active ? '자세히보기' : '첫 매수하기'
      }}</span> -->
      <span
        v-if="!active"
        class="asset-record-btn-text center"
        >첫 매수하기</span
      >
      <!-- 자세히보기는 잠시 주석 처리 -->
      <!-- <span v-else class="asset-record-btn-text">자세히보기</span> -->
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  bank: String,
  title: String,
  maxRate: String,
  maxRateDesc: String,
  baseRate: String,
  active: Boolean,
  category: String,
  id: [String, Number]
});

const router = useRouter();

const heartActive = ref(false);
function toggleHeart() {
  heartActive.value = !heartActive.value;
}

function handleClick() {
  if (!props.active) {
    // 첫 매수하기 버튼 클릭 시 이동
    router.push(`/${props.category}/buy/${props.id}`);
  } else {
    // 자세히보기는 잠시 주석 처리
    // $emit('click');
  }
}
</script>

<style scoped>
.asset-record-btn-fixed-wrapper {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  width: 100%;
  max-width: 408px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.asset-record-btn-fixed {
  width: 100%;
  border-radius: 20px;
  padding: 16px 0;
  background: var(--main01);
  color: var(--white);
  font-weight: 700;
  font-size: 18px;
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 수직 중앙 정렬 */
  min-height: 56px; /* 버튼 높이 최소값(원하는 값으로 조정) */
  box-sizing: border-box;
  border: none;
}
.asset-record-btn-fixed.active {
  background: var(--sub01);
  color: var(--white);
  padding-top: 8px;
  padding-bottom: 7px;
}
.asset-record-desc {
  font-size: 12px;
  color: var(--main02);
  text-align: center;
}
.asset-record-btn-text {
  text-align: center;
}
.asset-record-btn-text.center {
  margin-top: 0;
}
@media (max-width: 480px) {
  .asset-record-btn-fixed-wrapper {
    width: calc(100% - 32px); /* 좌우 16px 여백 */
    margin-left: 0;
    margin-right: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 100vw;
  }
}
</style>
