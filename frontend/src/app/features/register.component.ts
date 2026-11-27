// Created by Harsh Chourasia
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="panel form">
      <h1>Create account</h1>
      <label for="name">Name</label>
      <input id="name" [(ngModel)]="name">
      <label for="email">Email</label>
      <input id="email" type="email" [(ngModel)]="email">
      <label for="password">Password (6+ characters)</label>
      <input id="password" type="password" [(ngModel)]="password" (keyup.enter)="submit()">
      @if (error) { <p class="error">{{ error }}</p> }
      <p><button class="btn" (click)="submit()" [disabled]="busy">Create account</button></p>
      <p class="meta">Already registered? <a routerLink="/login">Log in</a></p>
    </div>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  name = '';
  email = '';
  password = '';
  error = '';
  busy = false;

  submit() {
    this.error = '';
    this.busy = true;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: e => { this.error = e.error?.message || 'Could not create the account.'; this.busy = false; }
    });
  }
}
