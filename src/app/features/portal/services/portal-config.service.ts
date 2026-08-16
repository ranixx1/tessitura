import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

import { Portal } from '../models/portal';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root',
})
export class PortalConfigService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  listarPortais(): Observable<Portal[]> {
    return this.http.get<Portal[]>(
      `${this.apiUrl}${API_ENDPOINTS.JIRA.CONFIG.PORTAIS}`,
    );
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(
      `${this.apiUrl}${API_ENDPOINTS.JIRA.CONFIG.CATEGORIAS}`,
    );
  }
}