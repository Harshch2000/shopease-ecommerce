// Created by Harsh Chourasia
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API } from './config';
import { Category, Page, Product, ProductForm } from './models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  search(q: string, categoryId: number | null, page: number, size = 8) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (q.trim()) params = params.set('q', q.trim());
    if (categoryId !== null) params = params.set('categoryId', categoryId);
    return this.http.get<Page<Product>>(`${API}/products`, { params });
  }
  categories() { return this.http.get<Category[]>(`${API}/categories`); }
  create(p: ProductForm) { return this.http.post<Product>(`${API}/products`, p); }
  update(id: number, p: ProductForm) { return this.http.put<Product>(`${API}/products/${id}`, p); }
  remove(id: number) { return this.http.delete<void>(`${API}/products/${id}`); }
}
