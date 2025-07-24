import InvTypeMainPage from '@/pages/InvTypePages/InvTypeMainPage.vue';
import InvTypeTestStep1Page from '@/pages/InvTypePages/InvTypeTestStep1Page.vue';
import InvTypeNoticePage from '@/pages/InvTypePages/InvTypeNoticePage.vue';
import InvTypeTestStep2Page from '@/pages/InvTypePages/InvTypeTestStep2Page.vue';
import InvTypeResultsPage from '@/pages/InvTypePages/InvTypeResultsPage.vue';
import InvTypeStablePage from '@/pages/PortfolioPages/InvTypeStablePage.vue';
import InvTypeStablePlusPage from '@/pages/PortfolioPages/InvTypeStablePlusPage.vue';
import InvTypeNeutralPage from '@/pages/PortfolioPages/InvTypeNeutralPage.vue';
import InvTypeAggressivePage from '@/pages/PortfolioPages/InvTypeAggressivePage.vue';
import InvTypeVeryAggressivePage from '@/pages/PortfolioPages/InvTypeVeryAggressivePage.vue';

const invtRoutes = [

  {
    path: '/inv-type-main-page',
    name: 'InvTypeMainPage',
    component: InvTypeMainPage,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-test-step-1-page',
    name: 'InvTypeTestStep1Page',
    component: InvTypeTestStep1Page,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-notice-page',
    name: 'InvTypeNoticePage',
    component: InvTypeNoticePage,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-test-step-2-page',
    name: 'InvTypeTestStep2Page',
    component: InvTypeTestStep2Page,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-results-page',
    name: 'InvTypeResultsPage',
    component: InvTypeResultsPage,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-stable-page',
    name: 'InvTypeStablePage',
    component: InvTypeStablePage,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-stableplus-page',
    name: 'InvTypeStablePlusPage',
    component: InvTypeStablePlusPage,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-neutral-page',
    name: 'InvTypeNeutralPage',
    component: InvTypeNeutralPage,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-aggressive-page',
    name: 'InvTypeAggressivePage',
    component: InvTypeAggressivePage,
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/inv-type-veryaggressive-page',
    name: 'InvTypeVeryAggressivePage',
    component: InvTypeVeryAggressivePage,
    meta: {
      layout: 'HeaderLayout'
    }
  },

];

export default invtRoutes;
