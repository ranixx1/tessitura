import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Portal } from '../../models/portal';
import { PortalConfigService } from '../../services/portal-config.service';

@Component({
  selector: 'app-portal-dashboard',
  standalone: true,
  templateUrl: './portal-dashboard.html',
  styleUrl: './portal-dashboard.scss',
})
export class PortalDashboardComponent implements OnInit {

  portals: Portal[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private readonly portalConfigService: PortalConfigService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.carregarPortais();
  }

  carregarPortais(): void {
    this.loading = true;
    this.errorMessage = '';

    this.portalConfigService.listarPortais().subscribe({
      next: (portals) => {
        console.log('Portais recebidos:', portals);

        this.portals = portals ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Erro ao carregar portais:', error);

        this.portals = [];
        this.loading = false;

        this.errorMessage =
          'Não foi possível carregar os portais.';
      },

      complete: () => {
        this.loading = false;
      },
    });
  }

  abrirPortal(portal: Portal): void {
    this.router.navigate(['/portal', portal.id]);
  }
}