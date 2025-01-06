import { inject, Injectable } from '@angular/core';
import { Product, User } from '../models/interface';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartSubject = new BehaviorSubject<Product[]>(this.getCart());

  authService: AuthService = inject(AuthService);
  http: HttpClient = inject(HttpClient);
  userId: number | null = null;

  constructor() {
    this.authService.userSubject.subscribe((user) => {
      this.userId = user?.id || null;
      if (this.userId) {
        this.fetchCartFronDb();
      } else {
        this.cartSubject.next(this.getCart());
      }
    });
  }

  fetchCartFronDb() {
    if (this.userId) {
      this.http
        .get<User>(`https://addtocart-db-5.onrender.com/users/${this.userId}`)
        .subscribe((userData) => {
          const cart = userData.cart || [];
          this.cartSubject.next(cart);
        });
    }
  }

  getCart(): Product[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (this.userId) {
      this.http
        .put(`https://addtocart-db-5.onrender.com/users/${this.userId}`, {
          cart: [...this.cartSubject.getValue(), { ...product, quantity }],
        })
        .subscribe(() => {
          this.fetchCartFronDb();
        });
    } else {
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
  }

  removeFromCart(productId: number) {
    if (this.userId) {
      const upadtedCart = this.cartSubject.getValue().filter((product) => {
        product.id !== productId;
      });
      this.http
        .put(`https://addtocart-db-5.onrender.com/users/${this.userId}`, {
          cart: upadtedCart,
        })
        .subscribe(() => {
          this.fetchCartFronDb();
        });
    } else {
      let cart = this.getCart();
      cart = cart.filter((product: Product) => product.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.cartSubject.next(cart);
    }
  }

  updateCartItemQuantity(productId: number, newQuantity: number): void {
    if (this.userId) {
      const upadtedCart = this.cartSubject
        .getValue()
        .map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      this.http
        .put(`https://addtocart-db-5.onrender.com/users/${this.userId}`, {
          cart: upadtedCart,
        })
        .subscribe(() => {
          this.fetchCartFronDb();
        });
    } else {
      let cart = this.getCart();
      const upadtedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(upadtedCart));
      this.cartSubject.next(upadtedCart);
    }
  }

  isProductInCart(productId: number): boolean {
    const cart = this.getCart();
    return cart.some((product: Product) => product.id === productId);
  }
  clearCart(): void {
    if (this.userId) {
      // Clear cart from the DB for logged-in users
      this.http
        .put(`https://addtocart-db-5.onrender.com/users/${this.userId}`, { cart: [] })
        .subscribe(() => {
          this.cartSubject.next([]); // Clear cart after syncing with DB
        });
    } else {
      // Clear cart from localStorage for non-logged-in users
      localStorage.removeItem('cart');
      this.cartSubject.next([]); // Clear cartSubject after clearing localStorage
    }
  }
}
