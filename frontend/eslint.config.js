// eslint.config.js

import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  // 1. 전역으로 무시할 파일 및 폴더 설정
  {
    ignores: ['dist', 'node_modules', '**/*']
  },

  // 2. 전역 언어 옵션 및 환경 설정
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // 3. 기본 ESLint 추천 규칙
  js.configs.recommended,

  // 4. Vue3 추천 규칙 (디버깅 결과로 찾은 올바른 키로 수정)
  // 'flat/recommended'가 올바른 키이며, 배열이므로 전개 구문(...)을 다시 사용합니다.
  ...pluginVue.configs['flat/recommended'],

  // 5. Prettier 추천 규칙 (가장 마지막에 와야 함)
  eslintPluginPrettierRecommended,

  // 6. 추가적인 커스텀 규칙 (필요시)
  {
    rules: {
      // 'vue/multi-word-component-names': 'off'
    }
  }
];
