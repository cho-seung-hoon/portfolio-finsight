import InvTypeMainPage from '@/pages/InvTypePages/InvTypeMainPage.vue';
import InvTypeTestStep1Page from '@/pages/InvTypePages/InvTypeTestStep1Page.vue';
import InvTypeNoticePage from '@/pages/InvTypePages/InvTypeNoticePage.vue';
import InvTypeTestStep2Page from '@/pages/InvTypePages/InvTypeTestStep2Page.vue';
import InvTypeResultsPage from '@/pages/InvTypePages/InvTypeResultsPage.vue';
import PortfolioPage from '@/pages/PortfolioPages/PortfolioPage.vue';

const invtRoutes = [
  {
    path: '/inv-type-main-page',
    name: 'InvTypeMainPage',
    component: InvTypeMainPage,
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/inv-type-test-step-1-page',
    name: 'InvTypeTestStep1Page',
    component: InvTypeTestStep1Page,
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/inv-type-notice-page',
    name: 'InvTypeNoticePage',
    component: InvTypeNoticePage,
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/inv-type-test-step-2-page',
    name: 'InvTypeTestStep2Page',
    component: InvTypeTestStep2Page,
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/inv-type-results-page',
    name: 'InvTypeResultsPage',
    component: InvTypeResultsPage,
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/portfolio-page',
    name: 'PortfolioPage',
    component: PortfolioPage,
    meta: {
      layout: 'EmptyLayout'
    }
  }
];

export default invtRoutes;
