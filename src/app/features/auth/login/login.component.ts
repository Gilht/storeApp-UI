import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthStoreService } from '@shared/services/auth-store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _http = inject(AuthStoreService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toastr = inject(ToastrService);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  loginForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      const { email, password } = this.loginForm.value;

      this._authService.login(email, password).subscribe({
        next: (response) => {
          console.log(response);
          this.isLoading.set(false);
          this._http.saveToken(
            response.payload?.data.accessToken,
            response.payload?.data.refreshToken
          );
          this._toastr.success('Inicio de sesión exitoso', 'Bienvenido');

          // Verificar si el usuario es administrador
          const userInfo = this._http.getUserInfo();
          const isAdmin = userInfo?.roles?.some(
            (role: string) => role === 'ADMIN'
          );

          // Redirigir según el rol
          if (isAdmin) {
            this._router.navigate(['/admin']);
          } else {
            this._router.navigate(['/products']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this._toastr.error(
            error.error?.message || 'Credenciales inválidas',
            'Error'
          );
        },
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control?.hasError('email')) {
      return 'Email inválido';
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
}
