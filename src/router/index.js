import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';

import holdingRoutes from './holdingRoutes';
import listRoutes from './listRoutes';
import myRoutes from './myRoutes';
import depositRoutes from './depositRoutes';
import etfRoutes from './etfRoutes';

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
    ...depositRoutes,
    ...etfRoutes
  ]
});

// router.beforeEach((to, from, next) => {
//     const requiresAuth = to.meta.requiresAuth;

//     const isLoggedIn = !!localStorage.getItem('token');

//     if (requiresAuth && !isLoggedIn) {
//         next({ name: 'login' });
//     } else {
//         next();
//     }
// });

export default router;
