const listRoutes = [
  {
    path: '/list/:category',
    name: 'list-category',
    component: () => import('../pages/ListPage.vue'),
    meta: {
      header: {
        titleParts: [{ text: '상품탐색', color: 'var(--main01)' }],
        showBackButton: false,
        actions: [{ icon: 'search', to: '/search' }],
        showBorder: false
      }
    }
  },
  {
    path: '/list',
    redirect: '/list/deposit'
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/search/SearchPage.vue'),
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
    component: () => import('../pages/search/SearchResultPage.vue'),
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

export default listRoutes;
