<template>
  <div class="signup">
    <img
      src="@/assets/logo.svg"
      class="logo"
      alt="Fin-Sight Logo" />
    <h1 class="title">Fin-Sight</h1>
    <form
      class="form"
      @submit.prevent="handleSignUp">
      <!-- 아이디, 비밀번호 -->
      <div class="card">
        <InputWithIcon
          v-model="form.userId"
          icon="fa-user"
          placeholder="아이디"
          button-text="확인"
          :error="!!errors.userId"
          :valid="status.userIdChecked && !errors.userId"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          @button-click="checkUserId"
          @focus="clearError('userId')" />
        <InputWithIcon
          v-model="form.password"
          icon="fa-lock"
          type="password"
          placeholder="비밀번호"
          :error="!!errors.password"
          :valid="form.password?.length > 0 && !errors.password"
          @blur="validatePassword"
          @focus="clearError('password')" />
        <InputWithIcon
          v-model="form.confirmPassword"
          icon="fa-lock"
          type="password"
          placeholder="비밀번호 재확인"
          :error="!!errors.confirmPassword"
          :valid="form.confirmPassword?.length > 0 && !errors.confirmPassword"
          @blur="validateConfirmPassword"
          @focus="clearError('confirmPassword')" />
      </div>

      <!-- ✅ 에러 메시지 통합 표시 -->
      <div class="validation-block">
        <ValidationMessage :message="errors.userId" />
        <ValidationMessage :message="errors.password" />
        <ValidationMessage :message="errors.confirmPassword" />
      </div>

      <!-- 이름, 닉네임, 생년월일, 이메일 -->
      <div class="card">
        <InputWithIcon
          v-model="form.name"
          icon="fa-user"
          placeholder="이름"
          :error="!!errors.name"
          :valid="form.name?.trim().length > 0 && !errors.name"
          @blur="validateName"
          @focus="clearError('name')" />

        <!-- <InputWithIcon
          v-model="form.nickname"
          icon="fa-user"
          placeholder="닉네임"
          button-text="확인"
          :error="!!errors.nickname"
          :valid="form.nickname?.trim().length > 0 && status.nicknameChecked && !errors.nickname"
          @button-click="checkNickname"
          @blur="validateNickname"
          @focus="clearError('nickname')" /> -->

        <InputWithIcon
          v-model="form.birth"
          icon="fa-calendar"
          placeholder="생년월일 8자리"
          :error="!!errors.birth"
          :valid="form.birth?.length > 0 && !errors.birth"
          @blur="validateBirth"
          @focus="clearError('birth')" />

        <InputWithIcon
          v-model="form.email"
          icon="fa-envelope"
          placeholder="이메일"
          button-text="인증"
          :error="!!errors.email"
          :valid="emailStore.verified && !errors.email"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          @button-click="requestCode"
          @focus="clearError('email')" />
      </div>

      <!-- ✅ 에러 메시지 통합 표시 -->
      <div class="validation-block">
        <!-- <ValidationMessage :message="errors.nickname" /> -->
        <ValidationMessage :message="errors.birth" />
        <ValidationMessage :message="errors.email" />
        <ValidationMessage :message="errors.name" />
      </div>

      <!-- 인증코드 입력 -->
      <div class="card">
        <VerificationCodeInput
          v-model="form.code"
          :error="!!errors.code"
          :valid="emailStore.verified && !errors.code"
          :disabled="!status.codeRequested"
          @verify="verifyCode"
          @resend="resendCode"
          @blur="validateCode"
          @focus="clearError('code')" />
      </div>

      <div class="validation-block">
        <ValidationMessage :message="errors.code" />
      </div>

      <button
        type="submit"
        class="submit-button">
        가입하기
      </button>
    </form>

    <BaseModal
      message="회원 가입 완료"
      :visible="showCompleteModal"
      redirect="/login"
      :onClose="() => (showCompleteModal = false)"
      :showIcon="true" />

    <BaseModal
      :message="modalMessage"
      :visible="showModal"
      :onClose="() => (showModal = false)" />
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { signUpUser, checkUserIdExists } from '@/api/user';
import { useEmailStore } from '@/stores/emailStore';

import InputWithIcon from '@/components/signUpPage/InputWithIcon.vue';
import VerificationCodeInput from '@/components/signUpPage/VerificationCodeInput.vue';
import ValidationMessage from '@/components/signUpPage/ValidationMessage.vue';
import BaseModal from '@/components/common/BaseModal.vue';

