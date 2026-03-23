import { Request, Response } from "express";
import { AnalyticsService } from "../services/AnalyticsService";

const service = new AnalyticsService();

export class AnalyticsController {

  async getCategoryAnalytics(req: Request, res: Response) {
    try {

      console.log("USER EN REQUEST:", (req as any).user);
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const data = await service.getCategoryAnalytics(userId);

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error en analytics por categoría" });
    }
  }

  async getMonthlyComparison(req: Request, res: Response) {
    try {
      console.log("USER EN REQUEST:", (req as any).user);
      const userId = (req as any).user?.userId;

      const data = await service.getMonthlyComparison(userId);

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error en comparación mensual" });
    }
  }

  
}