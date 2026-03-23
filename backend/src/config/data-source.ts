import { DataSource } from "typeorm";
import { User } from "../entities/User";
import * as dotenv from "dotenv";
import { Account } from "../entities/Account";
import { Transaction } from "../entities/Transaction";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Crea las tablas automáticamente (solo dev)
    logging: false,
    entities: [User, Account, Transaction],
    subscribers: [],
    migrations: [],
});