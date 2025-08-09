import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    getToken: state => state.token
  },

  actions: {
    setToken(token) {
      this.token = token;
      // 로컬 스토리지에 토큰 저장
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    },

    setUser(user) {
      this.user = user;
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth_token');
    },

    // 초기화 시 로컬 스토리지에서 토큰 복원
    initializeAuth() {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        this.token = savedToken;
      }
    }
  }
});
