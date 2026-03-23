import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transaction.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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