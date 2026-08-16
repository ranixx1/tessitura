import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

import { ChamadoRequest } from '../models/chamado-request';
import { ChamadoResponse } from '../models/chamado-response';

@Injectable({
  providedIn: 'root',
})
export class ChamadoService {
  private readonly apiUrl =
    `${environment.apiUrl}${API_ENDPOINTS.JIRA.CHAMADOS}`;

  constructor(private readonly http: HttpClient) {}

  listarTodos(): Observable<ChamadoResponse[]> {
    return this.http.get<ChamadoResponse[]>(
      this.apiUrl,
    );
  }

  listarMeus(): Observable<ChamadoResponse[]> {
    return this.http.get<ChamadoResponse[]>(
      `${this.apiUrl}/meus`,
    );
  }

  buscarPorId(id: number): Observable<ChamadoResponse> {
    return this.http.get<ChamadoResponse>(
      `${this.apiUrl}/id/${id}`,
    );
  }

  criar(data: ChamadoRequest): Observable<ChamadoResponse> {
    return this.http.post<ChamadoResponse>(
      this.apiUrl,
      data,
    );
  }

  adicionarComentario(
    chamadoId: number,
    mensagem: string,
  ): Observable<ChamadoResponse> {
    return this.http.post<ChamadoResponse>(
      `${this.apiUrl}/${chamadoId}/comentarios`,
      { mensagem },
    );
  }
}