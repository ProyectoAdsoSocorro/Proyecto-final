import Router from "express";
import httpRegistration from "../controllers/registration.js"
import { check } from "express-validator";
import { validateFields } from "../middlewares/checksTuition.js";
 
const routes = Router();

routes.get("/year/:year", [
    check('year')
      .isInt({ min: 1900, max: 2100 })
      .withMessage('Rango: Año debe estar entre 1900 y 2100'),
    validateFields
], httpRegistration.listAllByYear);

routes.get("/:id", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    validateFields
], httpRegistration.listById);

routes.get("/groups/:groupId/registrations", [
    check('groupId')
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido')
      .trim(),
    validateFields
], httpRegistration.listRegistrationByGroup);

routes.get("/student/:studentId/registrations", [
    check('studentId')
      .isMongoId()
      .withMessage('Validación: ID de estudiante debe ser válido')
      .trim(),
    validateFields
], httpRegistration.listRegistrationByStudent);

routes.post("/", [
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
    validateFields
], httpRegistration.createRegistration);

routes.put("/:id", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    validateFields
], httpRegistration.updateRegistration);

routes.put("/:id/activate", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    validateFields
], httpRegistration.activateRegistration);

routes.put("/:id/desactivate", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    validateFields
], httpRegistration.withdrawnRegistration);

routes.put("/:id/desertion", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    validateFields
], httpRegistration.desertionRegistration);

routes.put("/:id/graduated", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    validateFields
], httpRegistration.graduatedRegistration);

routes.put("/:id/withdraw", [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de matrícula debe ser válido')
      .trim(),
    validateFields
], httpRegistration.withdrawStudent);

// Acudientes
routes.get("/attendant/:attendantId/registration", [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    validateFields
], httpRegistration.listAttendantById);

routes.post("/attendant/registration", [
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
    validateFields
], httpRegistration.createdAttendant);

routes.put("/attendant/:attendantId/registration", [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    validateFields
], httpRegistration.updatedAttendant);

routes.put("/attendant/:attendantId/activate/registration", [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    validateFields
], httpRegistration.activateAttendant);

routes.put("/attendant/:attendantId/desactivate/registration", [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    validateFields
], httpRegistration.desactivateAttendant);

routes.delete("/attendant/:attendantId/registration", [
    check('attendantId')
      .isMongoId()
      .withMessage('Validación: ID de acudiente debe ser válido')
      .trim(),
    validateFields
], httpRegistration.deleteAttendant);

export default routes;