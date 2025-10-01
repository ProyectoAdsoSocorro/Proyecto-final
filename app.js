import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import periodRoutes from "./routes/periodRoutes.js";
import validityRoutes from "./routes/validityRoutes.js";

dotenv.config();
const app = express();


const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());


mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch((err) => console.error("❌ Error de conexión a MongoDB:", err));


app.use("/api/periodos", periodRoutes);
app.use("/api/validities", validityRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Servidor en ejecución: http://localhost:${PORT}`);
});
