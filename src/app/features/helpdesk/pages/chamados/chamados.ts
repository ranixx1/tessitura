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



  chamados: Chamado[] = [];

  loading = true;

  errorMessage = '';

  filtroStatus = '';

  filtroPrioridade = '';

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

    this.filtroStatus = '';

    this.filtroPrioridade = '';

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

  get chamadosFiltrados(): Chamado[] {

    return this.chamados
      .filter((chamado) => {

        const statusOk =
          !this.filtroStatus ||
          chamado.status === this.filtroStatus;

        const prioridadeOk =
          !this.filtroPrioridade ||
          chamado.prioridade === this.filtroPrioridade;

        return statusOk && prioridadeOk;
      })
      .sort((a, b) => {
        const diff =
          (this.statusOrder[a.status] ?? 99) -
          (this.statusOrder[b.status] ?? 99);
        return diff;
      });
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