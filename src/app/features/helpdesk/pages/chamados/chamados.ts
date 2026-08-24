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


  /* ================================
     ESTADO
  ================================= */

  chamados: Chamado[] = [];

  loading = true;

  errorMessage = '';


  /* ================================
     FILTROS
  ================================= */

  filtroStatus = '';

  filtroPrioridade = '';


  /* ================================
     CICLO DE VIDA
  ================================= */

  ngOnInit(): void {
    this.carregarChamados();
  }


  /* ================================
     CARREGAR CHAMADOS
  ================================= */

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


  /* ================================
     FILTROS
  ================================= */

  aplicarFiltros(): void {
    /*
     * Os filtros são aplicados através
     * do getter chamadosFiltrados.
     *
     * Este método existe para que o
     * HTML possa reagir ao evento
     * (change) dos selects.
     */
    this.cdr.detectChanges();
  }


  get chamadosFiltrados(): Chamado[] {

    return this.chamados.filter(
      (chamado) => {

        const statusOk =
          !this.filtroStatus ||
          chamado.status === this.filtroStatus;

        const prioridadeOk =
          !this.filtroPrioridade ||
          chamado.prioridade === this.filtroPrioridade;

        return statusOk && prioridadeOk;
      },
    );
  }


  limparFiltros(): void {

    this.filtroStatus = '';

    this.filtroPrioridade = '';

    this.cdr.detectChanges();
  }


  /* ================================
     NAVEGAÇÃO
  ================================= */

  abrirChamado(
    chamado: Chamado,
  ): void {

    this.router.navigate([
      '/helpdesk',
      chamado.id,
    ]);
  }


  novoChamado(): void {

    /*
     * O fluxo de criação começa
     * pela seleção do portal.
     */
    this.router.navigate([
      '/portal',
    ]);
  }


  /* ================================
     STATUS
  ================================= */

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


  /* ================================
     PRIORIDADE
  ================================= */

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