import Router from "express";
import httpSchools from "../controllers/schools.js";
import { check } from "express-validator";
import validateFields from "../middlewares/check.js";

const routes = Router()

routes.get("/api/schools/", httpSchools.getSchools);
routes.get("/api/schools/:id", [
    check("id").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    validateFields
], httpSchools.getSchoolById);
routes.post("/schools", [
    check("name").notEmpty().withMessage("Campo requerido: Nombre del colegio").trim(),
    check("code").notEmpty().withMessage("Campo requerido: Código del colegio").trim(),
    check("address").notEmpty().withMessage("Campo requerido: Dirección del colegio").trim(),
    check("phone").notEmpty().withMessage("Campo requerido: Número de teléfono").trim(),
    check("email").isEmail().withMessage("Validación: Correo electrónico debe ser válido").trim(),
    validateFields
], httpSchools.createSchool);

routes.post("/api/notify-admin-created",[
    check("schoolName").notEmpty().withMessage("Campo requerido: Nombre del colegio").trim(),
    check("adminEmail").isEmail().withMessage("Validación: Correo electrónico debe ser válido").trim(),
    validateFields
], httpSchools.notifyAdminCreated);
routes.put("/api/schools/:id", [
    check("id").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    check("name").notEmpty().withMessage("Campo requerido: Nombre del colegio").trim(),
    check("code").notEmpty().withMessage("Campo requerido: Código del colegio").trim(),
    check("address").notEmpty().withMessage("Campo requerido: Dirección del colegio").trim(),
    check("phone").notEmpty().withMessage("Campo requerido: Número de teléfono").trim(),
    check("email").isEmail().withMessage("Validación: Correo electrónico debe ser válido").trim(),
    validateFields
], httpSchools.updateSchool);
routes.put("/api/schools/:id/activate", [
    check("id").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    validateFields
], httpSchools.activateSchool);      // Route to activate
routes.put("/api/schools/:id/deactivate", [
    check("id").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    validateFields
], httpSchools.deactivateSchool);
routes.delete("/api/schools/:id", [
    check("id").isMongoId().withMessage("Validación: ID de colegio debe ser válido").trim(),
    validateFields
], httpSchools.deleteSchool);
export default routes