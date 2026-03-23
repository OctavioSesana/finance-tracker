import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new AnalyticsController();

router.get('/categories', authMiddleware, controller.getCategoryAnalytics);
router.get('/monthly', authMiddleware, controller.getMonthlyComparison);

export default router;