<template>
  <div class="holding-total-box">
    <div class="total-title">
      투자 모아보기
    </div>
    <div class="total-calc">

    </div>

    <div class="total-info">
      <div class="total-info-icon">
        <img src="@/assets/logo.svg" alt="임시 이미지">
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">정기 예금</div>
          <div class="total-info-detail-item-1">5,000,000원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">80%</div>
          <div class="total-info-detail-item-2">$500.00</div>
        </div>
      </div>
    </div>
    <div class="total-info">
      <div class="total-info-icon">
        <img src="@/assets/logo.svg" alt="임시 이미지">
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">국내 투자상품</div>
          <div class="total-info-detail-item-1">5,000,000원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">80%</div>
          <div class="total-info-detail-item-2">$500.00</div>
        </div>
      </div>
    </div>
    <div class="total-info">
      <div class="total-info-icon">
        <img src="@/assets/logo.svg" alt="임시 이미지">
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">해외 투자상품</div>
          <div class="total-info-detail-item-1">5,000,000원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">80%</div>
          <div class="total-info-detail-item-2">$500.00</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
<style scoped>
.holding-total-box{
  border-radius: 8px;
  background-color: var(--white);
  padding:20px;
  width: 100%;
  border:1px solid var(--main04);
}
.total-calc{
  height: 30px;
  background-color: var(--main03);
  margin: 20px 10px 0px 10px;
  border-radius: 12px;
}

.total-title{
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.total-info{
  display: flex;
  width: 100%;
  margin-top:20px;
  align-items: center;
}

.total-info-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: var(--main04);
  border-radius: 50px;
}

.total-info-icon img {
  width: 30px;
}
.total-info-detail{
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 30px;
}


.total-info-detail-item{
  display: flex;
  justify-content: space-between;
}

.total-info-detail-item-1{
  font-size:var(--font-size-lg);
  font-weight: var(--font-weight-semi-bold);
  margin: 5px 0;
}

.total-info-detail-item-2{
  font-size:var(--font-size-ms);
  font-weight: var(--font-weight-light);
  margin: 5px 0;
}
</style>