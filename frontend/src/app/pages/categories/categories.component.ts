import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesComponent {
  categories: Category[] = [
    { id: 1, name: 'Food & Drinks', icon: '🍔', color: '#f59e0b', type: 'expense' },
    { id: 2, name: 'Transport', icon: '🚗', color: '#3b82f6', type: 'expense' },
    { id: 3, name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
    { id: 4, name: 'Salary', icon: '💰', color: '#10b981', type: 'income' },
    { id: 5, name: 'Health', icon: '🏥', color: '#ef4444', type: 'expense' },
    { id: 6, name: 'Entertainment', icon: '🍿', color: '#8b5cf6', type: 'expense' },
    { id: 7, name: 'Services', icon: '⚡', color: '#06b6d4', type: 'expense' },
    { id: 8, name: 'Investments', icon: '📈', color: '#6366f1', type: 'income' },
    { id: 9, name: 'Sports', icon: '⚽', color: '#10b981', type: 'expense' },
    { id: 10, name: 'Friendship', icon: '🙌', color: '#f472b6', type: 'expense' },
    { id: 11, name: 'Home', icon: '🏠', color: '#a855f7', type: 'expense' },
    { id: 12, name: 'Travel', icon: '✈️', color: '#06b6d4', type: 'expense' },
    { id: 9, name: 'Others', icon: '✨', color: '#94a3b8', type: 'expense' },
  ];
}