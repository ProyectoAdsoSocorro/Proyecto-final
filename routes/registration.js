import Router from "express";
import httpRegistration from "../controllers/registration.js"
import { check } from "express-validator";
import showValidations  from "../middlewares/showValidations.js";
import authRole from "../middlewares/authRole.js";
import { validateJWT } from "../middlewares/jwt.js";

const routes = Router();

routes.get("/year/:year", validateJWT, authRole(['secretaria', 'rector', 'coordinador']), [
    check('year')
      .isInt({ min: 1900, max: 2100 })
      .withMessage('Rango: Año debe estar entre 1900 y 2100'),
    showValidations
], httpRegistration.listAllByYear);

routes.get("/:id", validateJWT, authRole(['secretaria', 'rector', 'coordinador']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    showValidations
], httpRegistration.listById);

routes.get("/groups/:groupId/registrations", validateJWT, authRole(['secretaria', 'rector', 'coordinador']), [
    check('groupId')
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido')
      .trim(),
    showValidations
], httpRegistration.listRegistrationByGroup);

routes.get("/student/:studentId/registrations", validateJWT, authRole(['secretaria', 'rector', 'coordinador']), [
    check('studentId')
      .isMongoId()
      .withMessage('Validación: ID de estudiante debe ser válido')
      .trim(),
    showValidations
], httpRegistration.listRegistrationByStudent);

routes.post("/", validateJWT, authRole(['secretaria']), [
    check('student')
      .isMongoId()
      .withMessage('Validación: ID de estudiante debe ser válido')
      .trim(),
    check('attendant')
      .isArray()
      .withMessage('Formato: Campo acudiente debe ser un array'),
    check('attendant.*._id')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido'),
    check('attendant.*.relationship')
      .isString()
      .withMessage('Validación: Parentesco debe ser texto válido'),
    check('group')
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido')
      .trim(),
    check('year')
      .isInt({ min: 1900, max: 2100 })
      .withMessage('Rango: Año debe estar entre 1900 y 2100'),
    check('registrationDate')
      .trim()
      .isISO8601()
      .withMessage('Formato: Fecha de matrícula debe ser YYYY-MM-DD')
      .isDate(),
    check('registrationNumber')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Número de matrícula'),
    check('description')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Descripción de matrícula'),
    check('school')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido')
      .trim(),
    showValidations
], httpRegistration.createRegistration);

routes.put("/:id", validateJWT, authRole(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    showValidations
], httpRegistration.updateRegistration);

routes.put("/:id/activate", validateJWT, authRole(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    showValidations
], httpRegistration.activateRegistration);

routes.put("/:id/desactivate", validateJWT, authRole(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    showValidations
], httpRegistration.withdrawnRegistration);

routes.put("/:id/desertion", validateJWT, authRole(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    showValidations
], httpRegistration.desertionRegistration);

routes.put("/:id/graduated", validateJWT, authRole(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    showValidations
], httpRegistration.graduatedRegistration);

routes.put("/:id/withdraw", validateJWT, authRole(['secretaria']), [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    showValidations
], httpRegistration.withdrawStudent);

// Acudientes
routes.get("/attendant/:attendantId/registration", validateJWT, authRole(['secretaria', 'rector', 'coordinador']), [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    showValidations
], httpRegistration.listAttendantById);

routes.post("/attendant/registration", validateJWT, authRole(['secretaria']), [
    check('schoolId')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido')
      .trim(),
    check('firstName')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Nombre'),
    check('lastName')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Apellido'),
    check('documentType')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Tipo de documento'),
    check('documentNumber')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Número de documento'),
    check('email')
      .isEmail()
      .withMessage('Validación: Correo electrónico debe ser válido')
      .trim(),
    check('password')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Contraseña'),
    check('phone')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Número de teléfono'),
    check('address')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Dirección'),
    check('dateOfBirth')
      .trim()
      .isISO8601()
      .withMessage('Formato: Fecha de nacimiento debe ser YYYY-MM-DD')
      .isDate(),
    check('gender')
      .trim()
      .not().isEmpty()
      .withMessage('Campo requerido: Género'),
    showValidations
], httpRegistration.createdAttendant);

routes.put("/attendant/:attendantId/registration", validateJWT, authRole(['secretaria']), [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    showValidations
], httpRegistration.updatedAttendant);

routes.put("/attendant/:attendantId/activate/registration", validateJWT, authRole(['secretaria']), [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    showValidations
], httpRegistration.activateAttendant);

routes.put("/attendant/:attendantId/desactivate/registration", validateJWT, authRole(['secretaria']), [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    showValidations
], httpRegistration.desactivateAttendant);

routes.delete("/attendant/:attendantId/registration", validateJWT, authRole(['secretaria']), [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    showValidations
], httpRegistration.deleteAttendant);

export default routes;