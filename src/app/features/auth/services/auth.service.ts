import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { API_ENDPOINTS } from '../../../core/constants/api.constants';

export interface RegisterRequest {
  name: string;
  birthDate: string;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ForgotPasswordRequest {
  reset: string;
  birthDate: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}${API_ENDPOINTS.AUTH.BASE}`;

  constructor(private readonly http: HttpClient) {}

  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.REGISTER}`,
      data,
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`, data);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      data,
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      data,
    );
  }
}
