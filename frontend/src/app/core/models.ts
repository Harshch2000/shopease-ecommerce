// Created by Harsh Chourasia
export interface Category { id: number; name: string; }
export interface Product {
  id: number; name: string; description: string; price: number; stock: number;
  imageUrl: string; category: Category | null;
}
export interface Page<T> { content: T[]; totalPages: number; number: number; }
export interface CartItem { id: number; product: Product; quantity: number; }
export interface OrderItem { productId: number; productName: string; quantity: number; price: number; }
export interface Order {
  id: number; createdAt: string; status: string; total: number; paymentStatus: string;
  shippingAddress: string; customerEmail: string; items: OrderItem[];
}
export interface AuthUser { token: string; name: string; email: string; role: string; }
export interface ProductForm {
  name: string; description: string; price: number; stock: number; imageUrl: string; categoryId: number | null;
}
