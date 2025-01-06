import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, catchError } from 'rxjs';
import { User } from '../models/interface';

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
        `http://localhost:3000/users?userName=${user.userName}&password=${user.password}`
      )
      .pipe(
        map((users) => {
          if (users.length > 0) {
            const user = users[0];
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

            if (localCart.length > 0) {
              this.http
                .put(`http://localhost:3000/users/${user.id}`, {
                  ...user,
                  cart: localCart,
                })
                .subscribe((data) => {
                  console.log(data);
                  localStorage.removeItem('cart');
                });
            }
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
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
