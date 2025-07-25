const myRoutes = [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/MyPage.vue'),
    meta: {
      layout:'NavBarLayout'
    }

  }
];

export default myRoutes;
