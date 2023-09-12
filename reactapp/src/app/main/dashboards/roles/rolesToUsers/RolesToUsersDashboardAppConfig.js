import { lazy } from 'react';

const RolesToUsersDashboardApp = lazy(() => import('./RolesToUsersDashboardApp'));

const RolesToUsersDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'roles/rolesToUser',
      element: <RolesToUsersDashboardApp />,
    },
  ],
};

export default RolesToUsersDashboardAppConfig;