import { Injectable } from '@angular/core';
import { Product } from '../models/interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartSubject = new BehaviorSubject<Product[]>(this.getCart());

  getCart(): Product[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: Product, quantity: number = 1): void {
    const cart = this.getCart();
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      // If the product already exists in the cart, update the quantity
      existingProduct.quantity = (existingProduct.quantity || 0) + quantity;
    } else {
      // If it's a new product, add it to the cart with quantity
      const productWithQuantity = { ...product, quantity };
      cart.push(productWithQuantity);
    }

    // Save the updated cart to localStorage and update the cartSubject
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  removeFromCart(productId: number) {
    let cart = this.getCart();
    cart = cart.filter((product: Product) => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  updateCartItemQuantity(productId: number, newQuantity: number): void {
    let cart = this.getCart();
    const upadtedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(upadtedCart));
    this.cartSubject.next(upadtedCart);
  }

  isProductInCart(productId: number): boolean {
    const cart = this.getCart();
    return cart.some((product: Product) => product.id === productId);
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.cartSubject.next([]);
  }
}