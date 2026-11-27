// Created by Harsh Chourasia
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './config';
import { Order } from './models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  checkout(shippingAddress: string) { return this.http.post<Order>(`${API}/orders/checkout`, { shippingAddress }); }
  mine() { return this.http.get<Order[]>(`${API}/orders`); }
  all() { return this.http.get<Order[]>(`${API}/admin/orders`); }
  setStatus(id: number, status: string) {
    return this.http.put<Order>(`${API}/admin/orders/${id}/status`, null, { params: { status } });
  }
}
