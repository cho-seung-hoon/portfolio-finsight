const searchRoutes = [
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/SearchPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  }
];

export default searchRoutes;
