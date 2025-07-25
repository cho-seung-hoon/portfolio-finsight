const searchRoutes = [
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/SearchPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header:{
        titleParts: [{ text: '상품검색', color: 'var(--main01)' }],
        showBackButton: true
      }
    }
  }
];

export default searchRoutes;
