import Router from "express";
import httpRegistration from "../controllers/registration.js"
import { check } from "express-validator";
import { validateFields } from "../middlewares/checksTuition.js";

const routes = Router();

routes.get("/year/:year", [
    check('year', 'El año debe ser un número válido entre 1900 y 2100').isInt({ min: 1900, max: 2100 }).toInt(),
    validateFields
], httpRegistration.listAllByYear);

routes.get("/:id", [
    check('id', 'El ID proporcionado no es válido. Debe ser un identificador único.').isMongoId().trim(),
    validateFields
], httpRegistration.listById);

routes.get("/groups/:groupId/registrations", [
    check('groupId', 'El ID del grupo no es válido.').isMongoId().trim(), // Agregué isMongoId() aquí también
    validateFields
], httpRegistration.listRegistrationByGroup);

routes.get("/student/:studentId/registrations", [
    check('studentId', 'El ID del estudiante no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.listRegistrationByStudent);

routes.post("/", [
    check('student', 'El ID del estudiante es obligatorio y debe ser válido.').isMongoId().trim(),
    check('attendant').isArray().withMessage('El campo acudiente debe ser una lista con el ID del acudiente y su parentesco.'),
    check('attendant.*._id').isMongoId().withMessage('El ID del acudiente no es válido. Asegúrate de que sea un identificador único.'),
    check('attendant.*.relationship').isString().withMessage('El parentesco debe ser un texto válido (por ejemplo: padre, madre, abuelo).'),
    check('group', 'El ID del grupo es obligatorio y debe ser válido.').isMongoId().trim(), // Aseguramos que también sea un ObjectId
    check('year', 'El año es obligatorio y debe ser un número entre 1900 y 2100.').isInt({ min: 1900, max: 2100 }).toInt(),
    check('registrationDate', 'La fecha de matrícula es obligatoria y debe tener formato YYYY-MM-DD.').trim().isISO8601().isDate(),
    check('registrationNumber', 'El número de matrícula es obligatorio.').trim(),
    check('description', 'La descripción de la matrícula es obligatoria.').trim(),
    check('school', 'El ID del colegio es obligatorio y debe ser válido.').isMongoId().trim(),
    validateFields
], httpRegistration.createRegistration);

routes.put("/:id", [
    check('id', 'El ID proporcionado no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.updateRegistration);

routes.put("/:id/activate", [
    check('id', 'El ID proporcionado no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.activateRegistration);

routes.put("/:id/desactivate", [
    check('id', 'El ID proporcionado no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.withdrawnRegistration);

routes.put("/:id/desertion", [
    check('id', 'El ID proporcionado no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.desertionRegistration);

routes.put("/:id/graduated", [
    check('id', 'El ID proporcionado no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.graduatedRegistration);

routes.put("/:id/withdraw", [
    check('id', 'El ID proporcionado no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.withdrawStudent);

// Rutas de acudientes
routes.get("/attendant/:attendantId/registration", [
    check('attendantId', 'El ID del acudiente no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.listAttendantById)

routes.post("/attendant/registration", [
    check('schoolId', 'El ID del colegio es obligatorio y debe ser válido.').isMongoId().trim(),
    check('firstName', 'El nombre es obligatorio.').trim(),
    check('lastName', 'El apellido es obligatorio.').trim(),
    check('documentType', 'El tipo de documento es obligatorio.').trim(),
    check('documentNumber', 'El número de documento es obligatorio.').trim(),
    check('email', 'El correo electrónico es obligatorio y debe ser válido.').isEmail().trim(),
    check('password', 'La contraseña es obligatoria.').trim(),
    check('phone', 'El teléfono es obligatorio.').trim(),
    check('address', 'La dirección es obligatoria.').trim(),
    check('dateOfBirth', 'La fecha de nacimiento es obligatoria y debe tener formato YYYY-MM-DD.').trim().isISO8601().isDate(),
    check('gender', 'El género es obligatorio.').trim(),
    validateFields
],httpRegistration.createdAttendant)

routes.put("/attendant/:attendantId/registration", [
    check('attendantId', 'El ID del acudiente no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.updatedAttendant)

routes.put("/attendant/:attendantId/activate/registration", [
    check('attendantId', 'El ID del acudiente no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.activateAttendant)

routes.put("/attendant/:attendantId/desactivate/registration", [
    check('attendantId', 'El ID del acudiente no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.desactivateAttendant)

routes.delete("/attendant/:attendantId/registration", [
    check('attendantId', 'El ID del acudiente no es válido.').isMongoId().trim(),
    validateFields
], httpRegistration.deleteAttendant)

export default routes