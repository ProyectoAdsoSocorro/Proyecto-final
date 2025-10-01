import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import periodoRoutes from "./routes/periodRoutes.js";

dotenv.config();
const app = express();

// 📌 Middlewares
app.use(express.json());

// 📌 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

// 📌 Rutas principales
app.use("/api/periodos", periodoRoutes);

// 📌 Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en ejecución: http://localhost:${PORT}/api/periodos`);
});
