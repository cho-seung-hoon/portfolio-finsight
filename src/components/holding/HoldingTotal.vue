<template>
  <div class="holding-total-box">
    <div class="total-title">투자 모아보기</div>
    <div class="total-calc">
      <span class="total-deposit"></span>
      <span class="total-domestic"></span>
      <span class="total-overseas"></span>
    </div>

    <div class="total-info">
      <div class="total-info-icon deposit-icon">
        <img
          src="@/assets/logo.svg"
          alt="임시 이미지" />
      </div>
      <div class="total-info-detail">
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-1">정기예금</div>
          <div class="total-info-detail-item-1">{{ depositByUserId }}원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">{{ depTotal }} %</div>
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
          <div class="total-info-detail-item-1">국내 투자</div>
          <div class="total-info-detail-item-1">{{ domesticByUserId }}원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">{{ domeTotal }} %</div>
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
          <div class="total-info-detail-item-1">해외 투자</div>
          <div class="total-info-detail-item-1">{{ foreignByUserId }}원</div>
        </div>
        <div class="total-info-detail-item">
          <div class="total-info-detail-item-2">{{ foreiTotal }} %</div>
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

//  === 양지윤 ==================
import axios from 'axios';
import { ref } from 'vue';

const depositByUserId = ref(null);
const domesticByUserId = ref(null);
const foreignByUserId = ref(null);

const total = depositByUserId + domesticByUserId + foreignByUserId;
const depTotal = (depositByUserId / total) * 100;
const domeTotal = (domesticByUserId / total) * 100;
const foreiTotal = (foreignByUserId / total) * 100;



const getAllPrice = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      'http://localhost:8080/holdings/',
      {
        headers: { Authorization: `Bearer ${token}`,
        }
    });
    depositByUserId.value = response.data.depositByUserId;
    domesticByUserId.value = response.data.domesticByUserId;
    foreignByUserId.value = response.data.foreignByUserId;

    console.log('정기예금: ', depositByUserId.value)
    console.log('국내 투자상품: ', domesticByUserId.value)
    console.log('해외 투자상품: ', foreignByUserId.value)
    

  } catch (error) {
    console.error('투자모아보기 가져오기 실패:', error);
    depositByUserId.value = 0; // 에러 시 0으로 대체
    domesticByUserId.value = 0; // 에러 시 0으로 대체
    foreignByUserId.value = 0; // 에러 시 0으로 대체
  }
};

onMounted(() => {
  getAllPrice();
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
