import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    proxy : {
      '/exchange':{
        target: 'https://oapi.koreaexim.go.kr',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/exchange/, '/site/program/financial/exchangeJSON'),
      }
    }
    ,host: true,
  }

});
