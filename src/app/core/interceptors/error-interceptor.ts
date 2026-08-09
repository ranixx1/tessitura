import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Unauthorized request:', req.url);
      }

      if (error.status === 403) {
        console.warn('Forbidden request:', req.url);
      }

      if (error.status >= 500) {
        console.error('Server error:', error);
      }

      return throwError(() => error);
    }),
  );
};
