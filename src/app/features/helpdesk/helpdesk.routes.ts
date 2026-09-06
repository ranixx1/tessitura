import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const HELPDESK_ROUTES: Routes = [

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/helpdesk-dashboard/helpdesk-dashboard')
        .then(m => m.HelpdeskDashboardComponent),
  },

  {
    path: 'chamados',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/chamados/chamados')
        .then(m => m.ChamadosComponent),
  },

  {
    path: 'chamados/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/chamado-detail/chamado-detail')
        .then(m => m.ChamadoDetailComponent),
  },

  {
    path: 'novo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/novo-chamado/novo-chamado')
        .then(m => m.NovoChamadoComponent),
  },

];