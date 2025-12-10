import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { transporter } from "./services/emailService.js";
// Importación de rutas
import usersRoutes from './routes/users.js';
import subjectsRoutes from './routes/subjects.js';
import periodsRoutes from './routes/periods.js';
import direccionNucleoRoutes from './routes/coreDirections.js';
import IndicatorsRoutes from "./routes/indicators.js";
import colegiosRoutes from './routes/schools.js';
import registrationRoutes from "./routes/registration.js";
import headquartersRoutes from './routes/headquarters.js';
import qualificationsRoutes from './routes/qualifications.js';
import validityRoutes from './routes/validity.js';
import bulletinRoutes from './routes/bulletins.js';
import groupsRoutes from './routes/groups.js';
import reportsRoutes from './routes/reports.js';
import academicLoad from './routes/academicLoad.js';

// import reportesEstudiantes from './routes/reports2_routes.js'
// import reportesEstudiantes from './routes/students_by_group.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// 🧩 Middleware global para parsear JSON
app.use(express.json());
app.use(cors());

// 🌐 Rutas principales
app.use('/api/users', usersRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/periods', periodsRoutes);
app.use('/api/core-direction', direccionNucleoRoutes);
app.use('/api/indicators', IndicatorsRoutes);
app.use('/api/schools', colegiosRoutes); 
app.use('/api/headquarters', headquartersRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/qualifications", qualificationsRoutes);
app.use("/api/validity", validityRoutes);
app.use("/api/bulletins", bulletinRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/academicLoad", academicLoad);

app.listen(PORT, async () => {
    try {
        await transporter.verify()
        console.log(`✅ Servidor corriendo en http://localhost:${process.env.PORT}`);
        mongoose.connect(MONGO_URL)
            .then(() => console.log('✅ MongoDB conectado correctamente'))
            .catch((error) => console.error('❌ Error al conectar con MongoDB:', error));
    } catch (error) {
        console.log(error);
    }
}); 