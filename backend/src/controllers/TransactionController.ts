import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';
import { Account } from '../entities/Account';

export class TransactionController {
  private transactionRepo = AppDataSource.getRepository(Transaction);
  private accountRepo = AppDataSource.getRepository(Account);

  // CREAR TRANSACCIÓN
  async create(req: any, res: Response) {
  try {
    const { amount, type, category, accountId, date, description } = req.body;
    const userId = req.user.userId; // Obtenido del token

    const transactionRepo = AppDataSource.getRepository(Transaction);
    const accountRepo = AppDataSource.getRepository(Account);

    // 1. Buscamos la cuenta y verificamos que pertenezca al usuario logueado
    // (Esto es lo que da seguridad al sistema)
    const account = await accountRepo.findOneBy({ id: Number(accountId), userId: userId });
    
    if (!account) {
      return res.status(404).json({ message: "La cuenta no existe o no tienes permiso." });
    }

    // 2. Creamos la transacción siguiendo EXACTAMENTE tu Transaction.ts
    const newTransaction = transactionRepo.create({
      amount: Number(amount),
      type: type, // 'income' | 'expense'
      category: category,
      date: date, // Tu entidad espera string (type: 'date')
      description: description,
      accountId: Number(accountId)
      // Nota: userId no se pone aquí porque no está en tu Transaction.ts
    });

    await transactionRepo.save(newTransaction);

    // 3. ACTUALIZAMOS EL SALDO DE LA CUENTA
    const transAmount = Number(amount);
    if (type === 'income') {
      account.balance = Number(account.balance) + transAmount;
    } else {
      account.balance = Number(account.balance) - transAmount;
    }

    
    await accountRepo.save(account);

    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error interno", error: String(error) });
  }
}

  // EDITAR TRANSACCIÓN
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaction = await this.transactionRepo.findOneBy({ id: Number(id) });
      
      if (!transaction) return res.status(404).json({ message: 'No existe la transacción' });

      this.transactionRepo.merge(transaction, req.body);
      const result = await this.transactionRepo.save(transaction);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error al editar' });
    }
  }

  // ELIMINAR TRANSACCIÓN
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaction = await this.transactionRepo.findOneBy({ id: Number(id) });

      if (!transaction) return res.status(404).json({ message: 'No encontrada' });

      // Opcional: Revertir el saldo en la cuenta antes de borrar
      const account = await this.accountRepo.findOneBy({ id: transaction.accountId });
      if (account) {
        if (transaction.type === 'income') account.balance -= transaction.amount;
        else account.balance += transaction.amount;
        await this.accountRepo.save(account);
      }

      await this.transactionRepo.remove(transaction);
      res.json({ message: 'Transacción eliminada y saldo actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar' });
    }
  }

  // OBTENER TODAS LAS TRANSACCIONES (opcional, para debug)
  async getAll(req: any, res: Response) {
  try {
    const userId = req.user.userId;

    const transactions = await this.transactionRepo.find({
      relations: ['account'],
      where: {
        account: {
          userId: userId
        }
      },
      order: { date: 'DESC' }
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
}

  // OBTENER TRANSACCIONES POR CUENTA
  async getByAccount(req: Request, res: Response) {
    const { accountId } = req.params;
    const transactions = await this.transactionRepo.find({
      where: { accountId: Number(accountId) },
      order: { date: 'DESC' }
    });
    res.json(transactions);
  }
}