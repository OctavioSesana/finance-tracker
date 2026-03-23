import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transaction.routes";
import analyticsRoutes from "./routes/analytics.routes";
import dotenv from "dotenv";
import { pool } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const testDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB OK:', res.rows);
  } catch (err) {
    console.error('DB ERROR:', err);
  }
};

testDB();

app.use(cors({
  origin: '*'
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Endpoint de prueba
app.get("/ping", (req, res) => {
    res.json({ message: "Pong! El backend está vivo" });
});

// --- CONECTAR LAS RUTAS AQUÍ ---
app.use("/api/auth", authRoutes);
app.use("/accounts", accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
// -------------------------------

// Inicializar BD y Servidor
AppDataSource.initialize()
    .then(() => {
        console.log("🔥 Base de datos MySQL conectada");
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log("Error conectando a la BD:", error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});