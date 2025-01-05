import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http: HttpClient = inject(HttpClient);

  getProducts() {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }

  getProductById(id: number) {
    return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }
}
