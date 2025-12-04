import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Importación de rutas
import users from './routes/users.js';
import subjectsRoutes from './routes/subjects.js';
import periodsRoutes from './routes/periods.js';
import direccionNucleoRoutes from './routes/coreDirectionRoutes.js';
import Indicators from "./routes/indicators.js";
import colegiosRoutes from './routes/schools.js';
import registration from "./routes/registration.js";
import headquartersRoutes from './routes/headquarters.js';
import qualificationsRoutes from './routes/qualificationsRoutes.js';
import validityRoutes from './routes/validityRoutes.js';
import bulletinRoutes from './routes/bulletinRoutes.js';
import groups from './routes/groups.js';
import reports from './routes/reports.js';

// import reportesEstudiantes from './routes/reports2_routes.js'
// import reportesEstudiantes from './routes/students_by_group.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// 🧩 Middleware global para parsear JSON
app.use(express.json());
app.use(cors());


// 🔗 Conexión a MongoDB
/* mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado correctamente'))
.catch((error) => console.error('❌ Error al conectar con MongoDB:', error)); */

mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ MongoDB conectado correctamente'))
    .catch((error) => console.error('❌ Error al conectar con MongoDB:', error));


// 🌐 Rutas principales
app.use('/api/users', users);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/periods', periodsRoutes);
app.use('/api/core-direction', direccionNucleoRoutes);
app.use('/api/indicators', Indicators);
app.use('/api/schools', colegiosRoutes);
app.use('/api/headquarters', headquartersRoutes);
app.use("/api/registration", registration);
app.use("/api/reports", reports);
app.use("/api/qualifications", qualificationsRoutes);
app.use("/api/validity", validityRoutes);
app.use("/api/bulletins", bulletinRoutes);
app.use("/api/groups", groups);


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
/* app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

export default app */

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
}

// Exportar la app para pruebas
export default app;
