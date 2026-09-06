import { Routes } from '@angular/router';
import { UsersManagementComponent } from './pages/users-management/users-management';
import { roleGuard } from '../../core/guards/role-guard'; 

export const ADMIN_ROUTES: Routes = [
    {
        path: 'users',
        component: UsersManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['ROLE_SUPERADMIN', 'ROLE_ADMIN'] }
    },
];