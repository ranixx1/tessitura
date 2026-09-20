import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface Time {
  id: number;
  nome: string;
  membros: number[];
}

@Injectable({
  providedIn: 'root',
})
export class TimeService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.jiraApiUrl}/times`;

  listarTodos(): Observable<Time[]> {
    return this.http.get<Time[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Time> {
    return this.http.get<Time>(`${this.baseUrl}/${id}`);
  }

  criar(nome: string): Observable<Time> {
    return this.http.post<Time>(
      this.baseUrl,
      null,
      {
        params: { nome },
      },
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`,
    );
  }

  listarMembros(id: number): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.baseUrl}/${id}/membros`,
    );
  }

  adicionarMembro(
    timeId: number,
    userId: number,
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${timeId}/membros`,
      { userId },
    );
  }

  removerMembro(
    timeId: number,
    userId: number,
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${timeId}/membros/${userId}`,
    );
  }
}