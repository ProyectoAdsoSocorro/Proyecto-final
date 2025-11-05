import Router from "express";
import httpSchools from "../controllers/schools.js";
import { check } from "express-validator";
import validateFields from "../middlewares/Checksschools.js";

const routes = Router()

routes.get("/schools/", httpSchools.getSchools);
routes.get("/schools/:id", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.getSchoolById);
routes.post("/schools", [
    check("name").notEmpty().withMessage("El nombre es obligatorio").trim(),
    check("code").notEmpty().withMessage("El código es obligatorio").trim(),
    check("address").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phone").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("email").isEmail().withMessage("El email no es válido").trim(),
    validateFields
], httpSchools.createSchool);
routes.put("/schools/:id", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    check("name").notEmpty().withMessage("El nombre es obligatorio").trim(),
    check("code").notEmpty().withMessage("El código es obligatorio").trim(),
    check("address").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phone").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("email").isEmail().withMessage("El email no es válido").trim(),
    validateFields
], httpSchools.updateSchool);
routes.put("/schools/:id/activate", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.activateSchool);      // Route to activate
routes.put("/schools/:id/deactivate", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.deactivateSchool);
routes.delete("/schools/:id", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.deleteSchool);
export default routes