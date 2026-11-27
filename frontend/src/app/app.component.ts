// Created by Harsh Chourasia
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { CartService } from './core/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <a routerLink="/" class="brand">ShopEase</a>
      <div class="links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Products</a>
        @if (auth.user()) {
          <a routerLink="/cart" routerLinkActive="active">Cart ({{ cart.count() }})</a>
          <a routerLink="/orders" routerLinkActive="active">My orders</a>
          @if (auth.isAdmin()) { <a routerLink="/admin" routerLinkActive="active">Admin</a> }
          <a href="#" (click)="logout($event)">Log out ({{ auth.user()!.name }})</a>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Log in</a>
          <a routerLink="/register" routerLinkActive="active">Create account</a>
        }
      </div>
    </nav>
    <main class="container"><router-outlet /></main>
    <footer class="footer">ShopEase &copy; 2026. Created by Harsh Chourasia</footer>
  `
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);

  ngOnInit() { if (this.auth.user()) this.cart.load(); }
  logout(e: Event) {
    e.preventDefault();
    this.auth.logout();
    this.cart.clear();
    this.router.navigate(['/login']);
  }
}
