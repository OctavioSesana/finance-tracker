import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryAnalytics {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private apiUrl = 'http://localhost:3000/api/analytics';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryAnalytics[]> {
    return this.http.get<CategoryAnalytics[]>(`${this.apiUrl}/categories`);
  }

  getMonthly(): Observable<any> {
    return this.http.get(`${this.apiUrl}/monthly`);
  }
}