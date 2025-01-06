import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http: HttpClient = inject(HttpClient);

  getProducts() {
    return this.http.get<Product[]>('https://addtocart-db-5.onrender.com/products');
  }

  getProductById(id: number) {
    return this.http.get<Product>(`https://addtocart-db-5.onrender.com/products/${id}`);
  }
}
