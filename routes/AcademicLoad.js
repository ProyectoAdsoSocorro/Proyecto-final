import express from 'express';
import { validateJWT } from '../middlewares/Jwt.js';
import authRole from '../middlewares/authRole.js';
import { validateFields } from '../middlewares/checkAcademicLoad.js';
import { check } from 'express-validator';
import {
        getLoadsByYear,
        getLoadById,
        getLoadsByProfessor,
        getLoadsByGroup,
        createAcademicLoad,
        updateAcademicLoad,
        activateAcademicLoad,
        deactivateAcademicLoad,
        deleteAcademicLoad
} from '../controllers/AcademicLoad.js';

const router = express.Router();

// Middleware para verificar roles específicos
 const onlySecretary = authRole(['secretaria']);
const readOnly = authRole(['rector', 'coordinador', 'secretaria']); 


router.get('/year/:year', [
    validateJWT,
    readOnly,
    check('year', 'No es un año válido').isInt({ min: 2000, max: 2030 }).toInt(),
    validateFields
], getLoadsByYear);

router.get('/:id', [
    validateJWT,
    readOnly,
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], getLoadById);

router.get('/professor/:professorId', [
    validateJWT,
    readOnly,
    check('professorId', 'ID de profesor no válido').isMongoId(),
    validateFields
], getLoadsByProfessor);

router.get('/group/:groupId', [
    validateJWT,
    readOnly,
    check('groupId', 'ID de grupo no válido').isMongoId(),
    validateFields
], getLoadsByGroup);


router.post('/', [
    validateJWT,
    onlySecretary,
    check('school', 'El colegio es requerido y debe ser un ID válido').isMongoId(),
    check('professor', 'El profesor es requerido').notEmpty(),
    check('subject', 'La materia es requerida y debe ser un ID válido').isMongoId(),
    check('group', 'El grupo es requerido').notEmpty(),
    check('year', 'El año es requerido y debe estar entre 2000 y 2030').isInt({ min: 2000, max: 2030 }).toInt(),
    check('hoursIntensity', 'La intensidad horaria es requerida').notEmpty(),
    check('percentage', 'El porcentaje es requerido y debe estar entre 0 y 100').isFloat({ min: 0, max: 100 }).toFloat(),
    validateFields
], createAcademicLoad);

router.put('/:id', [
    validateJWT,
    onlySecretary,
    check('id', 'No es un ID válido').isMongoId(),
    check('hoursIntensity').optional().notEmpty().withMessage('La intensidad horaria no puede quedar vacía'),
    check('percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe estar entre 0 y 100').toFloat(),
    validateFields
], updateAcademicLoad);

router.put('/:id/activate', [
    validateJWT,
    onlySecretary,
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], activateAcademicLoad);

router.put('/:id/deactivate', [
    validateJWT,
    onlySecretary,
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], deactivateAcademicLoad);

router.delete('/:id', [
    validateJWT,
    onlySecretary,
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], deleteAcademicLoad);

export default router;