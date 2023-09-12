
import { lazy } from 'react';

const FunctionsToRoleDashboardApp = lazy(() => import('./FunctionsToRoleDashboardApp'));

const FunctionsToRoleDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'roles/functionsToRole',
      element: <FunctionsToRoleDashboardApp />,
    },
  ],
};

export default FunctionsToRoleDashboardAppConfig;
