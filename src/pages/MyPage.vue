<template>
  <div class="subBox">
    <div class="subItem-title">
      <div class="title">마이페이지</div>
    </div>
    <div class="subItem-img">
      <img class="bg-image" src="@/assets/my-backgroud.png" alt="배경 이미지" />
    </div>
    <div class="subItem-info">
      <UserInfo/>
    </div>
    <div class="subItem-invt">
      <UserInvt/>
    </div>
    <div class="subItem-user">
      <UserMgmt/>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHeaderStore } from '@/stores/header';
import { onBeforeRouteLeave } from 'vue-router';
import UserInfo from '@/components/my/UserInfo.vue';
import UserInvt from '@/components/my/UserInvt.vue';
import UserMgmt from '@/components/my/UserMgmt.vue';

const headerStore = useHeaderStore();

onMounted(() => {
  headerStore.setHeader({
    titleParts: [{ text: '마이페이지', color: 'var(--white)' }],
    isTransparent: true,
    showBorder: false,
  });
});

onBeforeRouteLeave(() => {
  headerStore.resetHeader();
});
</script>

<style scoped>
.subBox{
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
}

.subItem-title {
  display: flex;
  align-content: center;
  width: 100%;
  height: 56px;
  position: relative;
  z-index: 1;
}

.title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  align-content: center;
  color:var(--white);
}

.subItem-img {
  margin-top: calc(-1 * 56px);
  margin-left: calc(-1 * 20px);
  margin-right: calc(-1 * 20px);
  z-index: 0;
}

.bg-image {
  display: block;
  width: 100%;
}

.subItem-info {
  margin-left: calc(-1 * 20px);
  margin-right: calc(-1 * 20px);
}

.subItem-user {
  margin-top: auto; /* 핵심: 하단으로 밀어냄 */
  padding-bottom: 40px;
}

</style>