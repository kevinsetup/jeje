import { lazy } from 'react';

const ProductDashboardApp = lazy(() => import('./ProductDashboardApp'));

const ProductDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboards/products',
      element: <ProductDashboardApp />,
    },
  ],
};

export default ProductDashboardAppConfig;
