import { defineStore } from 'pinia';
/*import router from '@/router';*/

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),

  getters: {
    /**
     * UI 컴포넌트에서는 이제 이 게터를 사용하여 로그인 여부를 판단합니다.
     * accessToken이 존재하면 true, 없거나 null이면 false를 반환합니다.
     */
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    login(payload) {
      this.accessToken = payload.token;
      this.user = payload.userData;
      /*router.push('/');*/
    },
    logout() {
      this.$reset();
      /*router.push('/login');*/
    },
  },

  // 3. persist 옵션을 수정합니다.
  persist: {
    // key 이름은 'accessToken'으로 지정
    key: 'accessToken',
    // state의 여러 값 중, 'accessToken' 필드만 localStorage에 저장합니다.
    paths: ['accessToken'],
  },
});