import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new TransactionController();

router.post('/', authMiddleware, (req, res) => controller.create(req, res));
router.get('/account/:accountId', authMiddleware, (req, res) => controller.getByAccount(req, res));
router.put('/:id', authMiddleware, (req, res) => controller.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => controller.delete(req, res));
router.get('/', authMiddleware, (req, res) => controller.getAll(req, res));

export default router;