import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Chamado } from '../../model/chamado';
import { ChamadoService } from '../../../portal/services/chamado.service';

@Component({
  selector: 'app-chamados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './chamados.html',
  styleUrl: './chamados.scss',
})
export class ChamadosComponent implements OnInit {

  private readonly chamadoService =
    inject(ChamadoService);

  private readonly router =
    inject(Router);

  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly statusOrder: Record<string, number> = {
    ABERTO: 0,
    EM_PROGRESSO: 1,
    AGUARDANDO_USUARIO: 2,
    FECHADO: 3,
  };
  readonly statusDisponiveis = [
    'ABERTO', 'EM_PROGRESSO', 'AGUARDANDO_USUARIO', 'FECHADO',
  ];



  chamados: Chamado[] = [];

  loading = true;

  errorMessage = '';

  filtrosStatus: string[] = [];
  filtroPrioridade = '';
  filtroPortal = '';
  filtroCategoria = '';
  filtroTexto = '';

  ngOnInit(): void {
    this.carregarChamados();
  }


  carregarChamados(): void {

    this.loading = true;
    this.errorMessage = '';

    this.chamadoService
      .listarTodos()
      .subscribe({

        next: (chamados) => {

          console.log(
            'Chamados recebidos:',
            chamados,
          );

          this.chamados =
            chamados ?? [];

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Erro ao carregar chamados:',
            error,
          );

          this.chamados = [];

          this.loading = false;

          this.errorMessage =
            'Não foi possível carregar os chamados.';

          this.cdr.detectChanges();
        },

      });
  }

  aplicarFiltros(): void {
    this.cdr.detectChanges();
  }

  limparFiltros(): void {
    this.filtrosStatus = [];
    this.filtroPrioridade = '';
    this.filtroPortal = '';
    this.filtroCategoria = '';
    this.filtroTexto = '';
    this.cdr.detectChanges();
  }

  abrirChamado(
    chamado: Chamado,
  ): void {

    this.router.navigate([
      '/helpdesk/chamados',
      chamado.id,
    ]);
  }


  novoChamado(): void {
    this.router.navigate([
      '/portal',
    ]);
  }

  formatarStatus(
    status: string,
  ): string {

    switch (status) {

      case 'ABERTO':
        return 'Aberto';

      case 'EM_PROGRESSO':
        return 'Em progresso';

      case 'AGUARDANDO_USUARIO':
        return 'Aguardando usuário';

      case 'FECHADO':
        return 'Fechado';

      default:
        return status;
    }
  }

  toggleStatus(status: string): void {
    const idx = this.filtrosStatus.indexOf(status);
    if (idx === -1) {
      this.filtrosStatus.push(status);
    } else {
      this.filtrosStatus.splice(idx, 1);
    }
    this.aplicarFiltros();
  }

  get portaisDisponiveis(): string[] {
    const nomes = this.chamados
      .map((c) => c.portal?.nome)
      .filter((nome): nome is string => !!nome);
    return Array.from(new Set(nomes)).sort();
  }

  get categoriasDisponiveis(): string[] {
    const nomes = this.chamados
      .map((c) => c.categoria?.nome)
      .filter((nome): nome is string => !!nome);
    return Array.from(new Set(nomes)).sort();
  }

  get chamadosFiltrados(): Chamado[] {
    return this.chamados
      .filter((chamado) => {

        const statusOk =
          this.filtrosStatus.length === 0 ||
          this.filtrosStatus.includes(chamado.status);

        const prioridadeOk =
          !this.filtroPrioridade ||
          chamado.prioridade === this.filtroPrioridade;

        const portalOk =
          !this.filtroPortal ||
          chamado.portal?.nome === this.filtroPortal;

        const categoriaOk =
          !this.filtroCategoria ||
          chamado.categoria?.nome === this.filtroCategoria;

        const textoOk =
          !this.filtroTexto ||
          chamado.titulo.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
          chamado.descricao.toLowerCase().includes(this.filtroTexto.toLowerCase());

        return statusOk && prioridadeOk && portalOk && categoriaOk && textoOk;
      })
      .sort((a, b) =>
        (this.statusOrder[a.status] ?? 99) - (this.statusOrder[b.status] ?? 99),
      );
  }



  getStatusClass(
    status: string,
  ): string {

    switch (status) {

      case 'ABERTO':
        return 'status-aberto';

      case 'EM_PROGRESSO':
        return 'status-em-progresso';

      case 'AGUARDANDO_USUARIO':
        return 'status-aguardando-usuario';

      case 'FECHADO':
        return 'status-fechado';

      default:
        return '';
    }
  }

  formatarPrioridade(
    prioridade: string,
  ): string {

    switch (prioridade) {

      case 'BAIXA':
        return 'Baixa';

      case 'NORMAL':
        return 'Normal';

      case 'ALTA':
        return 'Alta';

      default:
        return prioridade;
    }
  }


  getPrioridadeClass(
    prioridade: string,
  ): string {

    switch (prioridade) {

      case 'BAIXA':
        return 'prioridade-baixa';

      case 'NORMAL':
        return 'prioridade-normal';

      case 'ALTA':
        return 'prioridade-alta';

      default:
        return '';
    }
  }

}