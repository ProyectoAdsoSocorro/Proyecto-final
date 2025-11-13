import Router from "express";
import httpSchools from "../controllers/schools.js";
import { check } from "express-validator";
import validateFields from "../middlewares/check.js";

const routes = Router()

routes.get("/", httpSchools.getSchools);
routes.get("/:id", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.getSchoolById);
routes.post("/", [
    check("name").notEmpty().withMessage("El nombre es obligatorio").trim(),
    check("code").notEmpty().withMessage("El código es obligatorio").trim(),
    check("address").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phone").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("email").isEmail().withMessage("El email no es válido").trim(),
    validateFields
], httpSchools.createSchool);

routes.post("/notify-admin-created",[
    check("schoolName").notEmpty().withMessage("El nombre del colegio es obligatorio").trim(),
    check("adminEmail").isEmail().withMessage("El email del admin no es válido").trim(),
    validateFields
], httpSchools.notifyAdminCreated);
routes.put("/:id", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    check("name").notEmpty().withMessage("El nombre es obligatorio").trim(),
    check("code").notEmpty().withMessage("El código es obligatorio").trim(),
    check("address").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phone").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("email").isEmail().withMessage("El email no es válido").trim(),
    validateFields
], httpSchools.updateSchool);
routes.put(":id/activate", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.activateSchool);      // Route to activate
routes.put("/:id/desactivate", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.deactivateSchool);
routes.delete("/:id", [
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.deleteSchool);
export default routes