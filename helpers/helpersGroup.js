import mongoose from 'mongoose';
import headquarters from '../models/headquarters.js';
import Users from '../models/users.js';

// These values now match the Mongoose schema enums
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
        throw new Error(`The Headquarters ID (${headquartersId}) is not a valid ObjectId format.`);
    }
    
    const headquartersExists = await headquarters.findById(headquartersId);
    
    if (!headquartersExists) {
        throw new Error(`The Headquarters with ID ${headquartersId} does not exist.`);
    }
};

const validateGroupDirector = async (directorId) => {
    if (!directorId) return;
    
    if (!mongoose.Types.ObjectId.isValid(directorId)) {
        throw new Error(`The Director ID (${directorId}) is not a valid ObjectId format.`);
    }
    
    const director = await Users.findById(directorId);// ! modelusers
    
    if (!director) {
        throw new Error(`The Director with ID ${directorId} does not exist.`);
    }

    const hasInstructorRole = Array.isArray(director.roles)
        ? director.roles.includes('profesor')
        : director.roles === 'profesor';

    if (!hasInstructorRole) {
        throw new Error(`The Director with ID ${directorId} does not have the required 'profesor' role.'`);
    }
};

const validateYear = (year) => {
    const y = Number(year);
    if (!Number.isInteger(y) || y < 2000 || y > 2100) {
        throw new Error('The Year must be a valid integer (e.g., 2025).');
    }
    return true;
};

const validateLevel = (level) => {
    if (!VALID_LEVELS.includes(level)) {
        throw new Error(`The Level '${level}'is not valid. Must be one of: ${VALID_LEVELS.join(', ')}.`);
    }
    return true;
};

const validateCycle = (cycle) => {
    if (!VALID_CYCLES.includes(cycle)) {
        throw new Error(`The Cycle '${cycle}' is not valid. Must be one of: ${VALID_CYCLES.join(', ')}.`);
    }
    return true;
};

const validateSession = (session) => {
    if (!VALID_SESSIONS.includes(session)) {
        throw new Error(`The Session '${session}' is not valid. Must be one of: ${VALID_SESSIONS.join(', ')}.`);
    }
    return true;
};

const validateGrade = (grade) => {
    if (typeof grade !== 'string' || grade.trim().length === 0) {
        throw new Error('The Grade field cannot be empty.');
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