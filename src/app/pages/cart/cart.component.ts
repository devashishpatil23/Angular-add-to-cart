import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/interface';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cart: Product[] = [];
  cartService: CartService = inject(CartService);
  totalQuantity: number = 0;
  totalPrice: number = 0;

  ngOnInit(): void {
    this.getCartItem();
  }

  getCartItem() {
    this.cartService.cartSubject.subscribe((cart) => {
      this.cart = cart;
      this.calculateTotals();
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(item: Product, action: 'add' | 'min') {
    const currentQuantity = item.quantity ?? 1; // Default to 1 if undefined
    const newQuantity =
      action === 'add' ? currentQuantity + 1 : currentQuantity - 1;

    if (newQuantity < 1) return;
    this.cartService.updateCartItemQuantity(item.id, newQuantity);
  }

  calculateTotals(): void {
    this.totalQuantity = this.cart.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
    this.totalPrice = this.cart.reduce(
      (total, item) => total + Number(item.price) * (item.quantity || 1),
      0
    );
  }
}
