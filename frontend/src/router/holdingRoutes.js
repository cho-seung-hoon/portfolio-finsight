const holdingRoutes = [
  {
    path: '/holding',
    name: 'holding',
    component: () => import('../pages/HoldingPage.vue'),
    meta: {
      header: {
        titleParts: [{ text: '보유내역', color: 'var(--main01)' }]
      }
    }
  },
  {
    path: '/holding/portfolio',
    name: 'MyPortfolio',
    component: () => import('../pages/PortfolioPages/MyPortfolio.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '나의 모델 포트폴리오', color: 'var(--main01)' }],
        showBackButton: true
      }
    }
  }
];

export default holdingRoutes;
