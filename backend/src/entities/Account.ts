import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class Account {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // "Cuenta Sueldo", "Banco Galicia", etc

  @Column({ default: 0 })
  balance!: number;

  //RELACIÓN CON USER
  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;
}