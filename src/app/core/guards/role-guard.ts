import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { JwtService } from '../services/jwt.service';
import { Role } from '../constants/roles.constants';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Role[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRole = jwtService.getRole();

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  return router.createUrlTree(['/portal']);
};