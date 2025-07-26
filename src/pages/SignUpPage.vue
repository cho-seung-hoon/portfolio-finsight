<template>
  <div class="signup">
    <img
      src="@/assets/logo.svg"
      class="logo"
      alt="Fin-Sight Logo" />
    <h1 class="title">Fin-Sight</h1>
    <hr />

    <form
      class="form"
      @submit.prevent="handleSignUp">
      <!-- 아이디, 비밀번호 -->
      <div class="card">
        <!-- 아이디 -->
        <InputWithIcon
          v-model="form.userId"
          icon="fa-user"
          placeholder="아이디"
          button-text="확인"
          :error="!!errors.userId"
          :valid="status.userIdChecked && !errors.userId"
          @button-click="checkUserId"
          @focus="clearError('userId')" />
        <ValidationMessage :message="errors.userId" />

        <InputWithIcon
          v-model="form.password"
          icon="fa-lock"
          type="password"
          placeholder="비밀번호"
          :error="!!errors.password"
          :valid="form.password?.length > 0 && !errors.password"
          @blur="validatePassword"
          @focus="clearError('password')" />
        <ValidationMessage :message="errors.password" />

        <InputWithIcon
          v-model="form.confirmPassword"
          icon="fa-lock"
          type="password"
          placeholder="비밀번호 재확인"
          :error="!!errors.confirmPassword"
          :valid="form.confirmPassword?.length > 0 && !errors.confirmPassword"
          @blur="validateConfirmPassword"
          @focus="clearError('confirmPassword')" />
        <ValidationMessage :message="errors.confirmPassword" />
      </div>

      <!-- 이름, 닉네임, 생년월일, 이메일 -->
      <div class="card">
        <InputWithIcon
          v-model="form.name"
          icon="fa-user"
          placeholder="이름"
          :valid="form.name?.length > 0" />

        <!-- 닉네임 -->
        <InputWithIcon
          v-model="form.nickname"
          icon="fa-user"
          placeholder="닉네임"
          button-text="확인"
          :error="!!errors.nickname"
          :valid="status.nicknameChecked && !errors.nickname"
          @button-click="checkNickname"
          @focus="clearError('nickname')" />
        <ValidationMessage :message="errors.nickname" />

        <InputWithIcon
          v-model="form.birth"
          icon="fa-calendar"
          placeholder="생년월일 8자리"
          :error="!!errors.birth"
          :valid="form.birth?.length > 0 && !errors.birth"
          @blur="validateBirth"
          @focus="clearError('birth')" />
        <ValidationMessage :message="errors.birth" />

        <!-- 이메일 -->
        <InputWithIcon
          v-model="form.email"
          icon="fa-envelope"
          placeholder="이메일"
          button-text="인증"
          :error="!!errors.email"
          :valid="emailStore.verified && !errors.email"
          @button-click="requestCode"
          @focus="clearError('email')" />
        <ValidationMessage :message="errors.email" />
      </div>

      <div class="card">
        <!-- 인증코드 -->
        <VerificationCodeInput
          v-model="form.code"
          :error="!!errors.code"
          :valid="emailStore.verified && !errors.code"
          @verify="verifyCode"
          @resend="resendCode"
          @blur="validateCode"
          @focus="clearError('code')" />
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
import { reactive, ref, watch } from 'vue';
import axios from 'axios';
import { useEmailStore } from '@/stores/emailStore';

import InputWithIcon from '@/components/signUpPage/InputWithIcon.vue';
import VerificationCodeInput from '@/components/signUpPage/VerificationCodeInput.vue';
import ValidationMessage from '@/components/signUpPage/ValidationMessage.vue';
import CompleteModal from '@/components/signUpPage/CompleteModal.vue';

const emailStore = useEmailStore();

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

const status = reactive({
  userIdChecked: false,
  nicknameChecked: false,
  emailVerified: false,
  codeVerified: false
});

const showModal = ref(false);

const clearError = field => (errors[field] = '');
const resetErrors = () => Object.keys(errors).forEach(key => (errors[key] = ''));

const formatBirthDate = birth => {
  if (!/^\d{8}$/.test(birth)) return '';
  const y = birth.substring(0, 4);
  const m = birth.substring(4, 6);
  const d = birth.substring(6, 8);
  return `${y}-${m}-${d}`;
};

