import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PortalConfigService } from '../../../portal/services/portal-config.service';
import { Subtopico } from '../../../portal/models/subtopico';
import { ChamadoService } from '../../../portal/services/chamado.service';

@Component({
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './novo-chamado.html',
  styleUrl: './novo-chamado.scss',
})
export class NovoChamadoComponent implements OnInit {

  private readonly fb = inject(FormBuilder);

  portalId!: number;
  categoriaId!: number;
  subtopicos: Subtopico[] = [];
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    titulo: ['', [
      Validators.required,
      Validators.minLength(5),
    ]],
    descricao: ['', [
      Validators.required,
      Validators.minLength(10),
    ]],
    subtopicoId: [null as number | null],
    outroSubtopico: [''],
    prioridade: ['', Validators.required],
    escopo: ['', Validators.required],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly portalConfigService: PortalConfigService,
    private readonly chamadoService: ChamadoService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarParametros();
  }

  private carregarParametros(): void {
    this.route.queryParamMap.subscribe((params) => {
      const portalId = Number(params.get('portalId'));
      const categoriaId = Number(params.get('categoriaId'));

      if (!portalId || !categoriaId) {
        this.errorMessage = 'Portal ou categoria não informados.';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.portalId = portalId;
      this.categoriaId = categoriaId;
      this.carregarSubtopicos();
    });
  }

  private carregarSubtopicos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.portalConfigService
      .listarSubtopicosPorCategoria(this.categoriaId)
      .subscribe({
        next: (subtopicos) => {
          this.subtopicos = subtopicos ?? [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar subtópicos:', error);
          this.subtopicos = [];
          this.loading = false;
          this.errorMessage = 'Não foi possível carregar os subtópicos.';
          this.cdr.detectChanges();
        },
      });
  }

  abrirChamado(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.form.getRawValue();

    const request = {
      titulo: formValue.titulo,
      descricao: formValue.descricao,
      portalId: this.portalId,
      categoriaId: this.categoriaId,
      subtopicoId: formValue.subtopicoId,
      outroSubtopico: formValue.outroSubtopico.trim() || null,
      prioridade: formValue.prioridade,
      escopo: formValue.escopo,
    };

    this.chamadoService.criarChamado(request).subscribe({
      next: (chamado) => {
        console.log('Chamado criado:', chamado);
        this.submitting = false;
        this.successMessage = `Chamado ${chamado.codigo} criado com sucesso.`;
        this.form.reset();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/portal', this.portalId]);
        }, 1200);
      },
      error: (error) => {
        console.error('Erro ao criar chamado:', error);
        this.submitting = false;
        this.errorMessage = error?.error?.message ?? 'Não foi possível abrir o chamado.';
        this.cdr.detectChanges();
      },
    });
  }

  voltar(): void {
    if (this.portalId) {
      this.router.navigate(['/portal', this.portalId]);
      return;
    }

    this.router.navigate(['/portal']);
  }
}