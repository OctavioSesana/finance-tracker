import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private apiUrl = `${environment.apiUrl}/api/transactions`;

  constructor(private http: HttpClient) {}

  // 🔹 Obtener transacciones (igual que en TransactionsComponent)
  getTransactions(): Observable<any[]> {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // 🔹 Calcular resumen a partir de las transacciones
  getSummary(): Observable<{ income: number, expenses: number, balance: number }> {
    return this.getTransactions().pipe(
      map(transactions => {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);

        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);

        return {
          income,
          expenses,
          balance: income - expenses
        };
      })
    );
  }
}