import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  registerData = {
    name: '',
    lastName: '',
    email: '',
    password: ''
  };

  confirmPassword = '';

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);

  onRegister() {

    // VALIDACIONES
    if (!this.registerData.name ||
        !this.registerData.lastName ||
        !this.registerData.email ||
        !this.registerData.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>(`${environment.apiUrl}/api/auth/register`, this.registerData)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = 'Cuenta creada correctamente 🎉';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
  this.isLoading = false;

  console.error('ERROR COMPLETO:', err);

  if (err.status === 409) {
    this.errorMessage = 'El email ya está registrado';
  } else if (err.status === 400) {
    this.errorMessage = err.error?.message || 'Datos inválidos';
  } else {
    this.errorMessage = 'Error al registrar usuario';
  }
}
      });
  }
}