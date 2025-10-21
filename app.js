const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const periodsRoutes = require('./routes/periodos');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/periodos', periodsRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a la base de datos');
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import colegios from "./routes/Colegio.js";

const app = express();

// Middleware para permitir que Express entienda 
app.use(express.json());


app.use(colegios);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.error("Error al conectar a la base de datos:", error));
});
