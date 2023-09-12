import { lazy } from 'react';

const ManageProductsDashboardApp = lazy(() => import('./ManageProductsDashboardApp'));

const ManageProductsDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'configuracion/productos',
      element: <ManageProductsDashboardApp />,
    },
  ],
};

export default ManageProductsDashboardAppConfig;
