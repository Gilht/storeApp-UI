import { Route } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const adminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout.component'),
    canActivate: [adminGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./products/products-list-admin.component'),
      },
      {
        path: 'products/create',
        loadComponent: () => import('./products/product-form-admin.component'),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./products/product-form-admin.component'),
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users-list-admin.component'),
      },
      {
        path: 'sales',
        loadComponent: () => import('./sales/sales-list-admin.component'),
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];
