// Created by Harsh Chourasia
import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../core/order.service';
import { Order } from '../core/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: `
    <h1>My orders</h1>
    @if (orders.length === 0) {
      <p class="empty">You have no orders yet. <a routerLink="/">Start shopping</a></p>
    }
    @for (o of orders; track o.id) {
      <div class="panel">
        <div class="row">
          <strong>Order #{{ o.id }}</strong>
          <span class="badge">{{ o.status }}</span>
        </div>
        <p class="meta">{{ o.createdAt | date: 'medium' }} &middot; {{ o.paymentStatus }}</p>
        <ul>
          @for (i of o.items; track i.productId) {
            <li>{{ i.productName }} x {{ i.quantity }} ({{ i.price | currency: 'INR' : 'symbol' : '1.0-0' }})</li>
          }
        </ul>
        <p class="meta">Ships to: {{ o.shippingAddress }}</p>
        <strong>Total {{ o.total | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
      </div>
    }
  `
})
export class OrdersComponent implements OnInit {
  private api = inject(OrderService);
  orders: Order[] = [];
  ngOnInit() { this.api.mine().subscribe(o => (this.orders = o)); }
}
