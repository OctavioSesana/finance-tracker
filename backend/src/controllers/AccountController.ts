import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Account } from "../entities/Account";

export class AccountController {
  private accountRepository = AppDataSource.getRepository(Account);

  // 🔹 GET cuentas del usuario logueado
  getMyAccounts = async (req: any, res: Response) => {
    try {
      const userId = req.user.userId;

      const accounts = await this.accountRepository.find({
        where: { userId }
      });

      res.json(accounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener cuentas" });
    }
  };

  // 🔹 POST crear cuenta
  createAccount = async (req: any, res: Response) => {
    try {
      const userId = req.user.userId;

      const { name, balance } = req.body;

      if (!name) {
        return res.status(400).json({ message: "El nombre es obligatorio" });
      }

      const newAccount = this.accountRepository.create({
        name,
        balance: balance || 0,
        userId
      });

      const savedAccount = await this.accountRepository.save(newAccount);

      res.status(201).json(savedAccount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear cuenta" });
    }
  };

  // 🔹 DELETE cuenta
  deleteAccount = async (req: any, res: Response) => {
    try {
      const userId = req.user.userId;
      const accountId = parseInt(req.params.id);

      const account = await this.accountRepository.findOne({
        where: { id: accountId, userId }
      });

      if (!account) {
        return res.status(404).json({ message: "Cuenta no encontrada" });
      }

      await this.accountRepository.remove(account);

      res.json({ message: "Cuenta eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar cuenta" });
    }
  };

  // 🔹 PUT editar cuenta
  updateAccount = async (req: any, res: Response) => {
    try {
      const userId = req.user.userId;
      const accountId = parseInt(req.params.id);

      const account = await this.accountRepository.findOne({
        where: { id: accountId, userId }
      });

      if (!account) {
        return res.status(404).json({ message: "Cuenta no encontrada" });
      }

      const { name, balance } = req.body;

      account.name = name ?? account.name;
      account.balance = balance ?? account.balance;

      const updated = await this.accountRepository.save(account);

      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar cuenta" });
    }
  };
}