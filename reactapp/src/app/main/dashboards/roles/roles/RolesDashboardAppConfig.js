import { lazy } from 'react';

const RolesDashboardApp = lazy(() => import('./RolesDashboardApp'));

const RolesDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'roles/roles',
      element: <RolesDashboardApp />,
    },
  ],
};

export default RolesDashboardAppConfig;
