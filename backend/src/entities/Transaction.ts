import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { Account } from './Account';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column()
  type!: 'income' | 'expense';

  @Column()
  category!: string; // Aquí guardamos el nombre: 'Food', 'Sports', etc.

  @Column({ type: 'date' })
  date!: string;

  @Column()
  description!: string;

  // RELACIÓN CON ACCOUNT
  @ManyToOne(() => Account, (account) => account.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account!: Account;

  @Column()
  accountId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}