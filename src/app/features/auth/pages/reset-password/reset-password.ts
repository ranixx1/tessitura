import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ResetPasswordRequest } from '../../models/reset-password-request';

import { ButtonComponent } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { CardComponent } from '../../../../shared/components/card/card';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { AlertComponent } from '../../../../shared/components/alert/alert';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPasswordComponent {
  resetForm: FormGroup;

  token = '';

  errorMessage = '';
  successMessage = '';

  loading = false;
  completed = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.resetForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
        ],
      ],
    });

    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  onSubmit(): void {
    if (this.resetForm.invalid || this.loading) {
      this.resetForm.markAllAsTouched();
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Token de recuperação inválido ou ausente.';
      return;
    }

    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: ResetPasswordRequest = {
      token: this.token,
      newPassword,
    };

    this.authService.resetPassword(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
        this.completed = true;
        this.resetForm.reset();
      },

      error: (error) => {
        this.loading = false;

        if (error.status === 400) {
          this.errorMessage =
            'O link de recuperação é inválido ou expirou.';
          return;
        }

        this.errorMessage =
          'Não foi possível alterar sua senha. Tente novamente.';
      },
    });
  }
}