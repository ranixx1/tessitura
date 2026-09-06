import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Chamado } from '../../model/chamado';
import { ChamadoService } from '../../../portal/services/chamado.service';
import { ChamadoHistorico } from '../../model/chamadoHistorico';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chamado-detail',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './chamado-detail.html',
  styleUrl: './chamado-detail.scss',
})
export class ChamadoDetailComponent implements OnInit {

  private readonly chamadoService = inject(ChamadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  chamado: Chamado | null = null;

  loading = true;
  error = false;

  novoComentario = '';
  enviandoComentario = false;

  alterandoStatus = false;

  successMessage = '';
  errorMessage = '';

  historico: ChamadoHistorico[] = [];

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id'),
    );

    if (!id) {
      this.router.navigate(['/helpdesk/chamados']);
      return;
    }

    this.carregarChamado(id);
  }

  private carregarChamado(id: number): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.chamadoService.buscarPorId(id).subscribe({
      next: (chamado) => {
        this.chamado = chamado;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Erro ao carregar chamado:',
          error,
        );

        this.loading = false;
        this.error = true;
        this.errorMessage =
          'Não foi possível carregar os detalhes do chamado.';

        this.cdr.detectChanges();
      },
    });
  }

  carregarHistorico(): void {
    this.chamadoService
      .listarHistorico(this.chamado?.id ?? 0)
      .subscribe({
        next: (historico) => {
          this.historico = historico;
        },
        error: (error) => {
          console.error(
            'Erro ao carregar histórico:',
            error
          );
        },
      });
  }

  adicionarComentario(): void {
    if (
      !this.chamado ||
      !this.novoComentario.trim() ||
      this.enviandoComentario
    ) {
      return;
    }

    if (this.chamado.status === 'FECHADO') {
      this.errorMessage =
        'Não é possível comentar em um chamado fechado.';
      return;
    }

    this.enviandoComentario = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.chamadoService
      .adicionarComentario(
        this.chamado.id,
        this.novoComentario.trim(),

      )
      .subscribe({
        next: (chamadoAtualizado) => {
          this.chamado = chamadoAtualizado;

          this.novoComentario = '';
          this.carregarHistorico();
          this.enviandoComentario = false;

          this.successMessage =
            'Comentário adicionado com sucesso.';

          this.cdr.detectChanges();

          this.limparMensagemSucesso();
        },

        error: (error) => {
          console.error(
            'Erro ao adicionar comentário:',
            error,
          );

          this.enviandoComentario = false;

          this.errorMessage =
            error?.error?.message ??
            'Não foi possível adicionar o comentário.';

          this.cdr.detectChanges();
        },
      });
  }

  alterarStatus(status: string): void {
    if (
      !this.chamado ||
      this.alterandoStatus ||
      this.chamado.status === status

    ) {
      return;
    }

    this.alterandoStatus = true;
    this.successMessage = '';
    this.errorMessage = '';


    this.chamadoService
      .alterarStatus(
        this.chamado.id,
        status as Chamado['status'],

      )
      .subscribe({
        next: (chamadoAtualizado) => {
          this.chamado = chamadoAtualizado;
          this.carregarHistorico();
          this.alterandoStatus = false;
          this.successMessage =
            'Status atualizado com sucesso.';

          this.cdr.detectChanges();

          this.limparMensagemSucesso();
        },

        error: (error) => {
          console.error(
            'Erro ao alterar status:',
            error,
          );

          this.alterandoStatus = false;

          this.errorMessage =
            error?.error?.message ??
            'Não foi possível alterar o status.';

          this.cdr.detectChanges();
        },
      });
  }

  voltar(): void {
    this.router.navigate([
      '/helpdesk/chamados',
    ]);
  }

  get chamadoFechado(): boolean {
    return this.chamado?.status === 'FECHADO';
  }

  get podeAlterarStatus(): boolean {
    return !!this.chamado &&
      this.chamado.status !== 'FECHADO';
  }

  limparMensagemSucesso(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }
}