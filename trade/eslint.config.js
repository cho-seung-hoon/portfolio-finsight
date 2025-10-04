const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  // 기본 ESLint 추천 규칙
  js.configs.recommended,

  // Prettier와의 충돌 방지
  prettier,

  // Node.js 환경 설정
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    },
    ignores: [
      'node_modules/**',
      'package-lock.json',
      '.env*',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.log'
    ]
  }
];
