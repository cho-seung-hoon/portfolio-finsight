import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import holdingRoutes from './holdingRoutes';
import listRoutes from './listRoutes';
import myRoutes from './myRoutes';
import invtRoutes from '@/router/invtRoutes.js';
import productRoutes from '@/router/productRoutes.js';
import { useHeaderStore } from '@/stores/header.js';
import { useWebSocketStore } from '@/stores/websocket.js';
import { fetchUserInfoApi } from '@/api/user';
import { useSessionStore } from '@/stores/session';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        header: true,
        requiresAuth: true
      }
    },
    {
      path: '/start',
      name: 'Start',
      component: () => import('../pages/StartPage.vue'),
      meta: {
        layout: 'EmptyLayout'
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
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../pages/SignUpPage.vue'),
      meta: {
        layout: 'EmptyLayout'
      }
    },
    ...holdingRoutes,
    ...listRoutes,
    ...myRoutes,
    ...invtRoutes,
    ...productRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const headerStore = useHeaderStore();
  const webSocketStore = useWebSocketStore();
  const sessionStore = useSessionStore();
  const headerMeta = to.meta.header;
  const requiresAuth = to.meta.requiresAuth;
  const isLoggedIn = sessionStore.isAuthenticated;

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

  if (to.name === 'home' && isLoggedIn) {
    try {
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
      headerStore.resetHeader();
    }
  }
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


  if (from.path !== to.path) {
    webSocketStore.unsubscribeAll();
  }

  next();
});

export default router;
