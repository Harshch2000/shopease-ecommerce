// Created by Harsh Chourasia
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="panel form">
      <h1>Log in</h1>
      <label for="email">Email</label>
      <input id="email" type="email" [(ngModel)]="email" (keyup.enter)="submit()">
      <label for="password">Password</label>
      <input id="password" type="password" [(ngModel)]="password" (keyup.enter)="submit()">
      @if (error) { <p class="error">{{ error }}</p> }
      <p><button class="btn" (click)="submit()" [disabled]="busy">Log in</button></p>
      <p class="meta">New here? <a routerLink="/register">Create an account</a></p>
      <p class="meta">Demo admin: admin&#64;shop.com / Admin&#64;123</p>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  busy = false;

  submit() {
    this.error = '';
    this.busy = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.cart.load(); this.router.navigate(['/']); },
      error: e => { this.error = e.error?.message || 'Could not log in. Check the server is running.'; this.busy = false; }
    });
  }
}
