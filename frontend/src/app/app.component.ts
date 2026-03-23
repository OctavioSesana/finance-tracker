import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  isUserLoggedIn = false;
  isLoginPage = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 1. Escuchar si hay usuario
    this.authService.currentUser$.subscribe(user => {
      this.isUserLoggedIn = !!user;
    });

    // 2. Escuchar en qué ruta estamos
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login' || event.url === '/';
    });
  }

  // Esta función decide si mostrar el sidebar
  showSidebar(): boolean {
    return this.isUserLoggedIn && !this.isLoginPage;
  }
}