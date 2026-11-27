// Created by Harsh Chourasia
import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/product-list.component').then(m => m.ProductListComponent) },
  { path: 'login', loadComponent: () => import('./features/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/register.component').then(m => m.RegisterComponent) },
  { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./features/cart.component').then(m => m.CartComponent) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./features/orders.component').then(m => m.OrdersComponent) },
  { path: 'admin', canActivate: [authGuard, adminGuard], loadComponent: () => import('./features/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '' }
];
