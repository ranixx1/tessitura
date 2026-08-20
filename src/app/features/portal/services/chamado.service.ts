import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ChamadoResponse } from '../models/chamado-response';

export interface CriarChamadoRequest {
  titulo: string;
  descricao: string;
  portalId: number;
  categoriaId: number;
  subtopicoId: number | null;
  outroSubtopico: string | null;
  prioridade: string;
  escopo: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChamadoService {
  private readonly apiUrl = `${environment.jiraApiUrl}/chamados`;

  constructor(private readonly http: HttpClient) {}

  criarChamado(data: CriarChamadoRequest): Observable<ChamadoResponse> {
    return this.http.post<ChamadoResponse>(this.apiUrl, data);
  }

  listarChamados(): Observable<ChamadoResponse[]> {
    return this.http.get<ChamadoResponse[]>(this.apiUrl);
  }

  listarMeusChamados(): Observable<ChamadoResponse[]> {
    return this.http.get<ChamadoResponse[]>(`${this.apiUrl}/meus`);
  }
}