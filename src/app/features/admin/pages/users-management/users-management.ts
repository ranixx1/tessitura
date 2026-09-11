import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../services/admin.service';
import { UserSummary } from '../../models/user-summary';
import { UserDetail } from '../../models/user-detail';
import { ROLE_LABELS } from '../../models/role';

import { CardComponent } from '../../../../shared/components/card/card';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { AlertComponent } from '../../../../shared/components/alert/alert';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, LoadingComponent, AlertComponent],
  templateUrl: './users-management.html',
  styleUrl: './users-management.scss',
})
export class UsersManagementComponent implements OnInit {

  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly roleLabels = ROLE_LABELS;
  readonly rolesDisponiveis = Object.keys(ROLE_LABELS);

  usuarios: UserSummary[] = [];
  loading = true;
  errorMessage = '';

  usuarioSelecionado: UserDetail | null = null;
  loadingDetalhe = false;

  filtroTexto = '';

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os usuários.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get usuariosFiltrados(): UserSummary[] {
    const termo = this.filtroTexto.trim().toLowerCase();
    if (!termo) return this.usuarios;

    return this.usuarios.filter((u) =>
      u.username.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo),
    );
  }

  abrirDetalhe(usuario: UserSummary): void {
    this.loadingDetalhe = true;
    this.usuarioSelecionado = null;

    this.adminService.detalharUsuario(usuario.id).subscribe({
      next: (detalhe) => {
        this.usuarioSelecionado = detalhe;
        this.loadingDetalhe = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os detalhes do usuário.';
        this.loadingDetalhe = false;
        this.cdr.detectChanges();
      },
    });
  }

  fecharDetalhe(): void {
    this.usuarioSelecionado = null;
  }

  obterIniciais(nome?: string): string {
    if (!nome) return 'US';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  alterarRole(usuario: UserDetail, novaRole: string): void {
    const roleAnterior = usuario.role;
    usuario.role = novaRole;

    this.adminService.alterarRole(usuario.id, novaRole).subscribe({
      next: () => {
        const naLista = this.usuarios.find((u) => u.id === usuario.id);
        if (naLista) naLista.role = novaRole;
        this.cdr.detectChanges();
      },
      error: () => {
        usuario.role = roleAnterior;
        this.errorMessage = 'Não foi possível alterar a role.';
        this.cdr.detectChanges();
      },
    });
  }

  toggleAtivo(usuario: UserSummary | UserDetail): void {
    const novoStatus = !usuario.active;

    this.adminService.toggleAtivo(usuario.id, novoStatus).subscribe({
      next: () => {
        usuario.active = novoStatus;

        const naLista = this.usuarios.find((u) => u.id === usuario.id);
        if (naLista) naLista.active = novoStatus;

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Não foi possível atualizar o status do usuário.';
        this.cdr.detectChanges();
      },
    });
  }
}