import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
    
// Importación de rutas
import materiaRoutes from './routes/subjects.js';
import periodsRoutes from './routes/periods.js';
import direccionNucleoRoutes from './routes/coreDirectionRoutes.js';
import Indicators from "./routes/indicators.js";
import colegiosRoutes from './routes/schools.js';
import registration from "./routes/registration.js";
import headquartersRoutes from './routes/headquarters.js';
import reportesEstudiantes from './routes/reports2_routes.js';
import users from './routes/Users.js';
    
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
    
// 🧩 Middleware global para parsear JSON
app.use(express.json());

// 🔗 Conexión a MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado correctamente'))
.catch((error) => console.error('❌ Error al conectar con MongoDB:', error));

// 🌐 Rutas principales
app.use('/api/users', users);
app.use('/api/materias', materiaRoutes);
app.use('/api/periodos', periodsRoutes);
app.use('/api', direccionNucleoRoutes);
app.use(Indicators);
app.use('/api', colegiosRoutes);
app.use('/api/sedes', headquartersRoutes);
app.use("/api/registration", registration);
app.use("/api/reports", reportesEstudiantes )

// 🧱 Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('🛑 Error:', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// 🏁 Ruta raíz simple para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('🚀 API funcionando correctamente');
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});