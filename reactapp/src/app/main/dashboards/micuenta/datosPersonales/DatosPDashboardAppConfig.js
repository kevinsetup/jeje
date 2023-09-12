import { lazy } from 'react';

const DatosPDashboardApp = lazy(() => import('./DatosPDashboardApp'));

const DatosPDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/micuenta/datospersonales',
      element: <DatosPDashboardApp />,
    },
  ],
};

export default DatosPDashboardAppConfig;
