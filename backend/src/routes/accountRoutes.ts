import { Router } from "express";
import { AccountController } from "../controllers/AccountController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new AccountController();

router.get("/", authMiddleware, controller.getMyAccounts);
router.post("/", authMiddleware, controller.createAccount);
router.delete("/:id", authMiddleware, controller.deleteAccount);
router.put("/:id", authMiddleware, controller.updateAccount);

export default router;