import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptors/auth-interceptor';
import { errorInterceptor } from '../interceptors/error-interceptor';

export const httpConfig = [
  provideHttpClient(
    withInterceptors([
      authInterceptor,
      errorInterceptor
    ])
  )
];