import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

import { CartService } from '../../services/cart.service';
import { Product } from '../../models/interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  productService: ProductService = inject(ProductService);
  products: Product[] = [];
  cartService: CartService = inject(CartService);

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  isProductInCart(productId: number): boolean {
    return this.cartService.isProductInCart(productId);
  }
}
