import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { FinanceService } from '../../services/finance.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('financeChart') financeChart!: ElementRef;

  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;
  recentTransactions: any[] = [];

  private chart: any;

  constructor(
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.financeService.getTransactions().subscribe({
      next: (data) => {

        // 🔹 Normalizar datos (IMPORTANTE)
        const transactions = data.map(t => ({
          ...t,
          amount: Number(t.amount)
        }));

        // 🔹 Ordenar (más recientes primero)
        this.recentTransactions = transactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // 🔹 Calcular métricas
        this.totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);

        this.totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);

        this.balance = this.totalIncome - this.totalExpenses;

        this.updateChart();
      },
      error: (err) => console.error('❌ Dashboard error:', err)
    });
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart() {
    const ctx = this.financeChart.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Income',
            data: [],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Expenses',
            data: [],
            borderColor: '#ef4444',
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  updateChart() {
    if (!this.chart || this.recentTransactions.length === 0) return;

    this.chart.data.labels = this.recentTransactions.map(t => t.date);

    this.chart.data.datasets[0].data = this.recentTransactions.map(t =>
      t.type === 'income' ? t.amount : 0
    );

    this.chart.data.datasets[1].data = this.recentTransactions.map(t =>
      t.type === 'expense' ? t.amount : 0
    );

    this.chart.update();
  }

  goToTransactions() {
  this.router.navigate(['/transactions']);
}
}