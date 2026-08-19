import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Portal } from '../../../models/portal';
import { Categoria } from '../../../models/categoria';
import { PortalConfigService } from '../../../services/portal-config.service';

@Component({
  selector: 'app-portal-detail',
  standalone: true,
  templateUrl: './portal-detail.html',
  styleUrl: './portal-detail.scss',
})
export class PortalDetailComponent implements OnInit {

  portalId!: number;

  portal: Portal | null = null;
  categorias: Categoria[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly portalConfigService: PortalConfigService,
    private readonly cdr: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('portalId'),
    );

    if (!id) {
      this.router.navigate(['/portal']);
      return;
    }

    this.portalId = id;

    this.carregarCategorias();
  }

  private carregarCategorias(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();


    this.portalConfigService
      .listarCategoriasPorPortal(this.portalId)
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias ?? [];
          this.loading = false;
          this.cdr.detectChanges();

        },

        error: (error) => {
          console.error(
            'Erro ao carregar categorias:',
            error,
          );

          this.categorias = [];
          this.loading = false;
          this.cdr.detectChanges();


          this.errorMessage =
            'Não foi possível carregar as categorias.';
        },
      });
  }

  abrirCategoria(categoria: Categoria): void {
    this.router.navigate(
      ['/helpdesk/novo'],
      {
        queryParams: {
          portalId: this.portalId,
          categoriaId: categoria.id,
        },
      },
    );
  }

  voltar(): void {
    this.router.navigate(['/portal']);
  }
}