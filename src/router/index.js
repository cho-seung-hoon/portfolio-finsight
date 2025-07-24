import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';

import holdingRoutes from './holdingRoutes';
import listRoutes from './listRoutes';
import myRoutes from './myRoutes';
import signUpRoutes from './signUpRoutes';
import invtRoutes from '@/router/invtRoutes.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
      // meta: {
      //     requiresAuth: true,
      // },
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
    ...invtRoutes
  ]
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;

    const isLoggedIn = !!localStorage.getItem('token');

    if (requiresAuth && !isLoggedIn) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;
