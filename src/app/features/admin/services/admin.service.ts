import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserSummary } from '../models/user-summary';
import { UserDetail } from '../models/user-detail';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.authApiUrl}/admin`;

  listarUsuarios(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${this.baseUrl}/users`);
  }

  detalharUsuario(id: number): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.baseUrl}/users/${id}`);
  }

  alterarRole(id: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${id}/role`, { role });
  }

  toggleAtivo(id: number, active: boolean): Observable<void> {
    const params = new HttpParams().set('active', active);
    return this.http.put<void>(`${this.baseUrl}/users/${id}/active`, null, { params });
  }
}