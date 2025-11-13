import { Router } from "express";
import { check } from "express-validator";
import validateFields from "../middlewares/checksReports.js";
import httpReportStudents from "../controllers/students_by_group.js";


const router = Router();

router.get("/list-students/:schoolyear/:schoolId/:GroupId", [
    check("GroupId").isMongoId().withMessage("Validación: ID de grupo debe ser válido").trim(),
    check("schoolyear").notEmpty().withMessage("Campo requerido: Año escolar").trim(),
    check("schoolId").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    validateFields
    
], httpReportStudents.getstudent);

export default router;
