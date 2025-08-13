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
import portfolioRoutes from './portfolioRoutes';
import startRoutes from './startRoutes';

import { useHeaderStore } from '@/stores/header.js';
import { useWebSocketStore } from '@/stores/websocket.js';
import { fetchUserInfoApi } from '@/api/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        header: true // ✅ 동적으로 세팅할 예정이라 true로만 표시
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
    ...startRoutes,
    ...portfolioRoutes,
    {
      path: '/example/etf-list-websocket',
      name: 'etf-list-websocket',
      component: () => import('@/pages/example/EtfListWithWebSocket.vue'),
      meta: {
        header: {
          titleParts: [{ text: 'ETF 리스트 (웹소켓)', color: 'var(--main01)' }]
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const headerStore = useHeaderStore();
  const webSocketStore = useWebSocketStore();
  const headerMeta = to.meta.header;
  const requiresAuth = to.meta.requiresAuth;
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const publicPaths = ['/start', '/login', '/signup'];
  const isPublic = publicPaths.includes(to.path);

  if (!isLoggedIn && !isPublic) {
    next({ path: '/start' });
    return;
  }

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
    return;
  }

  // ✅ HOME 진입 시 userName을 API로 불러와서 헤더 설정
  if (to.name === 'home' && isLoggedIn) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetchUserInfoApi();
      const userName = response.data.userName;
      console.log(userName);

      headerStore.setHeader({
        titleParts: [
          { text: `${userName}`, color: 'var(--sub01)' },
          { text: '님, 반갑습니다.', color: 'var(--main01)' }
        ]
      });
    } catch (error) {
      console.error('유저 이름 불러오기 실패:', error);
      headerStore.resetHeader(); // 실패 시 기본 헤더로
    }
  }

  // ✅ 그 외 일반적인 header 처리
  else if (headerMeta && headerMeta !== 'none') {
    const options = typeof headerMeta === 'function' ? headerMeta(to) : { ...headerMeta };

    if (options.backHandler && typeof options.backHandler !== 'function') {
      const backTarget = options.backHandler;
      options.backHandler = () => router.push(backTarget);
    }

    headerStore.setHeader(options);
  } else {
    headerStore.resetHeader();
  }

  if (!headerStore.backHandler) {
    headerStore.backHandler = () => router.back();
  }

  // 페이지 이동 시 웹소켓 구독 해제 (연결은 유지)
  if (from.path !== to.path) {
    webSocketStore.unsubscribeAll();
  }

  next();
});

export default router;
