import mongoose from 'mongoose';
//import SchoolBranch from '../models/schoolBranch.model.js'; 
//import SchoolUser from '../models/schoolUser.model.js';   

// These values now match the Mongoose schema enums
const VALID_LEVELS = ['PREESCOLAR', 'PRIMARIA', 'SECUNDARIA', 'ESCUELA_SECUNDARIA'];
const VALID_CYCLES = ['normal', 'semestral'];
const VALID_SESSIONS = ['MAÑANA', 'TARDE', 'NOCHE'];

const isValidObjectId = (id) => {
    if (!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
};

const validateSchoolBranch = async (branchId) => {
    if (!branchId) return;

    if (!mongoose.Types.ObjectId.isValid(branchId)) {
        throw new Error(`The School Branch ID (${branchId}) is not a valid ObjectId format.`);
    }
    const branchExists = await SchoolBranch.findById(branchId);
    if (!branchExists) {
        throw new Error(`The School Branch with ID ${branchId} does not exist.`);
    }
};

const validateGroupDirector = async (directorId) => {
    if (!directorId) return;

    if (!mongoose.Types.ObjectId.isValid(directorId)) {
        throw new Error(`The Director ID (${directorId}) is not a valid ObjectId format.`);
    }
    const director = await SchoolUser.findOne({
        _id: directorId,
        role: 'TEACHER' // Assuming role is 'TEACHER' //cambiar 
    });
    if (!director) {
        throw new Error(`The Director with ID ${directorId} does not exist or does not have the 'TEACHER' role.`);
    }
};

const validateYear = (year) => {
    if (typeof year !== 'number' || year < 2000 || year > 2100) {
        throw new Error(`The Year must be a valid integer (e.g., 2025).`);
    }
};

const validateLevel = (level) => {
    if (!VALID_LEVELS.includes(level)) {
        throw new Error(`The Level '${level}' is not valid. Must be one of: ${VALID_LEVELS.join(', ')}.`);
    }
};

const validateCycle = (cycle) => {
    if (!VALID_CYCLES.includes(cycle)) {
        throw new Error(`The Cycle '${cycle}' is not valid. Must be one of: ${VALID_CYCLES.join(', ')}.`);
    }
};

const validateSession = (session) => {
    if (!VALID_SESSIONS.includes(session)) {
        throw new Error(`The Session '${session}' is not valid. Must be one of: ${VALID_SESSIONS.join(', ')}.`);
    }
};

const validateGrade = (grade) => {
    if (typeof grade === 'string' && grade.trim().length === 0) {
        throw new Error('The Grade field cannot be empty.');
    }
};

const groupHelper = {
    isValidObjectId,
    validateSchoolBranch,
    validateGroupDirector,
    validateYear,
    validateLevel,
    validateCycle,
    validateSession,
    validateGrade,
};

export default groupHelper;