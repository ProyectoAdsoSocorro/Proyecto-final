import Router from 'express';
import httpReports from '../controllers/reports.js';
import { check } from 'express-validator';
import showValidations from '../middlewares/showValidations.js';
import authRole from "../middlewares/authRole.js";
import {validateJWT} from "../middlewares/jwt.js";

const router = Router();

router.get('/statistics-group/:groupId', [
    check('groupId').isMongoId().withMessage('ID de Grupo no válido').trim(),
    showValidations
], httpReports.getStatisticsByGroup);

router.get("/list-students/:schoolyear/:schoolId/:GroupId", [
    check("GroupId").isMongoId().withMessage("Validación: ID de grupo debe ser válido").trim(),
    check("schoolyear").notEmpty().withMessage("Campo requerido: Año escolar").trim(),
    check("schoolId").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    showValidations

],httpReports.httpReportStudents);

router.get("/honor-roll/:schoolyear/:schoolId/:periodId", validateJWT, authRole(["secretaria", "profesor", "rector", "coordinador"]),[
    check("schoolyear").notEmpty().withMessage("Campo requerido: Año escolar").trim(),
    check("schoolId").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    check("periodId").isMongoId().withMessage("Validación: ID del Periodo debe ser válido").trim(),
    showValidations

],httpReports.honorRollsController);

export default router;