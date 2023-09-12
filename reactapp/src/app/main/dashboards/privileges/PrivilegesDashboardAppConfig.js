import { lazy } from 'react';

const PrivilegesDashboardApp = lazy(() => import('./PrivilegesDashboardApp'));

const PrivilegesDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboards/privileges',
      element: <PrivilegesDashboardApp />,
    },
  ],
};

export default PrivilegesDashboardAppConfig;
