import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStoreService } from '@shared/services/auth-store.service';
import { ProfileService } from './profile.service';
import { UserProfile } from './profile.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export default class ProfileComponent implements OnInit {
  private readonly _authService = inject(AuthStoreService);
  private readonly _profileService = inject(ProfileService);
  private readonly _router = inject(Router);

  readonly userProfile = signal<UserProfile | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const userInfo = this._authService.getUserInfo();

    if (!userInfo) {
      this._router.navigate(['/users/login']);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // Obtener perfil por email
    this._profileService.getUserByEmail(userInfo.email).subscribe({
      next: (response) => {
        this.userProfile.set(response.payload?.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error.set('Error al cargar el perfil de usuario');
        this.isLoading.set(false);
      }
    });
  }

  getRoleNames(): string {
    const roles = this.userProfile()?.roles;
    if (!roles || roles.length === 0) return 'Sin roles asignados';
    return roles.map(role => role.name).join(', ');
  }

  onLogout(): void {
    this._authService.logout();
  }
}
