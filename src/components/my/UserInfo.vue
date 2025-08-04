<template>
  <div class="subBox2">
    <div class="subItem subItemWrapper">
      <div class="name">{{ userInfo.userName }} 님</div>
      <button @click="goToUserInfoEdit" class="btn">
        <img 
          src="@/assets/userinfo.png"
          class="btn-userinfo"
          alt="회원정보 수정 버튼" />
      </button>
    </div><br>
    <div class="subItem">
      <img
        src="@/assets/logo.svg"
        alt="임시 이미지" />
      <div class="info">이메일</div>
      <div class="infoValue">{{ userInfo.userEmail }}</div>
    </div>
    <div class="subItem">
      <img
        src="@/assets/logo.svg"
        alt="임시 이미지" />
      <div class="info">생년월일</div>
      <div class="infoValue">{{ formatArrayDateToYYYYMMDD(userInfo.userBirthday) }}</div>
    </div>
    <div class="subItem">
      <img
        src="@/assets/logo.svg"
        alt="임시 이미지" />
      <div class="info">가입일</div>
      <div class="infoValue">{{ formatArrayDateTimeToYYYYMMDD(userInfo.userCreatedAt) }}</div>
    </div>
  </div>
</template>

<script setup>
// ✅ 마이페이지에 개인정보 GET 호출하기
import { onMounted, ref } from 'vue';
import axios from 'axios';

const userInfo = ref({
  userName: '',
  userEmail: '',
  userBirthday: '',
  userCreatedAt: '',
});
const fetchUsersInfo = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get('http://localhost:8080/users/info', {
      headers: { Authorization: `Bearer ${token}` },
    });
    userInfo.value = response.data.data;
  } catch (e) {
    console.error('유저 정보 불러오기 실패:', e);
  }
};

const formatArrayDateToYYYYMMDD = (dateArray) => {
  const [year, month, day] = dateArray;
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}`;
};

const formatArrayDateTimeToYYYYMMDD = (dateTimeArray) => {
  // 배열의 첫 세 요소(년, 월, 일)만 사용
  const [year, month, day] = dateTimeArray;

  // 월과 일을 두 자리 숫자로 맞춤 (예: 8 -> 08, 4 -> 04)
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}`;
};

onMounted(fetchUsersInfo);

import { useRouter } from 'vue-router';
const router = useRouter();
const goToUserInfoEdit = () => {
  router.push('/user-info-edit');
};
</script>


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
  font-size: var(--font-size-xxl);
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

.subItemWrapper {
  display: flex;
  justify-content: space-between;
}

.btn {
  background: none;
  border: none;
}
.btn-userinfo {
  border: 2px solid var(--sub01);
  border-radius: 50%;
  object-fit: cover;
  background: none;
  background-color: transparent;
  padding: 0;
  height: 45px;
  width: auto;
}
</style>
