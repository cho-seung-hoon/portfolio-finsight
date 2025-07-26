const searchRoutes = [
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/SearchPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '상품검색', color: 'var(--main01)' }],
        showBackButton: true,
        showBorder: false
      }
    }
  },
  {
    path: '/search/result',
    name: 'searchResult',
    component: () => import('../pages/SearchResultPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '상품결과', color: 'var(--main01)' }],
        showBackButton: true,
        showBorder: false,
        backHandler: '/list'
      }
    }
  }
];

export default searchRoutes;
