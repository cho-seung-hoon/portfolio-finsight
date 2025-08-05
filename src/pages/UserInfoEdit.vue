<template>
<!-- Title Section start -->
<br>
<div class="user-edit-container">
    <h2 class="title">
        <img src="@/assets/logo.svg" class="logo" alt="Fin-Sight Logo" />
        <p>Fin-Sight</p>
    </h2><br>
    <!-- 회원이름 (변경 X) -->
    <div class="subItem1">
        <i class="fa fa-user"></i>
        <span class="subItem2">나의 이름: </span>
        <span class="subItem2">{{ UserInfoA.userName }}</span>
    </div>
    <br>
    <div class="subItem1">
        <i class="fa fa-user"></i>
        <span class="subItem2">나의 아이디: </span>
        <span class="subItem3">{{ UserInfoA.userId }}</span>
    </div>
    <hr class="subLine"/>

    <!-- 비밀번호/이메일 PUT 요청 보내기 -->
    <form
        class="form"
        @submit.prevent="handleEdit">
    <InputWithIcon
        v-model="form.password"
        icon="fa-lock"
        type="password"
        placeholder="새 비밀번호"
        :error="!!errors.password"
        :valid="form.password?.length >= 8 && !errors.password"
        @blur="validatePassword"
        @focus="clearError('password')" 
    />
    <InputWithIcon
        v-model="form.confirmPassword"
        icon="fa-lock"
        type="password"
        placeholder="새 비밀번호 재확인"
        :error="!!errors.confirmPassword"
        :valid="form.confirmPassword?.length > 0 && !errors.confirmPassword"
        @blur="validateConfirmPassword"
        @focus="clearError('confirmPassword')" 
    />
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
        @focus="clearError('email')"
    /><br>
    <!-- 인증코드 입력 -->
    <div class="card">
        <VerificationCodeInput
            v-model="form.code"
            :error="!!errors.code"
            :valid="emailStore.verified && !errors.code"
            @verify="verifyCode"
            @resend="resendCode"
            @blur="validateCode"
            @focus="clearError('code')" 
        />
    </div>
    <!-- 에러 메시지 통합 표시 -->
    <div class="validation-block">
        <ValidationMessage :message="errors.password" />
        <ValidationMessage :message="errors.confirmPassword" />
        <ValidationMessage :message="errors.email" />
        <ValidationMessage :message="errors.code" />
    </div>


    <!-- 버튼 -->
    <button type="submit" class="submit-btn">수정 완료</button>



    </form>

<button type="button" class="delete-btn" @click="showDeleteModal = true">회원 탈퇴</button>

<!-- 탈퇴 모달 -->
<DeleteUserInfo
    v-if="showDeleteModal"
    @close="showDeleteModal = false"
    @confirm="() => { showDeleteModal = false; handleDelete(); }"
/>
</div>



<!-- 완료/에러 모달 -->
<CompleteModal v-if="showCompleteModal" />
<AlertModal v-if="showModal" :message="modalMessage" @close="showModal = false" />
</template>



<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useEmailStore } from '@/stores/emailStore';
import axios from 'axios';

import InputWithIcon from '@/components/signUpPage/InputWithIcon.vue';
import ValidationMessage from '@/components/signUpPage/ValidationMessage.vue';
import DeleteUserInfo from '@/components/DeleteUserInfo.vue';
import VerificationCodeInput from '@/components/signUpPage/VerificationCodeInput.vue';
import CompleteModal from '@/components/signUpPage/CompleteModal.vue';
import AlertModal from '@/components/signUpPage/AlertModal.vue';

