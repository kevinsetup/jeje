import { lazy } from 'react';

const MisComprasDashboardApp = lazy(() => import('./MisComprasDashboardApp'));

const MisComprasDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/micuenta/miscompras',
      element: <MisComprasDashboardApp />,
    },
  ],
};

export default MisComprasDashboardAppConfig;
