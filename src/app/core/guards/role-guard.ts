import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { JwtService } from '../services/jwt.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string | undefined;

  if (!requiredRole) {
    return true;
  }

  const userRole = jwtService.getRole();

  if (userRole === requiredRole) {
    return true;
  }

  return router.createUrlTree(['/portal']);
};