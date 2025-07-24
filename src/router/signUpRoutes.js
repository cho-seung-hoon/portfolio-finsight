const signUpRoutes = [
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../pages/SignUpPage.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  }
];

export default signUpRoutes;
