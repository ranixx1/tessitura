import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/register-request';

import { ButtonComponent } from '../../../../shared/components/button/button';
import { InputComponent } from '../../../../shared/components/input/input';
import { CardComponent } from '../../../../shared/components/card/card';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { AlertComponent } from '../../../../shared/components/alert/alert';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  step = 1;
  private readonly step1Fields = ['name', 'birthDate', 'phoneNumber'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      username: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  proximoStep(): void {

    const step1Valid = this.step1Fields.every((field) => {
      const control = this.registerForm.get(field);
      control?.markAsTouched();
      return control?.valid;
    });

    if (!step1Valid) {
      this.cdr.detectChanges();
      return;
    }

    this.step = 2;
    this.cdr.detectChanges();
  }

  voltarStep(): void {
    this.step = 1;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const data: RegisterRequest = this.registerForm.getRawValue();

    this.authService.register(data).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        this.loading = false;

        if (error.status === 409) {
          this.errorMessage = 'Usuário ou e-mail já cadastrado.';
          return;
        }

        this.errorMessage =
          'Não foi possível criar sua conta. Tente novamente.';
      },
    });
  }

  get passwordMinLength(): boolean {
    const value = this.registerForm.get('password')?.value ?? '';
    return value.length >= 8;
  }

  ngOnInit(): void {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }
}