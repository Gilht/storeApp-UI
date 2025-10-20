import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toastr = inject(ToastrService);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  registerForm: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
    roles: [[3]],
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);

      this._authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoading.set(false);
          this._toastr.success('Registration successful', 'Welcome');
          this._router.navigate(['/users/login']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this._toastr.error(
            error.error?.message || 'Error registering user',
            'Error'
          );
        },
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
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
    const control = this.registerForm.get(fieldName);

    if (control?.hasError('required')) {
      return 'This field is required';
    }

    if (control?.hasError('email')) {
      return 'Invalid email';
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters`;
    }

    if (control?.hasError('min')) {
      return 'Must be at least 18 years old';
    }

    if (control?.hasError('max')) {
      return 'Invalid age';
    }

    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
}
