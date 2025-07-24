<template>
  <div class="subBox">
    <div class="subItem-title">
      나의 투자 성향
    </div>
    <div class="subItem-content">
      <div class="invt">
          안정형
      </div>
      <div class="invtTest">
          테스트 버튼
      </div>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.subBox{
  margin: 30px 0;
  background-color: var(--white);
  border-radius: 8px;
  height: 100px;
  padding:20px;
}

.subItem-title{
  color:var(--main02);
  font-size:var(--font-size-sm);

}

.subItem-content{
  margin:10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invt{
  font-size:var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color:var(--mint01);
}

</style>