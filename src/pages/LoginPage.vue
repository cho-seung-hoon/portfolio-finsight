<template>
  <div class="login-container">
    <!-- 로고 섹션 -->
    <div class="logo-section">
      <div class="logo-icon">
        <img
          :src="logoSrc"
          alt="Fin-Sight Logo"
          class="logo-svg" />
      </div>
      <h1 class="logo-text">Fin-Sight</h1>
    </div>

    <!-- 로그인 폼 -->
    <div class="form-container">
      <!-- ID 입력 -->
      <div class="input-group">
        <label class="input-label">ID</label>
        <input
          type="text"
          v-model="formData.id"
          @keypress="handleKeyPress"
          placeholder="아이디"
          class="custom-input" />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="input-group">
        <label class="input-label">PW</label>
        <input
          type="password"
          v-model="formData.password"
          @keypress="handleKeyPress"
          placeholder="비밀번호"
          class="custom-input" />
      </div>

      <!-- 에러 메시지 영역 (하단 고정) -->
      <div class="error-container">
        <div
          v-if="errorMessage"
          class="error-message">
          {{ errorMessage }}
        </div>
      </div>

      <!-- 로그인 버튼 -->
      <button
        @click="handleLogin"
        class="login-btn">
        로그인
      </button>

      <!-- 회원가입 링크 -->
      <button
        @click="handleSignup"
        class="signup-link">
        회원가입
      </button>

      <div class="cha-icon">
        <img
          :src="chaSrc"
          alt="Fin-Sight cha"
          class="cha-svg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { computed, reactive, ref } from 'vue';
import logoSrc from '@/assets/logo.svg';
import chaSrc from '@/assets/cha2.png';

const formData = reactive({
  id: '',
  password: ''
});

const errorMessage = ref('');

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 유효성 검증
const isFormValid = computed(() => {
  return formData.id.trim().length > 0 && formData.password.trim().length > 0;
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

// 로그인 핸들러
const handleLogin = async () => {
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/users/login', {
      userId: formData.id,
      password: formData.password
    });

    if (response.data.success) {
      const accessToken = response.data.data.accessToken;
      console.log(accessToken);
      localStorage.setItem('accessToken', accessToken);
      router.push('/');
    }
  } catch (error) {
    errorMessage.value = '로그인에 실패하였습니다. 다시 시도해주세요!';
  }
};

// 회원가입 포워드
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
.login-container {
  min-height: 100vh;
  background: var(--main01);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem 1.5rem 2rem;
  position: relative;
  overflow: hidden;
}

.logo-section {
  text-align: center;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 200px;
  height: 200px;
  margin: 0 auto 1rem;
  color: var(--sub01);
}

.logo-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-text {
  font-size: 40px;
  font-weight: var(--font-weight-bold);
  color: var(--white);
  margin: 0;
  letter-spacing: -0.5px;
}

.form-container {
  width: 100%;
  max-width: 320px;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  color: var(--white);
  font-weight: var(--font-weight-medium);
  margin-bottom: 0.5rem;
  font-size: var(--font-size-sm);
}

.custom-input {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 2px solid var(--main03);
  border-radius: 8px;
  color: var(--white);
  font-size: var(--font-size-md);
  transition: all 0.3s ease;
}

.custom-input::placeholder {
  color: var(--main02);
}

.custom-input:focus {
  outline: none;
  border-color: var(--sub01);
  box-shadow: 0 0 0 3px rgba(250, 135, 114, 0.1);
}

.error-container {
  min-height: 35px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.login-btn {
  width: 100%;
  padding: 1rem;
  background: var(--sub01);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.login-btn:hover {
  background: var(--sub01);
  transform: translateY(-1px);
  opacity: 0.9;
}

.login-btn:active {
  transform: translateY(0);
}

.signup-link {
  display: block;
  width: 100%;
  background: transparent;
  color: var(--sub01);
  border: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: var(--sub01);
  text-decoration: underline;
  opacity: 0.8;
}
.cha-icon {
  width: 320px;
  height: 500px;
  margin: 0 auto 1rem;
  color: var(--sub01);
}

.cha-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 모바일 반응형 */
@media (max-width: 480px) {
  .login-container {
    padding: 3rem 1rem 1.5rem;
  }

  .form-container {
    max-width: 280px;
  }

  .logo-text {
    font-size: var(--font-size-xl);
  }

  .logo-section {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
}
</style>
