import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStoreService } from '@shared/services/auth-store.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export default class AdminLayoutComponent {
  private readonly _authService = inject(AuthStoreService);
  private readonly _router = inject(Router);

  onLogout(): void {
    this._authService.logout();
    this._router.navigate(['/users/login']);
  }
}
