import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { JwtService } from '../services/jwt.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);

  const isAuthRequest = req.url.includes('/auth/');

  if (isAuthRequest) {
    return next(req);
  }

  const token = jwtService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};