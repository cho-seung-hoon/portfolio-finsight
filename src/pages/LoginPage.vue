<template>
  <div class="login">
    <div class="login-container">
      <!-- 로고 섹션 -->
      <div class="logo-section">
        <div class="logo-icon">
          <IconLogo class="logo-svg"/>
        </div>
        <h1 class="logo-text">Fin-Sight</h1>
      </div>

      <!-- 로그인 폼 -->
      <div class="form-container">
        <!-- ID 입력 -->
        <div class="input-group">
          <label class="input-label">ID</label>
          <input
            v-model="formData.id"
            type="text"
            placeholder="아이디"
            class="custom-input"
            @keypress="handleKeyPress" />
        </div>

        <!-- 비밀번호 입력 -->
        <div class="input-group">
          <label class="input-label">PW</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="비밀번호"
            class="custom-input"
            @keypress="handleKeyPress" />
        </div>

        <!-- 에러 메시지 -->
        <div class="error-container">
          <div
            v-if="errorMessage"
            class="error-message">
            {{ errorMessage }}
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <button
          class="login-btn"
          @click="handleLogin">
          로그인
        </button>

        <!-- 회원가입 링크 -->
        <button
          class="signup-link"
          @click="handleSignup">
          회원가입
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { computed, reactive, ref } from 'vue';

import IconLogo from '@/components/icons/IconLogo.vue';

const formData = reactive({
  id: '',
  password: ''
});

const errorMessage = ref('');

const isFormValid = computed(() => {
  return formData.id.trim() && formData.password.trim();
});

const validateForm = () => {
  if (!formData.id.trim()) {
    errorMessage.value = '아이디를 입력해주세요.';
    return false;
  }
  if (!formData.password.trim()) {
    errorMessage.value = '비밀번호를 입력해주세요.';
    return false;
  }
  return true;
};

const handleLogin = async () => {
  errorMessage.value = '';
  if (!validateForm()) return;

  try {
    const response = await axios.post('http://localhost:8080/users/login', {
      userId: formData.id,
      password: formData.password
    });

    if (response.data.success) {
      const accessToken = response.data.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      // router.push('/');

      // === goToInvTestMainPage start 양지윤 ====================================== //
      // ✅ 토큰을 Authorization 헤더에 담아 사용자 정보 요청
      console.log('accessToken 입니다. :', accessToken);
      const userInfoResponse = await axios.get('http://localhost:8080/users/me', { // 경로를 보내야함. 예: 'http://localhost:8080/users/me'
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      const userRole = userInfoResponse.data.data.userRole;
      localStorage.setItem('userRole', userRole);
      console.log('userRole', userRole);

      // ✅ 역할에 따라 라우팅
      if (userRole === 'COMPLETE') {
        router.push('/');
      } else {
        router.push('/inv-type-main-page');
      }
    }
    // === goToInvTestMainPage end 양지윤 ====================================== //
  } catch (error) {
    if (error.response && error.response.status === 400) {
      errorMessage.value = error.response.data?.error || '잘못된 요청입니다.';
    } else {
      errorMessage.value = '로그인에 실패하였습니다. 다시 시도해주세요!';
    }
  }
};

const handleSignup = () => {
  router.push('/signup');
};

const handleKeyPress = event => {
  if (event.key === 'Enter' && isFormValid.value) {
    handleLogin();
  }
};
</script>

<style scoped>
.login {
  margin-left: -20px;
  margin-right: -20px;
}

.login-container {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content:flex-start;
  align-items: center;
  background: var(--main01);
  padding: 70px 20px;

  position: relative;
}

.logo-section {
  text-align: center;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 85px;
  height: 85px;
  margin: 0 auto;
  color: var(--sub01);
}

.logo-svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  letter-spacing:-1px;
  color: var(--white);
}

.form-container {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  color: var(--white);
  font-size: var(--font-size-ms);
  margin-bottom: 0.5rem;
}

.custom-input {
  padding: 1rem;
  border: 1.2px solid var(--main05);
  border-radius: 8px;
  background: transparent;
  color: var(--white);
  font-size: var(--font-size-md);
}

.custom-input::placeholder {
  color: var(--main02);
}

.error-container {
  min-height: 35px;
}

.error-message {
  color: var(--text-red);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  text-align: center;
  background: var(--red02);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--red01);
}

.login-btn,
.signup-link {
  padding: 1rem;
  border-radius: 8px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  cursor: pointer;
  transition: 0.3s;
}

.login-btn {
  background: var(--sub01);
  color: var(--white);
  border: none;
}

.signup-link {
  background: transparent;
  color: var(--sub01);
  border: none;
}

</style>
