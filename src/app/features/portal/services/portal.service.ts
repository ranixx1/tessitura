import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface Portal {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private readonly apiUrl =
    `${environment.jiraApiUrl}/config/chamados/portais`;

  constructor(private readonly http: HttpClient) {}

  listarPortais(): Observable<Portal[]> {
    return this.http.get<Portal[]>(this.apiUrl);
  }
}