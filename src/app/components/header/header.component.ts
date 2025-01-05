import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  cartService: CartService = inject(CartService);
  router: Router = inject(Router);
  cartItemCount: number = 0;
  isLoggedIn: boolean = false;
  private cartSubscription!: Subscription; // To store the
  private userSubscription!: Subscription; // To store the

  ngOnInit(): void {
    this.subscribeToCart();
    this.subscribeToUser();
    console.log(this.isLoggedIn);
  }

  // Separate function to subscribe to cart updates
  subscribeToCart(): void {
    this.cartSubscription = this.cartService.cartSubject.subscribe((cart) => {
      this.cartItemCount = cart.length;
    });
  }
  subscribeToUser(): void {
    this.userSubscription = this.authService.userSubject.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.isLoggedIn = false;
    this.router.navigate(['login']);
  }

  // Unsubscribe to avoid memory leaks
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
