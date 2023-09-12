import { lazy } from 'react';

const TrackingDashboardApp = lazy(() => import('./TrackingDashboardApp'));

const TrackingDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/micuenta/tracking',
      element: <TrackingDashboardApp />,
    },
  ],
};

export default TrackingDashboardAppConfig;
