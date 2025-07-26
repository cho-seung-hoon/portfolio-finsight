const myRoutes = [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/MyPage.vue'),
    meta: {
      header:{
        titleParts: [{text:'마이페이지', color:'var(--white)'}]
      }
    }

  }
];

export default myRoutes;
