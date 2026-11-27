// Created by Harsh Chourasia
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API } from './config';
import { CartItem } from './models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  items = signal<CartItem[]>([]);
  count = computed(() => this.items().reduce((n, i) => n + i.quantity, 0));
  total = computed(() => this.items().reduce((s, i) => s + i.product.price * i.quantity, 0));

  load() { this.http.get<CartItem[]>(`${API}/cart`).subscribe({ next: i => this.items.set(i), error: () => this.items.set([]) }); }
  clear() { this.items.set([]); }
  add(productId: number, quantity = 1) {
    return this.http.post<CartItem[]>(`${API}/cart`, { productId, quantity }).pipe(tap(i => this.items.set(i)));
  }
  update(itemId: number, quantity: number) {
    return this.http.put<CartItem[]>(`${API}/cart/${itemId}`, null, { params: { quantity } }).pipe(tap(i => this.items.set(i)));
  }
  remove(itemId: number) {
    return this.http.delete<CartItem[]>(`${API}/cart/${itemId}`).pipe(tap(i => this.items.set(i)));
  }
}