const emailStore = useEmailStore();

onMounted(() => {
  form.email = '';
  form.code = '';
  emailStore.email = '';
  emailStore.code = '';
  emailStore.verified = false;
});

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
  codeVerified: false,
  codeRequested: false
});

const showCompleteModal = ref(false);
const showModal = ref(false);
const modalMessage = ref('');
const openModal = msg => {
  modalMessage.value = msg;
  showModal.value = true;
};

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
    await signUpUser(payload);
    showCompleteModal.value = true;
  } catch (error) {
    openModal(
      error.response?.status === 400
        ? '회원가입 실패: 중복 항목이 있거나 이메일 인증이 완료되지 않았습니다.'
        : '서버 오류가 발생했습니다.'
    );
  }
};

const validateForm = () => {
  let isValid = true;
  if (!validateUserId()) isValid = false;
  if (!validatePassword()) isValid = false;
  if (!validateConfirmPassword()) isValid = false;
  if (!validateName()) isValid = false;
  // if (!validateNickname()) isValid = false;
  if (!validateBirth()) isValid = false;
  if (!validateEmail()) isValid = false;
  if (!emailStore.verified) {
    errors.code = '• 이메일 인증을 완료해주세요.';
    isValid = false;
  }
  return isValid;
};

const validateUserId = () => {
  if (!form.userId) return ((errors.userId = '• 아이디를 입력해주세요.'), false);
  if (!/^[a-z0-9]{5,20}$/.test(form.userId)) {
    errors.userId = '• 5~20자의 영문 소문자, 숫자만 사용 가능합니다.';
    return false;
  }
  return true;
};
const validatePassword = () => {
  const pw = form.password;
  const rules = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/];
  const ruleCount = rules.filter(r => r.test(pw)).length;
  if (!pw) return ((errors.password = '• 비밀번호를 입력해주세요.'), false);
  if (pw.length < 10 || ruleCount < 2) {
    errors.password =
      '• 영문 대/소문자, 숫자, 특수문자 중 2종 이상 조합으로\n10자 이상이어야 합니다.';
    return false;
  }
  return true;
};
const validateConfirmPassword = () => {
  if (!form.confirmPassword)
    return ((errors.confirmPassword = '• 비밀번호 재확인을 입력해주세요.'), false);
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '• 비밀번호가 일치하지 않습니다.';
    return false;
  }
  return true;
};

// const validateName = () => {
//   const name = form.name?.trim() || '';
//   if (name === '') return ((errors.name = '● 이름을 입력해주세요.'), false);
//   if (!/^[가-힣]{2,5}$/.test(name)) {
//     errors.name = '● 이름은 2~5자의 한글만 입력 가능합니다.';
//     return false;
//   }
//   return true;
// };

const validateName = () => {
  const name = form.name?.trim() || '';
  if (name === '') {
    errors.name = '• 이름을 입력해주세요.';
    return false;
  }

  const isKoreanOnly = /^[가-힣]{2,10}$/.test(name);
  const isEnglishOnly = /^[a-zA-Z]{2,20}$/.test(name);

  if (isKoreanOnly) {
    if (name.length < 2 || name.length > 5) {
      errors.name = '• 한글 이름은 2~5자 사이로 입력해주세요.';
      return false;
    }
    return true;
  }

  if (isEnglishOnly) {
    if (name.length < 2 || name.length > 20) {
      errors.name = '• 영문 이름은 2~20자 사이로 입력해주세요.';
      return false;
    }
    return true;
  }

  errors.name = '• 올바른 이름을 입력해주세요.';
  return false;
};

const validateNickname = () => {
  const nickname = form.nickname?.trim() || '';
  if (nickname === '') return ((errors.nickname = '• 닉네임을 입력해주세요.'), false);
  if (!/^[가-힣a-zA-Z0-9]{2,10}$/.test(nickname)) {
    errors.nickname = '• 닉네임은 2~10자의 한글, 영문, 숫자만 입력 가능합니다.';
    return false;
  }
  return true;
};

// const validateBirth = () => {
//   if (!form.birth) return ((errors.birth = '• 생년월일을 입력해주세요.'), false);
//   if (!/^\d{8}$/.test(form.birth)) {
//     errors.birth = '• 생년월일은 8자리 숫자로 입력해 주세요.';
//     return false;
//   }
//   return true;
// };

