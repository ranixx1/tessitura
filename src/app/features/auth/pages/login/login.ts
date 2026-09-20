import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../../../core/services/jwt.service';

import { LoginRequest } from '../../models/login-request';

import { ButtonComponent } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { CardComponent } from '../../../../shared/components/card/card';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { AlertComponent } from '../../../../shared/components/alert/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
    CardComponent,
    LoadingComponent,
    AlertComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.jwtService.setToken(response.token);
        this.loading = false;

        this.router.navigate(['/portal']);
      },

      error: (error) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Usuário ou senha inválidos.';
          return;
        }

        this.errorMessage =
          'Não foi possível realizar o login. Tente novamente.';
      },
    });
  }
}