import { Route } from '@angular/router';
import { NotFoundComponent } from '@layout/not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    path: 'products',
    loadChildren: () => import('../app/features/products/products.routes'),
  },
  {
    path: 'checkout',
    loadComponent: () => import('../app/features/checkout/checkout.component'),
  },
  {
    path: 'users/register',
    loadComponent: () => import('../app/features/auth/register/register.component'),
  },
  {
    path: 'users/login',
    loadComponent: () => import('../app/features/auth/login/login.component'),
  },
  {
    path: 'profile',
    loadComponent: () => import('../app/features/profile/profile.component'),
  },
  {
    path: 'admin',
    loadChildren: () => import('../app/features/admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
