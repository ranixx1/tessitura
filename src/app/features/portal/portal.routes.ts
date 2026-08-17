import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

import { PortalDashboardComponent } from './pages/dashboard/portal-dashboard';

export const PORTAL_ROUTES: Routes = [

  {
    path: '',
    canActivate: [authGuard],
    component: PortalDashboardComponent,
  },

  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/portal-detail/portal-detail')
        .then((m) => m.PortalDetailComponent),
  },

];