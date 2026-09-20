import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JwtService } from '../../../core/services/jwt.service';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly jwtService = inject(JwtService);

  readonly userName = signal(this.jwtService.getUsername());
  readonly userInitial = computed(() => this.userName()?.charAt(0)?.toUpperCase() || 'U');
  readonly isAuthPage = signal(this.checkAuthPage(this.router.url));

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(e => this.isAuthPage.set(this.checkAuthPage(e.urlAfterRedirects)));
  }

  private checkAuthPage(url: string): boolean {
    return AUTH_ROUTES.includes(url.split('?')[0]);
  }

  logout(): void {
    this.jwtService.clearSession();
    this.router.navigate(['/login']);
  }
}