import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class TransactionsComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private apiUrl = 'http://localhost:3000/api/transactions';
  errorModal = false;
  errorMessage = '';
  sortOrder: string = 'desc';

  //categorias predefinidas
  presetCategories = [
    { name: 'Food & Drinks', icon: '🍔' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Friendship', icon: '🙌' },
    { name: 'Home', icon: '🏠' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Health', icon: '🏥' },
    { name: 'Salary', icon: '💰' },
    { name: 'Entertainment', icon: '🍿' },
    { name: 'Services', icon: '⚡' },
    { name: 'Investments', icon: '📈' },
    {name: 'Shopping', icon: '🛍️' },
    { name: 'Others', icon: '✨' }
  ];

  confirmDeleteModal = false;
  transactionToDelete: number | null = null;
  
  // Datos de la API
  transactions: any[] = [];
  userAccounts: any[] = [];
  
  // Variables de filtrado (Las que tiraban error)
  searchTerm: string = '';
  selectedType: string = 'all';
  selectedCategory: string = 'all';

  // Estado del Modal
  isModalOpen = false;
  isEditing = false;
  formData: any = { 
    type: 'expense', 
    amount: 0, 
    category: '', 
    accountId: null, 
    description: '', 
    date: '' 
  };

  ngOnInit() {
    this.loadTransactions();
    this.loadUserAccounts();
  }

  showError(message: string) {
  this.errorMessage = message;
  this.errorModal = true;
}

closeErrorModal() {
  this.errorModal = false;
  this.errorMessage = '';
}

  // LÓGICA DE FILTRADO
  get filteredTransactions() {
  let filtered = this.transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(this.searchTerm.toLowerCase());
    const matchesType = this.selectedType === 'all' || t.type === this.selectedType;
    const matchesCategory = this.selectedCategory === 'all' || t.category.toLowerCase() === this.selectedCategory.toLowerCase();

    return matchesSearch && matchesType && matchesCategory;
  });

  // ORDENAMIENTO POR FECHA
  return [...filtered].sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;

    return this.sortOrder === 'asc'
      ? dateA - dateB   // más viejas primero
      : dateB - dateA;  // más nuevas primero
  });
}

  get totalTransactions(): number {
    return this.filteredTransactions.length;
  }

  toggleSortByDate() {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  console.log('Orden actual:', this.sortOrder); // debug
}

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.selectedCategory = 'all';
  }

  loadTransactions() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No hay token');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
    next: (data) => {
      console.log('📦 Transactions:', data);
      this.transactions = data;
    },
    error: (err) => {
      console.error('❌ Error cargando transacciones:', err);
    }
  });
}

  loadUserAccounts() {
    // 3. Usa el servicio igual que en AccountsComponent
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.userAccounts = data;
        console.log('Cuentas cargadas con éxito:', this.userAccounts);
      },
      error: (err) => {
        console.error('Error cargando cuentas en transacciones', err);
      }
    });
  }

  saveTransaction() {
  const token = localStorage.getItem('token');

  if (!token) {
    this.showError('No estás autenticado.');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  // VALIDACIONES
  if (!this.formData.accountId || isNaN(Number(this.formData.accountId))) {
    this.showError('Seleccioná una cuenta válida.');
    return;
  }

  if (!this.formData.category) {
    this.showError('Seleccioná una categoría.');
    return;
  }

  if (!this.formData.amount || this.formData.amount <= 0) {
    this.showError('Ingresá un monto válido.');
    return;
  }

  const payload = {
    amount: Number(this.formData.amount),
    type: this.formData.type,
    category: this.formData.category,
    accountId: Number(this.formData.accountId),
    date: this.formData.date || new Date().toISOString().split('T')[0],
    description: this.formData.description || 'Sin descripción'
  };

  console.log('🚀 Payload enviado:', payload);

  if (this.isEditing) {
    this.http.put(`${this.apiUrl}/${this.formData.id}`, payload, { headers }).subscribe({
      next: () => {
        this.loadTransactions();
        this.closeModal();
      },
      error: (err) => {
        console.error('❌ Error PUT:', err);
        this.showError('Error al actualizar transacción');
      }
    });
  } else {
    this.http.post(this.apiUrl, payload, { headers }).subscribe({
      next: () => {
        this.loadTransactions();
        this.loadUserAccounts();
        this.closeModal();
      },
      error: (err) => {
        console.error('❌ Error POST:', err);
        this.showError('Error al crear transacción');
      }
    });
  }
}

deleteTransaction(id: number) {
  this.transactionToDelete = id;
  this.confirmDeleteModal = true;
}

confirmDelete() {
  const token = localStorage.getItem('token');

  if (!token) {
    this.showError('No estás autenticado');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  if (this.transactionToDelete !== null) {
    this.http.delete(`${this.apiUrl}/${this.transactionToDelete}`, { headers })
      .subscribe({
        next: () => {
          this.loadTransactions();
          this.confirmDeleteModal = false;
          this.transactionToDelete = null;
        },
        error: (err) => {
          console.error('❌ Error DELETE:', err);
          this.showError('Error al eliminar transacción');
        }
      });
  }
}

cancelDelete() {
  this.confirmDeleteModal = false;
  this.transactionToDelete = null;
}

  openEditModal(transaction: any) {
    this.isEditing = true;
    this.formData = { ...transaction };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openCreateModal() {
    this.isEditing = false;
    this.formData = { 
      type: 'expense', 
      amount: 0, 
      category: '', // Se llenará con el select
      accountId: this.userAccounts.length > 0 ? this.userAccounts[0].id : null, 
      description: '', 
      date: new Date().toISOString().split('T')[0] 
    };
    this.isModalOpen = true;
  }

  getCategoryIcon(categoryName: string): string {
  const category = this.presetCategories.find(c => c.name === categoryName);
  return category ? category.icon : '💸';
}
}