import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';

import holdingRoutes from './holdingRoutes';
import listRoutes from './listRoutes';
import myRoutes from './myRoutes';
import signUpRoutes from './signUpRoutes';
import invtRoutes from '@/router/invtRoutes.js';
import watchRoutes from './watchRoutes';
import searchRoutes from './searchRoutes';
import depositRoutes from './depositRoutes';
import etfRoutes from './etfRoutes';
import fundRoutes from './fundRoutes';
import { useHeaderStore } from '@/stores/header.js';
import sellRoutes from './sellRoutes';
import buyRoutes from './buyRoutes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        header: {
          titleParts: [
            { text: 'OOO', color: 'var(--sub01)' },
            { text: '님, 반갑습니다.', color: 'var(--main01)' }
          ]
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: {
        layout: 'EmptyLayout'
      }
    },
    ...holdingRoutes,
    ...listRoutes,
    ...myRoutes,
    ...signUpRoutes,
    ...invtRoutes,
    ...watchRoutes,
    ...searchRoutes,
    ...depositRoutes,
    ...etfRoutes,
    ...fundRoutes,
    ...sellRoutes,
    ...buyRoutes
  ]
});

router.beforeEach((to, from, next) => {
  const headerStore = useHeaderStore();
  const headerMeta = to.meta.header;
  const requiresAuth = to.meta.requiresAuth;
  const isLoggedIn = !!localStorage.getItem('token');

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
    return;
  }

  if (headerMeta && headerMeta !== 'none') {
    const options = typeof headerMeta === 'function' ? headerMeta(to) : { ...headerMeta };

    // 커스텀 backHandler가 경로로 지정된 경우, 실제 함수로 변환
    if (options.backHandler && typeof options.backHandler !== 'function') {
      const backTarget = options.backHandler;
      console.log('backTarget: ', backTarget);
      options.backHandler = () => router.push(backTarget);
    }
    headerStore.setHeader(options);

    // 3. meta 정보가 없으면 헤더 리셋
  } else {
    headerStore.resetHeader();
  }

  // 4. 어떤 경우든 backHandler가 없으면 기본값(router.back)으로 설정
  if (!headerStore.backHandler) {
    headerStore.backHandler = () => router.back(); // 직접 할당
  }
  next();
});

export default router;
