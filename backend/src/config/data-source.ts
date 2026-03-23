import { DataSource } from "typeorm";
import { User } from "../entities/User";
import * as dotenv from "dotenv";
import { Account } from "../entities/Account";
import { Transaction } from "../entities/Transaction";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: true,
    logging: false,
    entities: [User, Account, Transaction],
    subscribers: [],
    migrations: [],
});