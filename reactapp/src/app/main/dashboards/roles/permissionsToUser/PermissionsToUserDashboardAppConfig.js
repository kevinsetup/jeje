
import { lazy } from 'react';

const PermissionsToRoleDashboardApp = lazy(() => import('./PermissionsToUserDashboardApp'));

const PermissionsToRoleDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'roles/permissionsToUser',
      element: <PermissionsToRoleDashboardApp />,
    },
  ],
};

export default PermissionsToRoleDashboardAppConfig;
