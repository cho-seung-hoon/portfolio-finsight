<template>
  <div class="subBox2">
    <div class="subItem">
      <div class="name">이진욱 님</div>
      <div class="edit"></div>
    </div>

    <div class="subItem">
      <img
        src="@/assets/logo.svg"
        alt="임시 이미지" />
      <div class="info">닉네임</div>
      <div class="infoValue">OOO</div>
    </div>
    <div class="subItem">
      <img
        src="@/assets/logo.svg"
        alt="임시 이미지" />
      <div class="info">이메일</div>
      <div class="infoValue">OOO@OOO.OOO</div>
    </div>
    <div class="subItem">
      <img
        src="@/assets/logo.svg"
        alt="임시 이미지" />
      <div class="info">생년월일</div>
      <div class="infoValue">OOOO.OO.OO</div>
    </div>
    <div class="subItem">
      <img
        src="@/assets/logo.svg"
        alt="임시 이미지" />
      <div class="info">가입일</div>
      <div class="infoValue">OOOO.OO.OO</div>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.subBox2 {
  width: 100%;
  padding: 20px;
  background-color: var(--main01);
}

.subItem {
  margin: 10px 0;
  align-items: center;
  display: flex;
}

.name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semi-bold);
  color: var(--white);
}

.info {
  min-width: 65px;
  font-size: var(--font-size-ms);
  font-width: var(--font-weight-light);
  color: var(--white);
  margin-left: 10px;
  margin-right: 30px;
}

.infoValue {
  font-size: var(--font-size-ms);
  font-width: var(--font-weight-light);
  color: var(--white);
}
img {
  width: 25px;
  margin: 0 5px;
  border: 1px solid var(--white);
}

.infoValue {
  padding-left: 15px;
  border-left: 2px solid var(--white);
}
</style>
