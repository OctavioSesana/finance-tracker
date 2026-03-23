import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importante para el pipe 'async' o *ngIf
import { AuthService } from '../../../services/auth.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Folder,
  User,
  LogOut,
  PieChart
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  userData: any = null;

  readonly icons = {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Folder,
  User,
  LogOut,
  PieChart
};

  ngOnInit() {
    // Escuchamos los datos del usuario logueado
    this.authService.currentUser$.subscribe(user => {
      this.userData = user;
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}