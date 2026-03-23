import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class AccountsComponent implements OnInit {

  constructor(private accountService: AccountService) {}
  showModal = false;
  editingAccount: any = null;
  showConfirmModal = false;
  confirmMessage = '';
  confirmAction: any = null;

  accounts: any[] = [];

  // Objeto vinculado al formulario (según tu Account.ts)
  newAccount = {
    name: '',
    balance: 0
  };

  editAccount(acc: any) {
  this.editingAccount = { ...acc }; // copia
  this.newAccount = {
    name: acc.name,
    balance: acc.balance
  };
  this.showModal = true;
}

  ngOnInit() {
  this.loadAccounts();
}

loadAccounts() {
  this.accountService.getAccounts().subscribe({
    next: (data) => {
      this.accounts = data;
    },
    error: (err) => {
      console.error('Error cargando cuentas', err);
    }
  });
}

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) this.resetForm();
  }

  resetForm() {
    this.newAccount = { name: '', balance: 0 };
  }

  getTotalBalance(): number {
  return this.accounts.reduce((acc, curr) => acc + curr.balance, 0);
}

  saveAccount() {

  if (this.editingAccount) {
    // 👉 EDITAR
    this.confirmMessage = '¿Confirmar actualización del saldo?';
    this.confirmAction = () => {
      this.updateAccount(this.editingAccount.id, this.newAccount);
      this.closeAllModals();
    };
    this.showConfirmModal = true;

  } else {
    // 👉 CREAR
    this.accountService.createAccount(this.newAccount).subscribe({
      next: (res) => {
        this.accounts.push(res);
        this.toggleModal();
      },
      error: (err) => console.error(err)
    });
  }
}

closeAllModals() {
  this.showModal = false;
  this.showConfirmModal = false;
  this.editingAccount = null;
  this.resetForm();
}

deleteAccount(id: number) {
  this.confirmMessage = '¿Estás seguro de eliminar esta cuenta?';
  this.confirmAction = () => {
    this.accountService.deleteAccount(id).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(a => a.id !== id);
      },
      error: (err) => console.error(err)
    });
    this.showConfirmModal = false;
  };

  this.showConfirmModal = true;
}

updateAccount(id: number, updatedData: any) {
  this.accountService.updateAccount(id, updatedData).subscribe({
    next: (res) => {
      const index = this.accounts.findIndex(a => a.id === id);
      this.accounts[index] = res;
    },
    error: (err) => console.error(err)
  });
}
}