const validateBirth = () => {
  const today = new Date();

  // 1. 입력 여부 체크
  if (!form.birth) {
    errors.birth = '• 생년월일을 입력해주세요.';
    return false;
  }

  // 2. 형식 체크 (8자리 숫자)
  if (!/^\d{8}$/.test(form.birth)) {
    errors.birth = '• 생년월일은 8자리 숫자로 입력해 주세요.';
    return false;
  }

  // 3. 날짜 유효성 체크
  const year = parseInt(form.birth.substring(0, 4), 10);
  const month = parseInt(form.birth.substring(4, 6), 10);
  const day = parseInt(form.birth.substring(6, 8), 10);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    errors.birth = '• 존재하지 않는 날짜입니다.';
    return false;
  }

  // 4. 미래 날짜 방지
  if (date > today) {
    errors.birth = '• 미래 날짜는 입력할 수 없습니다.';
    return false;
  }

  // 통과
  errors.birth = '';
  return true;
};

const validateEmail = () => {
  if (!form.email) return ((errors.email = '• 이메일을 입력해주세요.'), false);
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(form.email)) return ((errors.email = '• 올바른 이메일 형식이 아닙니다.'), false);
  return true;
};
const validateCode = () => {
  if (!form.code) return ((errors.code = '• 인증코드를 입력해주세요.'), false);
  return true;
};

const checkUserId = async () => {
  if (!validateUserId()) return;
  try {
    const res = await checkUserIdExists(form.userId);
    if (res.data === true) {
      errors.userId = '• 이미 사용 중인 아이디입니다.';
      status.userIdChecked = false;
    } else {
      errors.userId = '';
      status.userIdChecked = true;
    }
  } catch {
    errors.userId = '• 아이디 중복 확인 실패';
    status.userIdChecked = false;
  }
};

const requestCode = async () => {
  if (!validateEmail()) return;
  emailStore.email = form.email;
  try {
    const msg = await emailStore.sendCode();
    status.codeRequested = true; // ✅ 전송 성공 후에만 활성화
    errors.code = '';
    openModal(msg);
  } catch {
    status.codeRequested = false;
    openModal(emailStore.error || '인증코드 전송 실패');
  }
};

const verifyCode = async () => {
  if (!status.codeRequested) {
    errors.code = '• 먼저 이메일로 인증코드를 받아주세요.';
    return false;
  }
  if (!form.email || !form.code) {
    errors.code = '• 이메일과 인증코드를 모두 입력해주세요.';
    return false;
  }
  emailStore.email = form.email;
  emailStore.code = form.code;
  errors.code = '';
  await emailStore.verifyCode();
  if (!emailStore.verified) {
    errors.code = emailStore.error || '• 인증코드가 일치하지 않습니다.';
    status.codeVerified = false;
    openModal(errors.code);
    return false;
  }
  status.codeVerified = true;
  openModal('이메일 인증 성공!');
  return true;
};

const resendCode = async () => {
  if (!validateEmail()) return;
  if (!status.codeRequested) {
    // 아직 최초 전송 안 했으면 최초 전송으로 유도
    return requestCode();
  }
  emailStore.email = form.email;

  try {
    const msg = await emailStore.sendCode();
    openModal('인증코드가 다시 전송되었습니다.');
  } catch {
    openModal('인증코드 재전송 실패');
  }
};

// ✅ watch: 입력 변경 시 상태 초기화
watch(
  () => form.userId,
  () => (status.userIdChecked = false)
);
watch(
  () => form.nickname,
  () => (status.nicknameChecked = false)
);
watch(
  () => form.email,
  () => {
    emailStore.verified = false;
    status.codeVerified = false;
    status.codeRequested = false; // ✅ 이메일 변경 시 초기화
    form.code = ''; // ✅ 값 초기화
    errors.code = ''; // ✅ 에러도 초기화
  }
);

watch(
  () => form.code,
  () => (status.codeVerified = false)
);
</script>

<style scoped>
.signup {
  min-height: 100dvh;
  width: 100%;
  height: 100%;
  text-align: center;
  /* position: relative; */
  padding: 20px 0 60px 0;
  justify-items: center;
}

.logo {
  width: 60px;
  margin: 0 auto 8px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #151f3e;
  margin-bottom: 20px;
}

hr {
  border: none;
  height: 2px;
  background: #f97b6d;
  margin: 16px 0 24px;
}

.form {
  max-width: 340px;
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

.validation-block {
  text-align: left;
  padding-left: 12px;
}
</style>
