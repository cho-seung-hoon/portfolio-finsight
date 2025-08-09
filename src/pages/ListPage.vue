<template>
  <ListTab />
  <section class="page-content">
    <div v-if="category === 'deposit'">
      <ListDepositPage />
    </div>
    <div v-else-if="category === 'fund'">
      <ListFundPage />
    </div>
    <div v-else-if="category === 'etf'">
      <ListEtfPage />
    </div>
  </section>
  <div class="list-page-banner-wrapper">
    <div
      class="list-page-banner"
      :class="[{ matched: isMatched }, isMatched ? profileClass : '']"
      style="cursor: pointer"
      @click="openModal">
      <div
        class="list-page-banner-comment"
        :class="isMatched ? 'matched' : 'default'">
        <IconCheck
          :width="20"
          :color="isMatched ? 'var(--white)' : 'var(--main03)'" />
        <span>
          {{ isMatched ? '내 투자 성향에 맞춰보는 중!' : '내 투자 성향에 맞춰보기' }}
        </span>
      </div>
      <button
        v-if="isMatched"
        class="close-btn"
        @click.stop="resetMatch">
        해제
      </button>
    </div>
  </div>

  <Transition name="slide-up">
    <BottomModal
      v-if="showModal"
      @confirm="confirmMatch"
      @cancel="closeModal" />
  </Transition>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import ListTab from '@/components/list/ListTab.vue';
import ListDepositPage from './list/ListDepositPage.vue';
import ListFundPage from './list/ListFundPage.vue';
import ListEtfPage from './list/ListEtfPage.vue';
import IconCheck from '@/components/icons/IconCheck.vue';
import BottomModal from '@/components/list/BottomModal.vue';
import axios from 'axios';

const route = useRoute();
const category = computed(() => route.params.category);
const isMatched = ref(false);
const showModal = ref(false);
const investmentProfileType = ref('');

onMounted(() => {
  isMatched.value = getFinFilters().isMatched || false;
  fetchInvestmentProfile();
});

function openModal() {
  if (!isMatched.value) {
    showModal.value = true;
  }
}

function closeModal() {
  showModal.value = false;
}

function confirmMatch() {
  isMatched.value = true;
  updateIsMatchedInStorage(true);
  emitMatchChange();
  showModal.value = false;
}

function resetMatch() {
  isMatched.value = false;
  updateIsMatchedInStorage(false);
  emitMatchChange();
}

function updateIsMatchedInStorage(val) {
  setFinFilters({
    ...getFinFilters(),
    isMatched: val
  });
}

function emitMatchChange() {
  window.dispatchEvent(new CustomEvent('isMatchedChanged'));
}

const fetchInvestmentProfile = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('accessToken이 없습니다.');
    return;
  }
  try {
    const response = await axios.get('http://localhost:8080/users/invt', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const type = response.data.investmentProfileType;
    investmentProfileType.value = translateProfileType(type);
    profileClass.value = getProfileClass(type);
    console.log('투자성향결과:', type);
  } catch (error) {
    console.error('투자성향 조회 실패:', error);
  }
};
const profileClass = ref('');
const translateProfileType = type => {
  switch (type) {
    case 'stable':
      return '안정형';
    case 'stableplus':
      return '안정추구형';
    case 'neutral':
      return '위험중립형';
    case 'aggressive':
      return '적극투자형';
    case 'veryaggressive':
      return '공격투자형';
    default:
      return '알 수 없음';
  }
};
const getProfileClass = type => {
  switch (type) {
    case 'stable':
      return 'highlight-stable';
    case 'stableplus':
      return 'highlight-stableplus';
    case 'neutral':
      return 'highlight-neutral';
    case 'aggressive':
      return 'highlight-aggressive';
    case 'veryaggressive':
      return 'highlight-veryaggressive';
    default:
      return '';
  }
};
</script>

<style scoped>
/* 성향별 배경색 정의 */
.list-page-banner.matched.highlight-stable {
  background: var(--mint01);
  border: 1px solid var(--mint01);
}
.list-page-banner.matched.highlight-stableplus {
  background: var(--green01);
  border: 1px solid var(--green01);
}
.list-page-banner.matched.highlight-neutral {
  background: var(--yellow01);
  border: 1px solid var(--yellow01);
}
.list-page-banner.matched.highlight-aggressive {
  background: var(--orange01);
  border: 1px solid var(--orange01);
}
.list-page-banner.matched.highlight-veryaggressive {
  background: var(--red01);
  border: 1px solid var(--red01);
}
.page-content {
  width: 100%;
  padding: 12px 0px 50px;
}

.list-page-banner-wrapper {
  position: fixed;
  left: 50%;
  bottom: 60px;
  transform: translateX(-50%);
  width: 100vw;
  max-width: 440px;
  padding: 12px;
  z-index: 120;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .list-page-banner-wrapper {
    max-width: 100vw;
    padding-left: 12px;
    padding-right: 12px;
  }
}

.list-page-banner {
  width: 100%;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: 12px;
}

.list-page-banner {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: var(--main02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 50px 0 rgba(51, 56, 83, 0.1);
}

.list-page-banner.matched {
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: var(--white);
  border: 1px solid var(--white);
}

.list-page-banner-comment {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: none;
  color: #fff;
  border: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  margin-left: 16px;
  cursor: pointer;
}
</style>
