import Router from "express";
import httpHeadquarters from "../controllers/headquarters.js"
import { check } from "express-validator"
import  validateFields from "../middlewares/check.js";

const routes = Router();

routes.get("/",/* [
    validarol (["R","E"])
    check
] */ httpHeadquarters.listAll);

routes.get("/:id", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.listById);

routes.get("/school/:schoolId/headquarters", [
    check('schoolId')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido'),
    validateFields
], httpHeadquarters.headquartersBySchool);

routes.post("/", [
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

routes.put("/:id", [
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

routes.put("/:id/activate", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.activateHeadquarters);

routes.put("/:id/desactivate", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.deactivateHeadquarters);

routes.delete("/:id", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
    validateFields
], httpHeadquarters.deleteHeadquarters);

export default routes;