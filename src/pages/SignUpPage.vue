<template>
  <div class="signup">
    <img
      src="@/assets/logo.svg"
      class="logo"
      alt="Fin-Sight Logo" />
    <h1 class="title">Fin-Sight</h1>
    <hr />

    <form
      @submit.prevent="handleSignUp"
      class="form">
      <!-- 아이디, 비밀번호 -->
      <div class="card">
        <InputWithIcon
          icon="fa-user"
          placeholder="아이디"
          v-model="form.userId"
          buttonText="확인"
          :error="!!errors.userId"
          @button-click="checkUserId" />
        <ValidationMessage :message="errors.userId" />

        <InputWithIcon
          icon="fa-lock"
          type="password"
          placeholder="비밀번호"
          v-model="form.password"
          :error="!!errors.password"
          @blur="validatePassword" />
        <ValidationMessage :message="errors.password" />

        <InputWithIcon
          icon="fa-lock"
          type="password"
          placeholder="비밀번호 재확인"
          v-model="form.confirmPassword"
          :error="!!errors.confirmPassword"
          @blur="validateConfirmPassword" />
        <ValidationMessage :message="errors.confirmPassword" />
      </div>

      <!-- 이름, 닉네임, 생년월일, 이메일 -->
      <div class="card">
        <InputWithIcon
          icon="fa-user"
          placeholder="이름"
          v-model="form.name" />

        <InputWithIcon
          icon="fa-user"
          placeholder="닉네임"
          v-model="form.nickname"
          buttonText="확인"
          :error="!!errors.nickname"
          @button-click="checkNickname" />
        <ValidationMessage :message="errors.nickname" />

        <InputWithIcon
          icon="fa-calendar"
          placeholder="생년월일 8자리"
          v-model="form.birth"
          :error="!!errors.birth"
          @blur="validateBirth" />
        <ValidationMessage :message="errors.birth" />

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

      <button
        type="submit"
        class="submit-button">
        가입하기
      </button>
    </form>

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
const receivedCode = ref('123456'); // 예시 코드

const resetErrors = () => Object.keys(errors).forEach(key => (errors[key] = ''));

const handleSignUp = () => {
  resetErrors();
  if (!validateForm()) return;
  console.log('회원가입 정보:', form);
  showModal.value = true;
};

const validateForm = () => {
  let isValid = true;
  if (!validateUserId()) isValid = false;
  if (!validatePassword()) isValid = false;
  if (!validateConfirmPassword()) isValid = false;
  if (!validateNickname()) isValid = false;
  if (!validateBirth()) isValid = false;
  if (!validateEmail()) isValid = false;
  if (!verifyCode()) isValid = false;
  return isValid;
};

const validateUserId = () => {
  if (!form.userId) return ((errors.userId = '아이디를 입력해주세요.'), false);
  if (!/^[a-z0-9]{5,20}$/.test(form.userId)) {
    errors.userId = '5~20자의 영문 소문자, 숫자만 사용 가능합니다.';
    return false;
  }
  return true;
};

const validatePassword = () => {
  const pw = form.password;
  const rules = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/];
  const ruleCount = rules.filter(r => r.test(pw)).length;
  if (!pw) return ((errors.password = '비밀번호를 입력해주세요.'), false);
  if (pw.length < 10 || ruleCount < 2) {
    errors.password =
      '영문 대/소문자, 숫자, 특수문자 중 2종 이상 조합으로\n10자 이상이어야 합니다.';
    return false;
  }
  return true;
};

const validateConfirmPassword = () => {
  if (!form.confirmPassword)
    return ((errors.confirmPassword = '비밀번호 재확인을 입력해주세요.'), false);
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    return false;
  }
  return true;
};

const validateNickname = () => {
  if (!form.nickname) return ((errors.nickname = '닉네임을 입력해주세요.'), false);
  return true;
};

const validateBirth = () => {
  if (!form.birth) return ((errors.birth = '생년월일을 입력해주세요.'), false);
  if (!/^\d{8}$/.test(form.birth)) {
    errors.birth = '생년월일은 8자리 숫자로 입력해 주세요.';
    return false;
  }
  return true;
};

const validateEmail = () => {
  if (!form.email) return ((errors.email = '이메일을 입력해주세요.'), false);
  return true;
};

const verifyCode = () => {
  if (!form.code) return ((errors.code = '인증코드를 입력해주세요.'), false);
  if (form.code !== receivedCode.value) {
    errors.code = '인증코드가 일치하지 않습니다.';
    return false;
  }
  return true;
};

const fakeCheckAPI = async (field, value) => {
  const dummy = {
    userId: ['testuser', 'admin'],
    nickname: ['관리자', '홍길동'],
    email: ['test@example.com']
  };
  return dummy[field]?.includes(value);
};

const checkUserId = async () => {
  if (!validateUserId()) return;
  const exists = await fakeCheckAPI('userId', form.userId);
  errors.userId = exists ? '이미 있는 아이디입니다.' : '';
};

const checkNickname = async () => {
  if (!form.nickname) return (errors.nickname = '닉네임을 입력해주세요.');
  const exists = await fakeCheckAPI('nickname', form.nickname);
  errors.nickname = exists ? '이미 있는 닉네임입니다.' : '';
};

const requestCode = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) return (errors.email = '이메일을 입력해주세요.');
  if (!emailRegex.test(form.email)) return (errors.email = '올바른 이메일 형식이 아닙니다.');
  const exists = await fakeCheckAPI('email', form.email);
  if (exists) return (errors.email = '이미 등록되어 있는 이메일입니다.');
  errors.email = '';
  receivedCode.value = '123456';
  alert('인증코드가 발송되었습니다: 123456');
};
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
  overflow: hidden;
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
