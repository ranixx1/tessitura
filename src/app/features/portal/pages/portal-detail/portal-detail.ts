import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Categoria } from '../../models/categoria';
import { Portal } from '../../models/portal';
import { PortalConfigService } from '../../services/portal-config.service';

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
  ) {}

  ngOnInit(): void {
    this.portalId = Number(
      this.route.snapshot.paramMap.get('id'),
    );

    this.carregarCategorias();
  }

  private carregarCategorias(): void {
    this.loading = true;

    this.portalConfigService
      .listarCategoriasPorPortal(this.portalId)
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.errorMessage =
            'Não foi possível carregar as categorias.';
        },
      });
  }

  abrirCategoria(categoria: Categoria): void {
    this.router.navigate(
      ['/portal', this.portalId, 'chamado'],
      {
        queryParams: {
          categoriaId: categoria.id,
        },
      },
    );
  }

  voltar(): void {
    this.router.navigate(['/portal']);
  }
}