<template>
  <div class="signup">
    <!-- 로고 + 타이틀 -->
    <img
      src="@/assets/logo.svg"
      class="logo"
      alt="Fin-Sight Logo" />
    <h1 class="title">Fin-Sight</h1>
    <hr />

    <!-- 회원가입 폼 -->
    <form
      @submit.prevent="handleSignUp"
      class="form">
      <!-- 입력 필드 영역 -->
      <div class="card">
        <!-- 아이디 -->
        <InputWithIcon
          icon="fa-user"
          placeholder="아이디"
          v-model="form.userId"
          buttonText="확인"
          :error="!!errors.userId"
          @button-click="checkUserId" />
        <ValidationMessage :message="errors.userId" />

        <!-- 비밀번호 -->
        <InputWithIcon
          icon="fa-lock"
          type="password"
          placeholder="비밀번호"
          v-model="form.password"
          :error="!!errors.password" />
        <ValidationMessage :message="errors.password" />

        <!-- 비밀번호 재확인 -->
        <InputWithIcon
          icon="fa-lock"
          type="password"
          placeholder="비밀번호 재확인"
          v-model="form.confirmPassword"
          :error="!!errors.confirmPassword" />
        <ValidationMessage :message="errors.confirmPassword" />
      </div>

      <div class="card">
        <!-- 이름 -->
        <InputWithIcon
          icon="fa-user"
          placeholder="이름"
          v-model="form.name" />

        <!-- 닉네임 -->
        <InputWithIcon
          icon="fa-user"
          placeholder="닉네임"
          v-model="form.nickname"
          buttonText="확인"
          :error="!!errors.nickname"
          @button-click="checkNickname" />
        <ValidationMessage :message="errors.nickname" />

        <!-- 생년월일 -->
        <InputWithIcon
          icon="fa-calendar"
          placeholder="생년월일 8자리"
          v-model="form.birth"
          :error="!!errors.birth" />
        <ValidationMessage :message="errors.birth" />

        <!-- 이메일 -->
        <InputWithIcon
          icon="fa-envelope"
          placeholder="이메일"
          v-model="form.email"
          buttonText="인증"
          :error="!!errors.email"
          @button-click="requestCode" />
        <ValidationMessage :message="errors.email" />
      </div>

      <!-- 인증코드 -->
      <div class="card">
        <VerificationCodeInput
          v-model="form.code"
          :error="!!errors.code"
          @verify="verifyCode" />
        <ValidationMessage :message="errors.code" />
      </div>

      <!-- 가입 버튼 -->
      <button
        type="submit"
        class="submit-button">
        가입하기
      </button>
    </form>

    <!-- 가입 완료 팝업 -->
    <CompleteModal v-if="showModal" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import InputWithIcon from '@/components/signUpPage/InputWithIcon.vue';
import VerificationCodeInput from '@/components/signUpPage/VerificationCodeInput.vue';
import ValidationMessage from '@/components/signUpPage/ValidationMessage.vue';
import CompleteModal from '@/components/signUpPage/CompleteModal.vue';

const form = reactive({
  userId: '',
  password: '',
  confirmPassword: '',
  name: '',
  nickname: '',
  birth: '',
  email: '',
  code: ''
});

const errors = reactive({
  userId: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  birth: '',
  email: '',
  code: ''
});

const showModal = ref(false);

const handleSignUp = () => {
  // TODO: 유효성 검사 및 API 연동
  console.log('회원가입 정보:', form);
  showModal.value = true;
};

// TODO: 아래 함수들 전부 유효성 검사 필요
const checkUserId = () => console.log('아이디 중복확인');
const checkNickname = () => console.log('닉네임 중복확인');
const requestCode = () => console.log('이메일 인증코드 요청');
const verifyCode = () => console.log('인증코드 확인');
</script>

<style scoped>
.signup {
  max-width: 460px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
}
.logo {
  width: 60px;
  margin: 0 auto 8px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #151f3e;
}
hr {
  border: none;
  height: 2px;
  background: #f97b6d;
  margin: 16px 0 24px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.card {
  background: #fff;
  padding: 0;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}
.submit-button {
  height: 50px;
  background: #151f3e;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 10px;
  cursor: pointer;
}
</style>
