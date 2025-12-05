import Router from "express";
import httpHeadquarters from "../controllers/headquarters.js"
import { check } from "express-validator"
import showValidations from "../middlewares/showValidations.js";
import { validateJWT } from "../middlewares/jwt.js";
import authRole from "../middlewares/authRole.js";

const routes = Router();

routes.get("/", validateJWT, [
  authRole(['secretaria'])
], httpHeadquarters.listAll);

routes.get("/:id", validateJWT, authRole(['secretaria', 'rector', 'coordinador']), [
  check('id')
    .isMongoId()
    .withMessage('Validación: ID debe ser válido'),
  showValidations
], httpHeadquarters.listById);

routes.get("/school/:schoolId/headquarters", validateJWT, authRole(['secretaria', 'rector', 'coordinador']), [
  check('schoolId')
    .isMongoId()
    .withMessage('Validación: ID de colegio debe ser válido'),
  showValidations
], httpHeadquarters.headquartersBySchool);

routes.post("/", validateJWT, authRole(['secretaria']), [
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
  showValidations
], httpHeadquarters.createHeadquarters);

routes.put("/:id", validateJWT, authRole(['secretaria']), [
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
  showValidations
], httpHeadquarters.updateHeadquarters);

routes.put("/:id/activate", validateJWT, authRole(['secretaria']), [
  check('id')
    .isMongoId()
    .withMessage('Validación: ID debe ser válido'),
  showValidations
], httpHeadquarters.activateHeadquarters);

routes.put("/:id/desactivate", validateJWT, authRole(['secretaria']), [
  check('id')
    .isMongoId()
    .withMessage('Validación: ID debe ser válido'),
  showValidations
], httpHeadquarters.deactivateHeadquarters);

routes.delete("/:id", validateJWT, authRole(['secretaria']), [
  check('id')
    .isMongoId()
    .withMessage('Validación: ID debe ser válido'),
  showValidations
], httpHeadquarters.deleteHeadquarters);

export default routes;