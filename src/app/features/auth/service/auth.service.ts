import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { RegisterResponse } from '../models/register-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';

  constructor(private readonly http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.API_URL}/login`,
      data
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.API_URL}/register`,
      data
    );
  }

  forgotPassword(
    data: {
      reset: string;
      birthDate: string;
    }
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/forgot-password`,
      data
    );
  }

  resetPassword(data: {
    token: string;
    newPassword: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/reset-password`,
      data
    );
  }
}