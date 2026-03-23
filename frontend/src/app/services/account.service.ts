import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private API = `${environment.apiUrl}/api/accounts`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getAccounts() {
    return this.http.get<any[]>(this.API, this.getHeaders());
  }

  createAccount(account: any) {
    return this.http.post<any>(this.API, account, this.getHeaders());
  }

  deleteAccount(id: number) {
    return this.http.delete(`${this.API}/${id}`, this.getHeaders());
  }

  updateAccount(id: number, account: any) {
    return this.http.put(`${this.API}/${id}`, account, this.getHeaders());
  }
}