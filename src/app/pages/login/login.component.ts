import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  login(user: User) {
    this.authService.login(user).subscribe((data) => {
      if (data) {
        alert('User Logged in');
        this.router.navigate(['/']);
      } else {
        alert('login Failed');
      }
    });
  }

}
