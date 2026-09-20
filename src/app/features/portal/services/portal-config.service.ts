import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Portal } from '../models/portal';
import { Categoria } from '../models/categoria';
import { Subtopico } from '../models/subtopico';

@Injectable({
  providedIn: 'root',
})
export class PortalConfigService {

  private readonly apiUrl = environment.jiraApiUrl;

  constructor(
    private readonly http: HttpClient,
  ) {}

  listarPortais(): Observable<Portal[]> {
    return this.http.get<Portal[]>(
      `${this.apiUrl}/config/chamados/portais`,
    );
  }

  listarCategoriasPorPortal(
    portalId: number,
  ): Observable<Categoria[]> {

    return this.http.get<Categoria[]>(
      `${this.apiUrl}/config/chamados/portais/${portalId}/categorias`,
    );
  }

  listarSubtopicosPorCategoria(
    categoriaId: number,
  ): Observable<Subtopico[]> {

    return this.http.get<Subtopico[]>(
      `${this.apiUrl}/config/chamados/categorias/${categoriaId}/subtopicos`,
    );
  }
}