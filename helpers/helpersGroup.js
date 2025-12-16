import mongoose from 'mongoose';
import headquarters from '../models/headquarters.js';
import Users from '../models/users.js';

// Estos valores ahora coinciden con los enums del esquema de Mongoose
const VALID_LEVELS = ['PREESCOLAR', 'PRIMARIA', 'SECUNDARIA', 'ESCUELA_SECUNDARIA'];
const VALID_CYCLES = ['normal', 'semestral'];
const VALID_SESSIONS = ['MAÑANA', 'TARDE', 'NOCHE'];

const isValidObjectId = (id) => {
    if (!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
};

const validateHeadquarters = async (headquartersId) => {
    if (!headquartersId) return;
    
    if (!mongoose.Types.ObjectId.isValid(headquartersId)) {
        throw new Error(`El ID de Sede (${headquartersId}) no tiene un formato ObjectId válido.`);
    }
    
    const headquartersExists = await headquarters.findById(headquartersId);
    
    if (!headquartersExists) {
        throw new Error(`La Sede con ID ${headquartersId} no existe.`);
    }
};

const validateGroupDirector = async (directorId) => {
    if (!directorId) return;
    
    if (!mongoose.Types.ObjectId.isValid(directorId)) {
        throw new Error(`El ID del Director (${directorId}) no tiene un formato ObjectId válido.`);
    }
    
    const director = await Users.findById(directorId);
    
    if (!director) {
        throw new Error(`El Director con ID ${directorId} no existe.`);
    }

    const hasInstructorRole = Array.isArray(director.roles)
        ? director.roles.includes('profesor')
        : director.roles === 'profesor';

    if (!hasInstructorRole) {
        throw new Error(`El Director con ID ${directorId} no tiene el rol requerido de 'profesor'.`);
    }
};

const validateYear = (year) => {
    const y = Number(year);
    if (!Number.isInteger(y) || y < 2000 || y > 2100) {
        throw new Error('El Año debe ser un número entero válido (ej. 2025).');
    }
    return true;
};

const validateLevel = (level) => {
    if (!VALID_LEVELS.includes(level)) {
        throw new Error(`El Nivel '${level}' no es válido. Debe ser uno de: ${VALID_LEVELS.join(', ')}.`);
    }
    return true;
};

const validateCycle = (cycle) => {
    if (!VALID_CYCLES.includes(cycle)) {
        throw new Error(`El Ciclo '${cycle}' no es válido. Debe ser uno de: ${VALID_CYCLES.join(', ')}.`);
    }
    return true;
};

const validateSession = (session) => {
    if (!VALID_SESSIONS.includes(session)) {
        throw new Error(`La Sesión '${session}' no es válida. Debe ser una de: ${VALID_SESSIONS.join(', ')}.`);
    }
    return true;
};

const validateGrade = (grade) => {
    if (typeof grade !== 'string' || grade.trim().length === 0) {
        throw new Error('El campo Grado no puede estar vacío.');
    }
    return true;
};

const groupHelper = {
    isValidObjectId,
    validateHeadquarters,
    validateGroupDirector,
    validateYear,
    validateLevel,
    validateCycle,
    validateSession,
    validateGrade,
};

export default groupHelper;