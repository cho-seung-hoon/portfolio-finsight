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
    <div>찜한 목록</div>
    <div class="subItem-user">
      <UserMgmt />
    </div>
  </div>
</template>

<script setup>
import UserInfo from '@/components/my/UserInfo.vue';
import UserInvt from '@/components/my/UserInvt.vue';
import UserMgmt from '@/components/my/UserMgmt.vue';
</script>

<style scoped>
.my-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.subItem-img {
  margin-top: calc(-1 * 56px);
  margin-left: -20px;
  width: calc(100% + 40px);
  z-index: 0;
  aspect-ratio: 375 / 180;
  overflow: hidden;
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
