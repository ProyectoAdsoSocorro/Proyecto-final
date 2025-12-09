import express from 'express';
import mongoose from 'mongoose';
import cargaAcademicaRoutes from './routes/AcademicLoad.js'
import dotenv from 'dotenv';
import connectDB from './db.js'; 
import cors from 'cors';
import morgan from 'morgan'

dotenv.config(); 
connectDB(); 

const app = express();


app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 


app.use('/api/carga-academica', cargaAcademicaRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada 😕' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
