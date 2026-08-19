import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

import { PortalDashboardComponent } from './pages/dashboard/portal-dashboard';
import { PortalDetailComponent } from './pages/detail/portal-detail/portal-detail';

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: PortalDashboardComponent,
  },

  {
    path: ':portalId',
    canActivate: [authGuard],
    component: PortalDetailComponent,
  },
];