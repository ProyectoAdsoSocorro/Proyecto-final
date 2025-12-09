import Router from "express";
import httpSchools from "../controllers/schools.js";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/jwt.js";
import showValidations from "../middlewares/showValidations.js";
import authRole from "../middlewares/authRole.js";


const routes = Router();
const onlyCore = authRole(["direccionNucleo"]);

routes.get("/", [
    validateJWT,
    onlyCore,
    showValidations

], httpSchools.getSchools);
routes.get("/:id", [
    validateJWT,
    onlyCore,
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    showValidations
], httpSchools.getSchoolById);
routes.post("/", [
    validateJWT,
    onlyCore,
    check("nameSchool").notEmpty().withMessage("El nombre es obligatorio").trim(),
    /*  check("code").notEmpty().withMessage("El código es obligatorio").trim(), */
    check("addressSchool").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phoneSchool").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("emailSchool").isEmail().withMessage("El email no es válido").trim(),
    showValidations
], httpSchools.createSchool);

routes.post("/notify-admin-created", [
    validateJWT,
    onlyCore,
    check("schoolName").notEmpty().withMessage("El nombre del colegio es obligatorio").trim(),
    check("adminEmail").isEmail().withMessage("El email del admin no es válido").trim(),
    showValidations
], httpSchools.notifyAdminCreated);
routes.put("/:id", [
    validateJWT,
    onlyCore,
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    check("nameSchool").notEmpty().withMessage("El nombre es obligatorio").trim(),
    check("code").notEmpty().withMessage("El código es obligatorio").trim(),
    check("addressSchool").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phoneSchool").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("emailSchool").isEmail().withMessage("El email no es válido").trim(),
    showValidations
], httpSchools.updateSchool);
routes.put("/:id/activate", [
    validateJWT,
    onlyCore,
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    showValidations
], httpSchools.activateSchool);      // Route to activate
routes.put("/:id/desactivate", [
    validateJWT,
    onlyCore,
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    showValidations
], httpSchools.deactivateSchool);
routes.delete("/:id", [
    validateJWT,
    onlyCore,
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    showValidations
], httpSchools.deleteSchool);
export default routes