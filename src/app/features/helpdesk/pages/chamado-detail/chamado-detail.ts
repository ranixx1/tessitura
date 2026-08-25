import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChamadoService } from '../../../portal/services/chamado.service';
import { Chamado } from '../../model/chamado';

@Component({
  selector: 'app-chamado-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chamado-detail.html',
  styleUrls: ['./chamado-detail.scss']
})
export class ChamadoDetailComponent implements OnInit {
  chamado: Chamado | null = null;
  novoComentario: string = '';
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chamadoService: ChamadoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarChamado(Number(id));
    }
  }

  carregarChamado(id: number): void {
    this.loading = true;
    this.chamadoService.buscarPorId(id).subscribe({
      next: (dados) => {
        this.chamado = dados;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  adicionarComentario(): void {
    if (!this.novoComentario.trim() || !this.chamado?.id) return;

    this.chamadoService.adicionarComentario(this.chamado.id, this.novoComentario)
      .subscribe((chamadoAtualizado) => {
        this.chamado = chamadoAtualizado;
        this.novoComentario = '';
        this.cdr.detectChanges();
      });
  }

  alterarStatus(novoStatus: string): void {
    if (!this.chamado?.id) return;

    this.chamadoService.alterarStatus(this.chamado.id, novoStatus)
      .subscribe((chamadoAtualizado) => {
        this.chamado = chamadoAtualizado;
        this.cdr.detectChanges();
      });
  }

  voltar(): void {
    this.router.navigate(['/helpdesk/chamados']);
  }
}