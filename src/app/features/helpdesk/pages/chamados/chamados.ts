import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChamadoResponse } from '../../../portal/models/chamado-response';
import { ChamadoService } from '../../../portal/services/chamado.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chamados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chamados.html',
  styleUrl: './chamados.scss',
})
export class ChamadosComponent implements OnInit {

  chamados: ChamadoResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private readonly chamadoService: ChamadoService,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.carregarChamados();
  }

  carregarChamados(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.chamadoService.listarChamados().subscribe({
      next: (chamados) => {
        this.chamados = chamados ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      
      error: (error) => {
        console.error('Erro ao carregar chamados:', error);
        this.chamados = [];
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar os chamados.';
        this.cdr.detectChanges();
      },
      
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  } 
}