import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  TimeService,
  Time,
} from '../../services/time.service';

import { AdminService } from '../../services/admin.service';

import { UserSummary } from '../../models/user-summary';

import { CardComponent } from '../../../../shared/components/card/card';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { AlertComponent } from '../../../../shared/components/alert/alert';

@Component({
  selector: 'app-time-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    LoadingComponent,
    AlertComponent,
  ],
  templateUrl: './times-management.html',
  styleUrl: './times-management.scss',
})
export class TimeManagementComponent implements OnInit {

  private readonly timeService = inject(TimeService);
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  times: Time[] = [];
  usuarios: UserSummary[] = [];

  timeSelecionado: Time | null = null;

  novoNome = '';
  usuarioSelecionado: number | null = null;

  loading = true;
  loadingUsuarios = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.carregarTimes();
    this.carregarUsuarios();
  }

  carregarTimes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.timeService.listarTodos().subscribe({
      next: (times) => {
        this.times = times;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage = 'Não foi possível carregar os times.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  carregarUsuarios(): void {
    this.loadingUsuarios = true;

    this.adminService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loadingUsuarios = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage =
          'Não foi possível carregar os usuários.';

        this.loadingUsuarios = false;
        this.cdr.detectChanges();
      },
    });
  }

  criarTime(): void {
    const nome = this.novoNome.trim();

    if (!nome) {
      this.errorMessage = 'Informe o nome do time.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.timeService.criar(nome).subscribe({
      next: (time) => {
        this.times.push(time);

        this.novoNome = '';

        this.successMessage =
          'Time criado com sucesso.';

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage =
          'Não foi possível criar o time.';

        this.cdr.detectChanges();
      },
    });
  }

  selecionarTime(time: Time): void {
    this.timeSelecionado = time;
    this.usuarioSelecionado = null;
    this.errorMessage = '';
    this.successMessage = '';

    this.carregarMembros(time);
  }

  carregarMembros(time: Time): void {
    this.timeService.listarMembros(time.id).subscribe({
      next: (membros) => {
        time.membros = membros;

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage =
          'Não foi possível carregar os membros do time.';

        this.cdr.detectChanges();
      },
    });
  }

  adicionarMembro(): void {
    if (
      !this.timeSelecionado ||
      this.usuarioSelecionado === null
    ) {
      this.errorMessage =
        'Selecione um usuário.';

      return;
    }

    const time = this.timeSelecionado;
    const userId = this.usuarioSelecionado;

    if (time.membros.includes(userId)) {
      this.errorMessage =
        'Este usuário já pertence ao time.';

      return;
    }

    this.timeService
      .adicionarMembro(time.id, userId)
      .subscribe({
        next: () => {
          time.membros.push(userId);

          this.usuarioSelecionado = null;

          this.successMessage =
            'Usuário adicionado ao time.';

          this.cdr.detectChanges();
        },

        error: () => {
          this.errorMessage =
            'Não foi possível adicionar o usuário.';

          this.cdr.detectChanges();
        },
      });
  }

  removerMembro(userId: number): void {
    if (!this.timeSelecionado) {
      return;
    }

    const time = this.timeSelecionado;

    this.timeService
      .removerMembro(time.id, userId)
      .subscribe({
        next: () => {
          time.membros = time.membros.filter(
            id => id !== userId,
          );

          this.successMessage =
            'Usuário removido do time.';

          this.cdr.detectChanges();
        },

        error: () => {
          this.errorMessage =
            'Não foi possível remover o usuário.';

          this.cdr.detectChanges();
        },
      });
  }

  deletarTime(time: Time): void {
    const confirmar = window.confirm(
      `Deseja realmente excluir o time "${time.nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    this.timeService.deletar(time.id).subscribe({
      next: () => {
        this.times = this.times.filter(
          t => t.id !== time.id,
        );

        if (
          this.timeSelecionado?.id === time.id
        ) {
          this.timeSelecionado = null;
        }

        this.successMessage =
          'Time excluído com sucesso.';

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage =
          'Não foi possível excluir o time.';

        this.cdr.detectChanges();
      },
    });
  }

  obterUsuario(userId: number): UserSummary | undefined {
    return this.usuarios.find(
      usuario => usuario.id === userId,
    );
  }
}