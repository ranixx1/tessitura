import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Chamado } from '../../helpdesk/model/chamado';
import { ChamadoHistorico } from '../../helpdesk/model/chamadoHistorico';

@Injectable({
  providedIn: 'root',
})
export class ChamadoService {

  private readonly apiUrl =
    `${environment.jiraApiUrl}/chamados`;

  constructor(
    private readonly http: HttpClient,
  ) { }

  listarTodos(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(
      this.apiUrl,
    );
  }

  listarMeus(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(
      `${this.apiUrl}/meus`,
    );
  }
  
  listarHistorico(id: number): Observable<ChamadoHistorico[]> {
    return this.http.get<ChamadoHistorico[]>(
      `${this.apiUrl}/${id}/historico`
    );
  }

  buscarPorId(
    id: number,
  ): Observable<Chamado> {

    return this.http.get<Chamado>(
      `${this.apiUrl}/id/${id}`,
    );
  }

  criarChamado(
    request: unknown,
  ): Observable<Chamado> {

    return this.http.post<Chamado>(
      this.apiUrl,
      request,
    );
  }

  alterarStatus(
    id: number,
    status: Chamado['status'],
  ): Observable<Chamado> {
    return this.http.put<Chamado>(
      `${this.apiUrl}/${id}/status`,
      { status },
    );
  }

  adicionarComentario(
    id: number,
    mensagem: string,
  ): Observable<Chamado> {

    return this.http.post<Chamado>(
      `${this.apiUrl}/${id}/comentarios`,
      {
        mensagem,
      },
    );
  }

  listarPorStatus(
    status: string,
  ): Observable<Chamado[]> {

    return this.http.get<Chamado[]>(
      `${this.apiUrl}/status/${status}`,
    );
  }

  listarPorPrioridade(
    prioridade: string,
  ): Observable<Chamado[]> {

    return this.http.get<Chamado[]>(
      `${this.apiUrl}/prioridade/${prioridade}`,
    );
  }
}