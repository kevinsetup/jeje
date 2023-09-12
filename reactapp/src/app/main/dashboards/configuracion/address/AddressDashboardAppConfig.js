import { lazy } from 'react';

const AddressDashboardApp = lazy(() => import('./AddressDashboardApp'));

const AddressDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'configuracion/direcciones',
      element: <AddressDashboardApp />,
    },
  ],
};

export default AddressDashboardAppConfig;
