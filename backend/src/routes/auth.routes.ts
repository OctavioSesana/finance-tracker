import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const controller = new UserController();

router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;