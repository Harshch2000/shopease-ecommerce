// Created by Harsh Chourasia
import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../core/product.service';
import { OrderService } from '../core/order.service';
import { Category, Order, Product, ProductForm } from '../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <h1>Admin</h1>
    <div class="tabs">
      <button class="btn small" [class.ghost]="tab !== 'products'" (click)="tab = 'products'">Products</button>
      <button class="btn small" [class.ghost]="tab !== 'orders'" (click)="tab = 'orders'; loadOrders()">Orders</button>
    </div>
    @if (msg) { <p class="notice">{{ msg }}</p> }
    @if (error) { <p class="error">{{ error }}</p> }

    @if (tab === 'products') {
      <div class="panel">
        <h3>{{ editId ? 'Edit product' : 'New product' }}</h3>
        <label for="pn">Name</label><input id="pn" [(ngModel)]="form.name">
        <label for="pd">Description</label><textarea id="pd" rows="2" [(ngModel)]="form.description"></textarea>
        <div class="two">
          <div><label for="pp">Price (INR)</label><input id="pp" type="number" min="0" [(ngModel)]="form.price"></div>
          <div><label for="ps">Stock</label><input id="ps" type="number" min="0" [(ngModel)]="form.stock"></div>
        </div>
        <label for="pc">Category</label>
        <select id="pc" [(ngModel)]="form.categoryId">
          <option [ngValue]="null">Choose a category</option>
          @for (c of categories; track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
        </select>
        <label for="pi">Image URL</label><input id="pi" [(ngModel)]="form.imageUrl">
        <p>
          <button class="btn" (click)="save()">{{ editId ? 'Save changes' : 'Add product' }}</button>
          @if (editId) { <button class="btn ghost" (click)="reset()">Cancel</button> }
        </p>
      </div>
      <div class="panel">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            @for (p of products; track p.id) {
              <tr>
                <td>{{ p.name }}</td><td>{{ p.category?.name }}</td>
                <td>{{ p.price | currency: 'INR' : 'symbol' : '1.0-0' }}</td><td>{{ p.stock }}</td>
                <td>
                  <button class="btn ghost small" (click)="edit(p)">Edit</button>
                  <button class="btn danger small" (click)="remove(p)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <div class="pager">
          <button class="btn ghost small" [disabled]="page === 0" (click)="page = page - 1; loadProducts()">Previous</button>
          <span class="meta">Page {{ page + 1 }} of {{ totalPages || 1 }}</span>
          <button class="btn ghost small" [disabled]="page + 1 >= totalPages" (click)="page = page + 1; loadProducts()">Next</button>
        </div>
      </div>
    } @else {
      @if (orders.length === 0) { <p class="empty">No orders have been placed yet.</p> }
      @for (o of orders; track o.id) {
        <div class="panel">
          <div class="row">
            <strong>Order #{{ o.id }} &middot; {{ o.customerEmail }}</strong>
            <select [ngModel]="o.status" (ngModelChange)="setStatus(o, $event)" aria-label="Order status">
              @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
            </select>
          </div>
          <ul>
            @for (i of o.items; track i.productId) { <li>{{ i.productName }} x {{ i.quantity }}</li> }
          </ul>
          <p class="meta">Ships to: {{ o.shippingAddress }}</p>
          <strong>{{ o.total | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
        </div>
      }
    }
  `
})
export class AdminComponent implements OnInit {
  private productApi = inject(ProductService);
  private orderApi = inject(OrderService);
  tab: 'products' | 'orders' = 'products';
  products: Product[] = [];
  categories: Category[] = [];
  orders: Order[] = [];
  statuses = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  page = 0;
  totalPages = 0;
  editId: number | null = null;
  form: ProductForm = this.blank();
  msg = '';
  error = '';

  ngOnInit() {
    this.productApi.categories().subscribe(c => (this.categories = c));
    this.loadProducts();
  }
  private blank(): ProductForm {
    return { name: '', description: '', price: 0, stock: 0, imageUrl: '', categoryId: null };
  }
  private fail(e: any) { this.error = e.error?.message || 'Something went wrong.'; this.msg = ''; }
  private ok(m: string) { this.msg = m; this.error = ''; }

  loadProducts() { this.productApi.search('', null, this.page, 10).subscribe(r => { this.products = r.content; this.totalPages = r.totalPages; }); }
  loadOrders() { this.orderApi.all().subscribe(o => (this.orders = o)); }
  reset() { this.editId = null; this.form = this.blank(); }
  edit(p: Product) {
    this.editId = p.id;
    this.form = { name: p.name, description: p.description, price: p.price, stock: p.stock, imageUrl: p.imageUrl, categoryId: p.category?.id ?? null };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  save() {
    const req = this.editId ? this.productApi.update(this.editId, this.form) : this.productApi.create(this.form);
    req.subscribe({
      next: () => { this.ok(this.editId ? 'Product updated.' : 'Product added.'); this.reset(); this.loadProducts(); },
      error: e => this.fail(e)
    });
  }
  remove(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    this.productApi.remove(p.id).subscribe({ next: () => { this.ok('Product deleted.'); this.loadProducts(); }, error: e => this.fail(e) });
  }
  setStatus(o: Order, status: string) {
    this.orderApi.setStatus(o.id, status).subscribe({ next: u => { o.status = u.status; this.ok(`Order #${o.id} is now ${u.status}.`); }, error: e => this.fail(e) });
  }
}
