import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';

import holdingRoutes from './holdingRoutes';
import listRoutes from './listRoutes';
import myRoutes from './myRoutes';
import InvTypeMainPage from '../pages/InvTypePages/InvTypeMainPage.vue';
import InvTypeTestStep1Page from '../pages/InvTypePages/InvTypeTestStep1Page.vue';
import InvTypeNoticePage from '../pages/InvTypePages/InvTypeNoticePage.vue';
import InvTypeTestStep2Page from '../pages/InvTypePages/InvTypeTestStep2Page.vue';
import InvTypeResultsPage from '../pages/InvTypePages/InvTypeResultsPage.vue';

import InvTypeStablePage from '../pages/PortfolioPages/InvTypeStablePage.vue';
import InvTypeStablePlusPage from '../pages/PortfolioPages/InvTypeStablePlusPage.vue';
import InvTypeNeutralPage from '../pages/PortfolioPages/InvTypeNeutralPage.vue';
import InvTypeAggressivePage from '../pages/PortfolioPages/InvTypeAggressivePage.vue';
import InvTypeVeryAggressivePage from '../pages/PortfolioPages/InvTypeVeryAggressivePage.vue';


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
    {
        path: '/inv-type-main-page',
        name: 'InvTypeMainPage',
        component: InvTypeMainPage
    },
    {
      path: '/inv-type-test-step-1-page',
      name: 'InvTypeTestStep1Page',
      component: InvTypeTestStep1Page
    },
    {
      path: '/inv-type-notice-page',
      name: 'InvTypeNoticePage',
      component: InvTypeNoticePage
    },
    {
      path: '/inv-type-test-step-2-page',
      name: 'InvTypeTestStep2Page',
      component: InvTypeTestStep2Page
    },
    {
      path: '/inv-type-results-page',
      name: 'InvTypeResultsPage',
      component: InvTypeResultsPage
    },
    {
      path: '/inv-type-stable-page',
      name: 'InvTypeStablePage',
      component: InvTypeStablePage
    },
    {
      path: '/inv-type-stableplus-page',
      name: 'InvTypeStablePlusPage',
      component: InvTypeStablePlusPage
    },
    {
      path: '/inv-type-neutral-page',
      name: 'InvTypeNeutralPage',
      component: InvTypeNeutralPage
    },
    {
      path: '/inv-type-aggressive-page',
      name: 'InvTypeAggressivePage',
      component: InvTypeAggressivePage
    },
    {
      path: '/inv-type-veryaggressive-page',
      name: 'InvTypeVeryAggressivePage',
      component: InvTypeVeryAggressivePage
    },

    // ...holdingRoutes,
    // ...listRoutes,
    // ...myRoutes
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
