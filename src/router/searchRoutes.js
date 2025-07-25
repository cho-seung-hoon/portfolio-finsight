const searchRoutes = [
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/SearchPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/search/result',
    name: 'searchResult',
    component: () => import('../pages/SearchResultPage.vue'),
    meta: { layout: 'HeaderLayout' }
  }
];

export default searchRoutes;