const handleSignUp = async () => {
  resetErrors();
  const valid = await validateForm();
  if (!valid) return;

  try {
    const payload = {
      userId: form.userId,
      password: form.password,
      username: form.name,
      nickname: form.nickname,
      birthday: formatBirthDate(form.birth),
      email: form.email
    };

    await axios.post('/users', payload);
    showModal.value = true;
  } catch (error) {
    if (error.response?.status === 400) {
      alert('회원가입 실패: 중복 항목이 있거나 이메일 인증이 완료되지 않았습니다.');
    } else {
      alert('서버 오류가 발생했습니다.');
    }
  }
};

const validateForm = () => {
  let isValid = true;
  if (!validateUserId()) isValid = false;
  if (!validatePassword()) isValid = false;
  if (!validateConfirmPassword()) isValid = false;
  if (!validateNickname()) isValid = false;
  if (!validateBirth()) isValid = false;
  if (!validateEmail()) isValid = false;

  // ✅ 이메일 인증 여부만 확인
  if (!emailStore.verified) {
    errors.code = '이메일 인증을 완료해주세요.';
    isValid = false;
  }

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
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(form.email)) return ((errors.email = '올바른 이메일 형식이 아닙니다.'), false);
  return true;
};

const validateCode = () => {
  if (!form.code) return ((errors.code = '인증코드를 입력해주세요.'), false);
  return true;
};

const checkUserId = async () => {
  if (!validateUserId()) return;
  try {
    const res = await axios.get('/users', { params: { userid: form.userId } });
    if (res.data === true) {
      errors.userId = '이미 사용 중인 아이디입니다.';
      status.userIdChecked = false;
    } else {
      errors.userId = '';
      status.userIdChecked = true;
    }
  } catch {
    errors.userId = '아이디 중복 확인 실패';
    status.userIdChecked = false;
  }
};

const checkNickname = async () => {
  if (!form.nickname) return (errors.nickname = '닉네임을 입력해주세요.');
  try {
    const res = await axios.get('/users', { params: { nickname: form.nickname } });
    if (res.data === true) {
      errors.nickname = '이미 사용 중인 닉네임입니다.';
      status.nicknameChecked = false;
    } else {
      errors.nickname = '';
      status.nicknameChecked = true;
    }
  } catch {
    errors.nickname = '닉네임 중복 확인 실패';
    status.nicknameChecked = false;
  }
};

const requestCode = async () => {
  if (!validateEmail()) return;
  emailStore.email = form.email;
  try {
    await emailStore.sendCode();
  } catch {
    if (emailStore.status === 'conflict') {
      errors.email = emailStore.error; // "이미 가입된 이메일입니다."
    } else {
      errors.email = '인증코드 전송 실패';
    }
  }
};

const verifyCode = async () => {
  // 1. 기본 유효성 검사
  if (!form.email) {
    errors.email = '이메일을 입력해주세요.';
    return false;
  }

  if (!form.code) {
    errors.code = '인증코드를 입력해주세요.';
    return false;
  }

  // 2. emailStore에 값 설정
  emailStore.email = form.email;
  emailStore.code = form.code;

  // 3. 상태 초기화 (이전 실패 흔적 제거)
  errors.code = '';
  errors.email = '';

  console.log('📤 인증 요청 → email:', form.email, 'code:', form.code);

  // 4. 실제 인증 요청
  await emailStore.verifyCode();

  // 5. 결과 처리
  if (!emailStore.verified) {
    errors.code = emailStore.error || '인증코드가 일치하지 않습니다.';
    status.codeVerified = false;
    return false;
  }
  status.codeVerified = true;
  return true;
};

const resendCode = async () => {
  if (!validateEmail()) return;
  emailStore.email = form.email;

  try {
    await emailStore.sendCode();
    alert('인증코드가 다시 전송되었습니다.');
  } catch {
    errors.email = '인증코드 재전송 실패';
  }
};

// ✅ watch: 입력 변경 시 상태 초기화
watch(
  () => form.userId,
  () => {
    status.userIdChecked = false;
  }
);
watch(
  () => form.nickname,
  () => {
    status.nicknameChecked = false;
  }
);
watch(
  () => form.email,
  () => {
    emailStore.verified = false;
  }
);
watch(
  () => form.code,
  () => {
    status.codeVerified = false;
  }
);
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
