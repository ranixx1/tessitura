import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class HeaderComponent {
    private router = inject(Router);
    private readonly jwtService = inject(JwtService);

    userName = this.jwtService.getUsername();

    logout(): void {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }
}