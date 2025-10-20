import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStoreService } from '@shared/services/auth-store.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthStoreService);
  const router = inject(Router);

  const userInfo = authService.getUserInfo();

  if (!userInfo) {
    router.navigate(['/users/login']);
    return false;
  }
 
  const isAdmin = userInfo.roles?.some((role: string) => role === 'ADMIN');

  if (!isAdmin) {
    router.navigate(['/products']);
    return false;
  }

  return true;
};
