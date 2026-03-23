import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    private userService = new UserService();

    register = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.register(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            const status = error.message.includes("ya está registrado") ? 400 : 500;
            res.status(status).json({ message: error.message });
        }
    }   

    login = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.login(req.body);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }
}