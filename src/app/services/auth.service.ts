import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/interface';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  userSubject = new BehaviorSubject<User | null>(
    this.getUserFromLocalStorage()
  );

  private getUserFromLocalStorage(): User | null {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  login(user: User) {
    return this.http
      .get<User[]>(
        `https://addtocart-db-5.onrender.com/users?userName=${user.userName}&password=${user.password}`
      )
      .pipe(
        map((users) => {
          if (users.length > 0) {
            const loggedInUser = users[0];
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

            if (localCart.length > 0) {
              this.http
                .put(
                  `https://addtocart-db-5.onrender.com/users/${loggedInUser.id}`,
                  {
                    ...loggedInUser,
                    cart: localCart,
                  }
                )
                .subscribe(() => {
                  localStorage.removeItem('cart');
                  // Emit the cart after syncing with the backend
                });
            }
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            this.userSubject.next(loggedInUser);
       
            return true;
          }
          return false;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
