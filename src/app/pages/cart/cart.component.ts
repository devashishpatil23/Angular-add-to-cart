import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../models/interface';
import { CartService } from '../../services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Product[] = [];
  cartService: CartService = inject(CartService);
  totalQuantity: number = 0;
  totalPrice: number = 0;
  private destroy$ = new Subject<void>(); // Subject to handle unsubscription

  ngOnInit(): void {
    // Subscribe to cart updates
    this.cartService.cartSubject
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe on component destroy
      .subscribe((cart) => {
        this.cart = cart;
        this.calculateTotals();
      });
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(item: Product, action: 'add' | 'min'): void {
    const currentQuantity = item.quantity ?? 1; // Default to 1 if undefined
    const newQuantity = action === 'add' ? currentQuantity + 1 : currentQuantity - 1;

    if (newQuantity < 1) return; // Prevent quantity from going below 1
    this.cartService.updateCartItemQuantity(item.id, newQuantity);
  }

  calculateTotals(): void {
    this.totalQuantity = this.cart.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );

    this.totalPrice = this.cart.reduce(
      (total, item) => total + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
  }
}
