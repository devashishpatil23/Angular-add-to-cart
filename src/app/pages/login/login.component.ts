import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  // Initialize default values for userName and password
  userName: string = 'user';
  password: string = '1234';

  ngOnInit(): void {
    // This method is used to set default values
    this.userName = 'user';
    this.password = '1234';
  }

  login(user: User): void {
    this.authService.login(user).subscribe((data) => {
      if (data) {
        alert('User Logged in');
        this.router.navigate(['/']);
      } else {
        alert('Login Failed');
      }
    });
  }
}
