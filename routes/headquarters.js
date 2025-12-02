import Router from "express";
import httpHeadquarters from "../controllers/headquarters.js"
import { check } from "express-validator"
import  validateFields from "../middlewares/check.js";
import  roleCheck  from "../middlewares/roleCheck.js";
import { validar } from "../middlewares/Jwt.js";

const routes = Router();

routes.get("/",[
    /* roleCheck('admin') */
], httpHeadquarters.listAll);

routes.get("/:id",validar, roleCheck(['secretaria', 'rector', 'coordinador']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.listById);

routes.get("/school/:schoolId/headquarters",validar, roleCheck(['secretaria', 'rector', 'coordinador']), [
    check('schoolId')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido'),
    validateFields
], httpHeadquarters.headquartersBySchool);

routes.post("/", validar, roleCheck(['secretaria']), [
    check('school')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido')
      .notEmpty()
      .trim(),
    check('name')
      .notEmpty()
      .withMessage('Campo requerido: Nombre de sede')
      .trim(),
    check('abbreviation')
      .notEmpty()
      .withMessage('Campo requerido: Abreviatura de sede')
      .trim(),
    check('code')
      .notEmpty()
      .withMessage('Campo requerido: Código de sede')
      .trim(),
    check('address')
      .notEmpty()
      .withMessage('Campo requerido: Dirección de sede')
      .trim(),
    check('phone')
      .notEmpty()
      .withMessage('Campo requerido: Número de teléfono')
      .trim(),
    validateFields
], httpHeadquarters.createHeadquarters);

routes.put("/:id", validar, roleCheck(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido')
      .trim(),
    check('school')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido')
      .notEmpty()
      .trim(),
    check('name')
      .notEmpty()
      .withMessage('Campo requerido: Nombre de sede')
      .trim(),
    check('abbreviation')
      .notEmpty()
      .withMessage('Campo requerido: Abreviatura de sede')
      .trim(),
    check('code')
      .notEmpty()
      .withMessage('Campo requerido: Código de sede')
      .trim(),
    check('address')
      .notEmpty()
      .withMessage('Campo requerido: Dirección de sede')
      .trim(),
    check('phone')
      .notEmpty()
      .withMessage('Campo requerido: Número de teléfono')
      .trim(),
    validateFields
], httpHeadquarters.updateHeadquarters);

routes.put("/:id/activate", validar, roleCheck(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.activateHeadquarters);

routes.put("/:id/desactivate", validar, roleCheck(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.deactivateHeadquarters);

routes.delete("/:id", validar, roleCheck(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.deleteHeadquarters);

export default routes;