const UserInfoA = ref({ // ✅ 개인정보 GET 호출
    userId: '', 
    userName: ''
});
const getUserInfo = async () => { // ✅ 개인정보 GET 호출
    const token = localStorage.getItem('accessToken');
    try {
    const response = await axios.get('http://localhost:8080/users/info', {
        headers: { Authorization: `Bearer ${token}` },
    });
    UserInfoA.value = response.data.data;
    console.log(UserInfoA.value);
    } catch (e) {
    console.error('유저 정보 불러오기 실패:', e);
    }
};
onMounted(getUserInfo);
const form = reactive({ // ✅ 개인정보 PUT 호출
    password: '',
    confirmPassword: '',
    email: ''
});
const errors = reactive({ // ✅ 통합에러
    userId: '', 
    userName: '',
    password: '',
    confirmPassword: '',
    email: ''
});
const emailStore = useEmailStore();
const validateForm = () => {
    let isValid = true;
    if (!validatePassword()) isValid = false;
    if (!validateConfirmPassword()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!emailStore.verified) {
        errors.code = '● 이메일 인증을 완료해주세요.';
        isValid = false;
    }
    return isValid;
};
const validatePassword = () => {
    const pw = form.password;
    const rules = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/];
    const ruleCount = rules.filter(r => r.test(pw)).length;
    if (!pw) return ((errors.password = '● 비밀번호를 입력해주세요.'), false);
    if (pw.length < 10 || ruleCount < 2) {
        errors.password =
        '● 영문 대/소문자, 숫자, 특수문자 중 2종 이상 조합으로\n10자 이상이어야 합니다.';
        return false;
    }
    return true;
};
const validateConfirmPassword = () => {
    if (!form.confirmPassword)
        return ((errors.confirmPassword = '● 비밀번호 재확인을 입력해주세요.'), false);
    if (form.password !== form.confirmPassword) {
        errors.confirmPassword = '● 비밀번호가 일치하지 않습니다.';
        return false;
    }
    return true;
};
const validateEmail = () => {
    if (!form.email) return ((errors.email = '● 이메일을 입력해주세요.'), false);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(form.email)) return ((errors.email = '● 올바른 이메일 형식이 아닙니다.'), false);
    return true;
};
const validateCode = () => {
    if (!form.code) return ((errors.code = '● 인증코드를 입력해주세요.'), false);
    return true;
};
const requestCode = async () => {
    if (!validateEmail()) return;
    emailStore.email = form.email;
    try {
        const msg = await emailStore.sendCode();
        openModal(msg);
    } catch {
        openModal(emailStore.error || '인증코드 전송 실패');
    }
};
const verifyCode = async () => {
    if (!form.email || !form.code) {
        errors.code = '● 이메일과 인증코드를 모두 입력해주세요.';
        return false;
    }
    emailStore.email = form.email;
    emailStore.code = form.code;
    errors.code = '';
    await emailStore.verifyCode();
    if (!emailStore.verified) {
        errors.code = emailStore.error || '● 인증코드가 일치하지 않습니다.';
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
    emailStore.email = form.email;

    try {
        const msg = await emailStore.sendCode();
        openModal('인증코드가 다시 전송되었습니다.');
    } catch {
        openModal('인증코드 재전송 실패');
    }
};

const status = reactive({
    userIdChecked: false,
    nicknameChecked: false,
    emailVerified: false,
    codeVerified: false
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

// ✅ 회원정보 수정 요청
const handleEdit = async () => {
    resetErrors();
    const valid = await validateForm();
    if (!valid) return;

    try {
        const payload = {
            password: form.password,
            email: form.email
        };
        await axios.post('/users', payload);
        showCompleteModal.value = true;
        console.log('회원정보가 수정되었습니다.')
    } catch (error) {
        openModal(
            error.response?.status === 400
                ? '회원가입 실패: 중복 항목이 있거나 이메일 인증이 완료되지 않았습니다.'
                : '서버 오류가 발생했습니다.'
            );    
        }

    };


// ✅ 회원탈퇴 요청
const handleDelete = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert('로그인 정보가 없습니다.');
        return;
    }

    try {
        await axios.delete('/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        alert('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('accessToken');
        window.location.href = '/start';
    } catch (error) {
        console.error('회원 탈퇴 오류:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
};

const showDeleteModal = ref(false);

</script>

<style scoped>
/* Title Section Styles */
.user-edit-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 24px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.logo {
    width: 60px;
    margin: 0 auto 8px;
    text-align: center;
}
.title {
text-align: center;
margin-bottom: 24px;
font-size: 20px;
font-weight: bold;
color: var(--main01);
}
/* Btn Styles */
.submit-btn {
width: 100%;
margin-top: 20px;
background-color: var(--sub01);
color: var(--white);
border: 1.5px solid var(--sub01);
border-radius: 6px;
padding: 10px;
font-weight: bold;
cursor: pointer;
}
.delete-btn {
width: 100%;
margin-top: 12px;
background-color: var(--main04);
color: var(--main01);
border: 1.5px solid var(--main01);
border-radius: 6px;
padding: 10px;
font-weight: bold;
cursor: pointer;
}

.subItem1 {
    padding: 0px 12px 0px 12px;
}
.fa {
    color: var(--main02);
}
.subItem2 {
    padding-left: 16px;
    color: var(--main01);
    font-family: 'Pretendard';
}
.subLine{
    border-color: var(--main04);
    margin: 10px;
}
.subItem3 {
    margin-left: 5px;
}
.signup {
  /* max-width: 460px; */
  /* margin: 0 auto; */
  /* margin-left: -20px; */
  /* margin-right: -20px; */
  min-height: 100dvh;
  width: 100%;
  height: 100%;
  /* padding: 2rem 1rem; */
  text-align: center;
  /* font-family: 'Pretendard', sans-serif; */
  position: relative; /* ✅ 모달 위치 기준점이 됨 */
  padding-bottom: 40px;
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
.validation-block {
  margin-top: 2px;
  text-align: left;
  padding-left: 12px;
}
</style>