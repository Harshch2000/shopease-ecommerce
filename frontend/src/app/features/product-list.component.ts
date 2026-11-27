// Created by Harsh Chourasia
import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../core/product.service';
import { CartService } from '../core/cart.service';
import { AuthService } from '../core/auth.service';
import { Category, Product } from '../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <h1>Products</h1>
    <div class="toolbar">
      <input placeholder="Search products" [(ngModel)]="q" (keyup.enter)="search()">
      <select [ngModel]="categoryId" (ngModelChange)="categoryId = $event; search()" aria-label="Category">
        <option [ngValue]="null">All categories</option>
        @for (c of categories; track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
      </select>
      <button class="btn" (click)="search()">Search</button>
    </div>
    @if (msg) { <p class="notice">{{ msg }}</p> }
    @if (products.length === 0) {
      <p class="empty">No products match your search. Try a different word or category.</p>
    }
    <div class="grid">
      @for (p of products; track p.id) {
        <div class="card">
          <img [src]="p.imageUrl" [alt]="p.name">
          <div class="body">
            <strong>{{ p.name }}</strong>
            <span class="meta">{{ p.category?.name }}</span>
            <span class="desc">{{ p.description }}</span>
            <span class="price">{{ p.price | currency: 'INR' : 'symbol' : '1.0-0' }}</span>
            <span class="meta">{{ p.stock > 0 ? p.stock + ' in stock' : 'Out of stock' }}</span>
            <button class="btn" [disabled]="p.stock === 0" (click)="add(p)">Add to cart</button>
          </div>
        </div>
      }
    </div>
    @if (totalPages > 1) {
      <div class="pager">
        <button class="btn ghost small" [disabled]="page === 0" (click)="go(page - 1)">Previous</button>
        <span class="meta">Page {{ page + 1 }} of {{ totalPages }}</span>
        <button class="btn ghost small" [disabled]="page + 1 >= totalPages" (click)="go(page + 1)">Next</button>
      </div>
    }
  `
})
export class ProductListComponent implements OnInit {
  private api = inject(ProductService);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);
  products: Product[] = [];
  categories: Category[] = [];
  q = '';
  categoryId: number | null = null;
  page = 0;
  totalPages = 0;
  msg = '';

  ngOnInit() {
    this.api.categories().subscribe(c => (this.categories = c));
    this.load();
  }
  load() {
    this.api.search(this.q, this.categoryId, this.page).subscribe(r => {
      this.products = r.content;
      this.totalPages = r.totalPages;
    });
  }
  search() { this.page = 0; this.load(); }
  go(p: number) { this.page = p; this.load(); }
  add(p: Product) {
    if (!this.auth.user()) { this.router.navigate(['/login']); return; }
    this.cart.add(p.id, 1).subscribe({
      next: () => (this.msg = `${p.name} added to your cart.`),
      error: e => (this.msg = e.error?.message || 'Could not add to cart.')
    });
  }
}
