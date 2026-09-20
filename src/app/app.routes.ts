import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { ROLES } from './core/constants/roles.constants';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(
            (m) => m.AUTH_ROUTES,
          ),
      },
    ],
  },

  {
    path: 'portal',
    loadChildren: () =>
      import('./features/portal/portal.routes').then(
        (m) => m.PORTAL_ROUTES,
      ),
  },

  {
    path: 'helpdesk',
    loadChildren: () =>
      import('./features/helpdesk/helpdesk.routes').then(
        (m) => m.HELPDESK_ROUTES,
      ),
  },

  {
    path: 'kyc',
    loadChildren: () =>
      import('./features/kyc/kyc.routes').then(
        (m) => m.KYC_ROUTES,
      ),
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: [ROLES.ADMIN, ROLES.SUPERADMIN],
    },
    loadChildren: () =>
      import('./features/admin/admin.routes').then(
        (m) => m.ADMIN_ROUTES,
      ),
  },

  {
    path: 'analytics',
    loadChildren: () =>
      import('./features/analytics/analytics.routes').then(
        (m) => m.ANALYTICS_ROUTES,
      ),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];