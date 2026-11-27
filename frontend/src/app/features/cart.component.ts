// Created by Harsh Chourasia
import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { OrderService } from '../core/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, RouterLink],
  template: `
    <h1>Your cart</h1>
    @if (cart.items().length === 0) {
      <p class="empty">Your cart is empty. <a routerLink="/">Browse products</a></p>
    } @else {
      <div class="panel">
        <table>
          <thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr></thead>
          <tbody>
            @for (i of cart.items(); track i.id) {
              <tr>
                <td>{{ i.product.name }}</td>
                <td>{{ i.product.price | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
                <td>
                  <button class="btn ghost small" (click)="change(i.id, i.quantity - 1)" aria-label="Decrease">-</button>
                  {{ i.quantity }}
                  <button class="btn ghost small" (click)="change(i.id, i.quantity + 1)" aria-label="Increase">+</button>
                </td>
                <td>{{ i.product.price * i.quantity | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
                <td><button class="btn danger small" (click)="remove(i.id)">Remove</button></td>
              </tr>
            }
          </tbody>
        </table>
        <p class="row"><strong>Total</strong> <strong>{{ cart.total() | currency: 'INR' : 'symbol' : '1.0-0' }}</strong></p>
      </div>
      <div class="panel">
        <h3>Checkout</h3>
        <label for="addr">Shipping address</label>
        <textarea id="addr" rows="3" [(ngModel)]="address"></textarea>
        <p class="meta">Payment is simulated in this version: orders are marked as paid.</p>
        @if (error) { <p class="error">{{ error }}</p> }
        <button class="btn" (click)="checkout()" [disabled]="busy">Place order</button>
      </div>
    }
  `
})
export class CartComponent {
  cart = inject(CartService);
  private orders = inject(OrderService);
  private router = inject(Router);
  address = '';
  error = '';
  busy = false;

  constructor() { this.cart.load(); }

  change(id: number, qty: number) {
    this.error = '';
    this.cart.update(id, qty).subscribe({ error: e => (this.error = e.error?.message || 'Could not update the cart.') });
  }
  remove(id: number) { this.cart.remove(id).subscribe(); }
  checkout() {
    this.error = '';
    this.busy = true;
    this.orders.checkout(this.address).subscribe({
      next: () => { this.cart.clear(); this.router.navigate(['/orders']); },
      error: e => { this.error = e.error?.message || 'Could not place the order.'; this.busy = false; }
    });
  }
}
