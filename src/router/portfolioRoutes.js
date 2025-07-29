const portfolioRoutes = [
  {
    path: '/holding/portfolio',
    name: 'MyPortfolio',
    component: () => import('../pages/PortfolioPages/MyPortfolio.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '나만의 포트폴리오', color: 'var(--main01)' }]
      }
    }
  }
];

export default portfolioRoutes;
