import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Datos del formulario
  loginData = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  onLogin() {
  // Validación básica
  if (!this.loginData.email || !this.loginData.password) {
    this.errorMessage = 'Todos los campos son obligatorios';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.http.post<any>(`${environment.apiUrl}/api/auth/login`, this.loginData)
    .subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.authService.updateUser(res.user);

        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Credenciales incorrectas o error en el servidor';
        console.error(err);
      }
    });
}
}