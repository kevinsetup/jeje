import { lazy } from 'react';

const ConfigCDashboardApp = lazy(() => import('./ConfigCDashboardApp'));

const ConfigCDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/micuenta/configuracioncuenta',
      element: <ConfigCDashboardApp />,
    },
  ],
};

export default ConfigCDashboardAppConfig;
