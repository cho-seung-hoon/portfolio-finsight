import axios from 'axios';
import { useSessionStore } from '@/stores/session'; // 1. Pinia 스토어를 임포트합니다.

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use(
  (config) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${sessionStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;