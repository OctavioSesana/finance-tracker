import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Creamos la fuente de datos (BehaviorSubject).
  // Intenta leer del localStorage al inicio, si no hay nada, es null.
  private currentUserSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // 2. Exponemos los datos como un Observable para que los componentes se suscriban
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  // MÉTODOS PARA ACTUALIZAR DATOS

  // A) Guardar Usuario (Login o Actualización de Perfil)
  updateUser(user: any) {
    // 1. Guardamos en el disco duro (LocalStorage)
    localStorage.setItem('user', JSON.stringify(user));
    
    // 2. ¡EMITIMOS LA SEÑAL! 📡 Todos los componentes se enteran
    this.currentUserSubject.next(user);
  }

  // B) Cerrar Sesión
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null); // Emitimos "vacío"
  }

  getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

  // C) Obtener valor actual sin suscribirse (para casos puntuales)
  get currentUserValue() {
    return this.currentUserSubject.value;
  }
}