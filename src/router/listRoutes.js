const listRoutes = [
  {
    path: '/list/:category',
    name: 'list-category',
    component: () => import('../pages/ListPage.vue'),
    meta: {
      header: {
        titleParts: [{ text: '상품탐색', color: 'var(--main01)' }],
        showBackButton: false,
        actions: [
          { icon: 'search', to: '/search' }
        ],
        showBorder: false
      }
    }
  },
  {
    path: '/list',
    redirect: '/list/deposit'
  }
];

export default listRoutes;
