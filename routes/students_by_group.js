import { Router } from "express";
import { check } from "express-validator";
import validateFields from "../middlewares/checksReports.js";
import httpReportStudents from "../controllers/students_by_group.js";


const router = Router();

router.get("/list-students/:schoolyear/:schoolId/:GroupId", [
    check("GroupId").isMongoId().withMessage("ID de grupo no válido").trim(),
    check("schoolyear").notEmpty().withMessage("El año escolar es obligatorio").trim(),
    check("schoolId").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
    
], httpReportStudents.getstudent);

export default router;
