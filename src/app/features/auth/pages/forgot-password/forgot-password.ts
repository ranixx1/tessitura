import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ForgotPasswordRequest } from '../../models/forgot-password-request';

import { ButtonComponent } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { CardComponent } from '../../../../shared/components/card/card';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { AlertComponent } from '../../../../shared/components/alert/alert';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.forgotPasswordForm = this.fb.group({
      reset: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid || this.loading) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: ForgotPasswordRequest =
      this.forgotPasswordForm.getRawValue();

    this.authService.forgotPassword(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage =
          response.message ||
          'Se os dados estiverem corretos, você receberá as instruções para redefinir sua senha.';
      },

      error: (error) => {
        this.loading = false;

        if (error.status === 400) {
          this.errorMessage =
            error.error?.message ||
            'Verifique os dados informados.';
          return;
        }

        this.errorMessage =
          'Não foi possível processar a solicitação. Tente novamente.';
      },
    });
  }
}