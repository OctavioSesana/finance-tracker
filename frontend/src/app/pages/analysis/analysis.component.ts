import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AnalysisService } from '../../services/analysis.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  categories: any[] = [];
  totalExpenses = 0;

  current: any;
  previous: any;

  incomeChange = 0;
  expenseChange = 0;

  chart: any;

  constructor(private service: AnalysisService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getCategories().subscribe(data => {
      this.categories = data;
      this.totalExpenses = data.reduce((s, c) => s + c.total, 0);
      this.loadChart();
    });

    this.service.getMonthly().subscribe(data => {
      this.current = data.current;
      this.previous = data.previous;
      this.calculateChanges();
    });
  }

  loadChart() {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.categories.map(c => c.category),
        datasets: [{
          data: this.categories.map(c => c.total)
        }]
      }
    });
  }

  calculateChanges() {
    if (this.previous?.income > 0) {
      this.incomeChange =
        ((this.current.income - this.previous.income) / this.previous.income) * 100;
    }

    if (this.previous?.expense > 0) {
      this.expenseChange =
        ((this.current.expense - this.previous.expense) / this.previous.expense) * 100;
    }
  }
}