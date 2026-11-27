// Created by Harsh Chourasia
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API } from './config';
import { AuthUser } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  user = signal<AuthUser | null>(this.restore());
  isAdmin = computed(() => this.user()?.role === 'ADMIN');

  private restore(): AuthUser | null {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }
  private save(u: AuthUser) {
    localStorage.setItem('user', JSON.stringify(u));
    this.user.set(u);
  }
  token(): string | null { return this.user()?.token ?? null; }

  login(email: string, password: string) {
    return this.http.post<AuthUser>(`${API}/auth/login`, { email, password }).pipe(tap(u => this.save(u)));
  }
  register(name: string, email: string, password: string) {
    return this.http.post<AuthUser>(`${API}/auth/register`, { name, email, password }).pipe(tap(u => this.save(u)));
  }
  logout() {
    localStorage.removeItem('user');
    this.user.set(null);
  }
}
