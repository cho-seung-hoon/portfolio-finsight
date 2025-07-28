const signUpRoutes = [
  {
    path: '/start',
    name: 'Start',
    component: () => import('../pages/StartPage.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  }
];

export default signUpRoutes;
