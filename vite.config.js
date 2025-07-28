import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/exchange': {
        target: 'https://oapi.koreaexim.go.kr',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/exchange/, '/site/program/financial/exchangeJSON')
      },
      // ✅ 백엔드 API 프록시 추가
      '/users': {
        target: 'http://localhost:8080', // Spring 서버 주소
        changeOrigin: true,
        secure: false
      }
<<<<<<< HEAD
    },
    host: true
=======
    }
    ,host: true,
>>>>>>> 6e06ac8bf1958b55b993773a0d4ce6a493230e19
  }
});
