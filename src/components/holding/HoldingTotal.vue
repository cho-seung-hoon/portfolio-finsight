<template>
  <div class="holding-total-box">
    <div class="total-title">투자 모아보기</div>
<<<<<<< HEAD
    <div class="total-calc"></div>

    <div class="total-info">
      <div class="total-info-icon">
=======
    <div class="total-calc">
      <span class="total-deposit"></span>
      <span class="total-domestic"></span>
      <span class="total-overseas"></span>
    </div>

    <div class="total-info">
      <div class="total-info-icon deposit-icon">
>>>>>>> fix/#40-holdings
        <img
          src="@/assets/logo.svg"
          alt="임시 이미지" />
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">정기 예금</div>
          <div class="total-info-detail-item-1">5,000,000원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">80%</div>
        </div>
      </div>
    </div>
    <div class="total-info">
      <div class="total-info-icon domestic-icon">
        <img
          src="@/assets/logo.svg"
          alt="임시 이미지" />
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">국내 투자상품</div>
          <div class="total-info-detail-item-1">5,000,000원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">80%</div>
        </div>
      </div>
    </div>
    <div class="total-info">
      <div class="total-info-icon overseas-icon">
        <img
          src="@/assets/logo.svg"
          alt="임시 이미지" />
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
import { onMounted } from 'vue';

onMounted(() => {
  const deposit = 300;
  const domestic = 400;
  const overseas = 300;
  const total = deposit + domestic + overseas;

  const depositEl = document.querySelector('.total-deposit');
  const domesticEl = document.querySelector('.total-domestic');
  const overseasEl = document.querySelector('.total-overseas');

  if (depositEl && domesticEl && overseasEl) {
    depositEl.style.width = `${(deposit / total) * 100}%`;
    domesticEl.style.width = `${(domestic / total) * 100}%`;
    overseasEl.style.width = `${(overseas / total) * 100}%`;
  } else {
    console.warn('⚠️ 일부 요소를 찾지 못했습니다.');
  }
});
</script>

<style scoped>
.holding-total-box {
  border-radius: 8px;
  background-color: var(--white);
  padding: 20px;
  width: 100%;
  border: 1px solid var(--main04);
}
.total-calc {
  display: flex;
  height: 30px;
  background-color: var(--main03);
  margin: 20px 10px 0px 10px;
  border-radius: 12px;
  overflow: hidden;
}
/* 각각의 색상은 자유롭게 변경하세요 */
.total-deposit {
  background-color: #fb8233;
  display: block;
  height: 100%;
}

.total-domestic {
  background-color: #10b9b2;
  display: block;
  height: 100%;
}

.total-overseas {
  background-color: #fab809;
  display: block;
  height: 100%;
}

.total-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.total-info {
  display: flex;
  width: 100%;
  margin-top: 20px;
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
.deposit-icon {
  border: 2px solid #fb8233;
}

.domestic-icon {
  border: 2px solid #10b9b2;
}

.overseas-icon {
  border: 2px solid #fab809;
}

.total-info-icon img {
  width: 30px;
}
.total-info-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 30px;
}

.total-info-detail-item {
  display: flex;
  justify-content: space-between;
}

.total-info-detail-item-1 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semi-bold);
  margin: 5px 0;
}

.total-info-detail-item-2 {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-light);
  margin: 5px 0;
}
</style>
