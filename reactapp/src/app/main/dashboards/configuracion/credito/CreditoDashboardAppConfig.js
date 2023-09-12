import { lazy } from 'react';

const CreditoDashboardApp = lazy(() => import('./CreditoDashboardApp'));

const CreditoDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'configuracion/creditos',
      element: <CreditoDashboardApp />,
    },
  ],
};

export default CreditoDashboardAppConfig;
