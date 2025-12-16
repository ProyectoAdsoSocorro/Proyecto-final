import Router from "express";
import httpSchools from "../controllers/schools.js";
import { check } from "express-validator";
import validateFields from "../middlewares/check.js";
import roleCheck from "../middlewares/roleCheck.js";
import {verifyTokenAdmin ,roleCheckCore} from "../middlewares/authJwt.js";


const routes = Router()

routes.get("/", verifyTokenAdmin ,roleCheckCore('admin'),httpSchools.getSchools);

routes.get("/:id", [
    roleCheck(["admin"]),
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.getSchoolById);
routes.post("/", [
    roleCheck(["admin"]),
    check("nameSchool").notEmpty().withMessage("El nombre es obligatorio").trim(),
   /*  check("code").notEmpty().withMessage("El código es obligatorio").trim(), */
    check("addressSchool").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phoneSchool").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("emailSchool").isEmail().withMessage("El email no es válido").trim(),
    validateFields
], httpSchools.createSchool);

routes.post("/notify-admin-created",[
    roleCheck(["admin"]),
    check("schoolName").notEmpty().withMessage("El nombre del colegio es obligatorio").trim(),
    check("adminEmail").isEmail().withMessage("El email del admin no es válido").trim(),
    validateFields
], httpSchools.notifyAdminCreated);
routes.put("/:id", [
    roleCheck(["admin"]),
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    check("nameSchool").notEmpty().withMessage("El nombre es obligatorio").trim(),
    check("code").notEmpty().withMessage("El código es obligatorio").trim(),
    check("addressSchool").notEmpty().withMessage("La dirección es obligatoria").trim(),
    check("phoneSchool").notEmpty().withMessage("El telefono es obligatorio").trim(),
    check("emailSchool").isEmail().withMessage("El email no es válido").trim(),
    validateFields
], httpSchools.updateSchool);
routes.put("/:id/activate", [
    roleCheck(["admin"]),
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.activateSchool);      // Route to activate
routes.put("/:id/desactivate", [
    roleCheck(["admin"]),
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.deactivateSchool);
routes.delete("/:id", [
    roleCheck(["admin"]),
    check("id").isMongoId().withMessage("ID de colegio no válido").trim(),
    validateFields
], httpSchools.deleteSchool);
export default routes