import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const SECRET = "SmartMarket_Secret_Key_2025";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, SECRET);

    req.user = decoded; // 👈 acá guardamos userId

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};