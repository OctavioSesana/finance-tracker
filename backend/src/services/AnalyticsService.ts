import { AppDataSource } from "../config/data-source";
import { Transaction } from "../entities/Transaction";

export class AnalyticsService {

  private repo = AppDataSource.getRepository(Transaction);

  // 🔹 GASTOS POR CATEGORÍA
  async getCategoryAnalytics(userId: number) {

    const transactions = await this.repo.find({
      relations: ["account", "account.user"],
      where: {
        account: {
          user: {
            id: userId
          }
        },
        type: "expense"
      }
    });

    const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    const grouped: Record<string, number> = {};

    for (const t of transactions) {
      const category = t.category || "Others";

      if (!grouped[category]) {
        grouped[category] = 0;
      }

      grouped[category] += Number(t.amount);
    }

    return Object.entries(grouped)
      .map(([category, totalAmount]) => ({
        category,
        total: totalAmount,
        percentage: total === 0 ? 0 : (totalAmount / total) * 100
      }))
      .sort((a, b) => b.total - a.total);
  }

  // 🔹 COMPARACIÓN MENSUAL
  async getMonthlyComparison(userId: number) {

    const transactions = await this.repo.find({
      relations: ["account", "account.user"],
      where: {
        account: {
          user: {
            id: userId
          }
        }
      }
    });

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const prev = new Date();
    prev.setMonth(currentMonth - 1);

    const prevMonth = prev.getMonth();
    const prevYear = prev.getFullYear();

    const current = { income: 0, expense: 0, balance: 0 };
    const previous = { income: 0, expense: 0, balance: 0 };

    for (const t of transactions) {
      const d = new Date(t.date);
      const m = d.getMonth();
      const y = d.getFullYear();

      // ACTUAL
      if (m === currentMonth && y === currentYear) {
        if (t.type === "income") current.income += Number(t.amount);
        if (t.type === "expense") current.expense += Number(t.amount);
      }

      // ANTERIOR
      if (m === prevMonth && y === prevYear) {
        if (t.type === "income") previous.income += Number(t.amount);
        if (t.type === "expense") previous.expense += Number(t.amount);
      }
    }

    current.balance = current.income - current.expense;
    previous.balance = previous.income - previous.expense;

    return { current, previous };
  }
}