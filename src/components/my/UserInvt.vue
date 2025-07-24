<template>
  <div class="subBox2">
    <div class="subItem-title">
      나의 투자 성향
    </div>
    <div class="subItem-content">
      <div class="invt">
          안정형
      </div>
      <button class="invtTest">
          투자 성향 분석
      </button>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.subBox2{
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

button {
  all: unset;
  padding: 6px 10px;
  background-color: var(--sub01);
  color:var(--white);
  font-size: var(--font-size-ms);
  cursor: pointer;
  border-radius: 6px;
}


.invt{
  font-size:var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color:var(--mint01);
}

</style>