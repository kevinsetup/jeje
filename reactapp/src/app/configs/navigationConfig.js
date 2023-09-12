import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    subtitle: 'Unique dashboard designs',
    type: 'collapse',
    icon: 'heroicons-outline:home',
    translate: 'DASHBOARDS',
    children: [
      {
        id: 'dashboards.project',
        title: 'Pedidos',
        type: 'item',
        icon: 'heroicons-outline:clipboard-check',
        url: '/dashboards/project',
      },
      {
        id: 'dashboards.analytics',
        title: 'Historial',
        type: 'item',
        icon: 'heroicons-outline:chart-pie',
        url: '/dashboards/analytics',
      },
      // {
      //   id: 'dashboards.finance',
      //   title: 'Usuarios',
      //   type: 'item',
      //   icon: 'heroicons-outline:cash',
      //   url: '/dashboards/finance',
      // },
      {
        id: 'dashboards.crypto',
        title: 'Crypto',
        type: 'item',
        icon: 'heroicons-outline:currency-dollar',
        url: '/dashboards/crypto',
      },
      {
        id: 'dashboards.roles',
        title: 'Roles',
        type: 'collapse',
        icon: 'heroicons-outline:key',
        children: [
          {
            id: 'roles',
            title: 'Roles',
            type: 'item',
            icon: 'heroicons-outline:key',
            url: '/dashboards/roles/roles',
          },
          {
            id: 'usuarios',
            title: 'Usuarios',
            type: 'item',
            icon: 'heroicons-outline:key',
            url: '/dashboards/roles/users',
          },
          {
            id: 'funcionesrol',
            title: 'Funciones a rol',
            type: 'item',
            icon: 'heroicons-outline:key',
            url: '/dashboards/roles/functionsToRole',
          },
          {
            id: 'permisosrol',
            title: 'Permisos a rol',
            type: 'item',
            icon: 'heroicons-outline:key',
            url: '/dashboards/roles/permissionsToRole',
          },
          {
            id: 'rolesusuario',
            title: 'Roles a usuario',
            type: 'item',
            icon: 'heroicons-outline:key',
            url: '/dashboards/roles/rolesToUser',
          },
        ],
      },
      {
        id: 'dashboards.products',
        title: 'Productos',
        type: 'item',
        icon: 'heroicons-outline:currency-dollar',
        url: '/dashboards/products',
      },
    ],
  },
];

export default navigationConfig;
