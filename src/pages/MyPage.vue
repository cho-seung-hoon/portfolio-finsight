<template>
  <div class="my-box">
    <div class="subItem-img">
      <img
        class="bg-image"
        src="@/assets/my-backgroud.png"
        alt="배경 이미지"
        loading="eager" />
    </div>
    <div class="subItem-info">
      <UserInfo />
    </div>
    <div class="subItem-invt">
      <UserInvt />
    </div>
    <div class="subItem-watch">
      <UserWatch />
    </div>
    <div class="subItem-user">
      <UserMgmt />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import UserInfo from '@/components/my/UserInfo.vue';
import UserInvt from '@/components/my/UserInvt.vue';
import UserMgmt from '@/components/my/UserMgmt.vue';
import UserWatch from '@/components/my/UserWatch.vue';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();

onMounted(async () => {
  // 로딩 상태 초기화
  loadingStore.resetLoading();

  // 로딩 시작
  loadingStore.startLoading('마이페이지 정보를 불러오는 중...');

  // 0.5초 대기 (더미 데이터 로딩 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 500));

  // 로딩 종료
  loadingStore.stopLoading();
});
</script>

<style scoped>
.my-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.subItem-img {
  position: relative;
  margin-top: -56px;
  margin-left: -20px;
  width: calc(100% + 40px);
  overflow: hidden;
  z-index: 0;
}

.bg-image {
  display: block;
  width: 100%;
  height: 100%;
}

.subItem-info {
  margin-left: -20px;
  width: calc(100% + 40px);
}

.subItem-user {
  margin-top: auto;
  padding-bottom: 40px;
}
</style>
