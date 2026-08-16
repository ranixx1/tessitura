import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ChamadoService } from '../../services/chamado.service';
import { ChamadoResponse } from '../../models/chamado-response';

@Component({
  selector: 'app-portal-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './portal-dashboard.html',
  styleUrl: './portal-dashboard.scss',
})
export class PortalDashboardComponent implements OnInit {
  chamados: ChamadoResponse[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private readonly chamadoService: ChamadoService,
  ) {}

  ngOnInit(): void {
    this.carregarChamados();
  }

  private carregarChamados(): void {
    this.loading = true;
    this.errorMessage = '';

    this.chamadoService.listarMeus().subscribe({
      next: (chamados) => {
        this.chamados = chamados;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
        this.errorMessage =
          'Não foi possível carregar seus chamados.';
      },
    });
  }

  get chamadosAbertos(): number {
    return this.chamados.filter(
      (chamado) => chamado.status === 'ABERTO',
    ).length;
  }

  get chamadosFechados(): number {
    return this.chamados.filter(
      (chamado) => chamado.status === 'FECHADO',
    ).length;
  }

  get chamadosPendentes(): number {
    return this.chamados.filter(
      (chamado) =>
        chamado.status !== 'ABERTO' &&
        chamado.status !== 'FECHADO',
    ).length;
  }
}