import Router from "express";
import httpTuition from "../controllers/tuition.js"
import { check } from "express-validator";
import { validateFields } from "../middlewares/checksTuition.js";

const routes = Router();

routes.get("/year/:year", [
    check('year').isInt({ min: 1900, max: 2100 }).toInt(),
    validateFields
], httpTuition.listAllByYear);

routes.get("/:id", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.listById);

routes.get("/groups/:groupId/tuitions", [
    check('groupId', 'No es un ID válido').trim(),
    validateFields
], httpTuition.listTuitionByGroup);

routes.get("/student/:studentId/tuitions", [
    check('studentId', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.listTuitionByStudent);

routes.post("/", [
    check('student', 'El campo del estudiante es obligatorio').isMongoId().trim(),
    // check('attendant', 'El campo del acudiente es obligatorio').isMongoId().trim(),
    check('group', 'El campo del grupo es obligatorio').trim(),
    check('year', 'El año es obligatorio').isInt({ min: 1900, max: 2100 }).toInt(),
    check('tuitionDate', 'La fecha de la matrícula es obligatorio').trim().isISO8601().isDate(),
    check('tuitionNumber', 'El número de la matrícula es obligatorio').trim(),
    check('description', 'La descripción de la matrícula es obligatoria').trim(),
    check('school', 'El campo del colegio es obligatorio').isMongoId().trim(),
    validateFields
], httpTuition.createTuition);

routes.put("/:id", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.updateTuition);

routes.put("/:id/activate", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.activateTuition);

routes.put("/:id/desactivate", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.withdrawnTuition);

routes.put("/:id/desertion", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.desertionTuition);

routes.put("/:id/graduated", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.graduatedTuition);

routes.put("/:id/withdraw", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.withdrawStudent);


// Rutas de acudientes
routes.get("/attendant/:attendantId/tuition", [
    check('attendantId', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.listAttendantById)  //listar acudiente por id

routes.post("/attendant/tuition", [
    check('schoolId', 'El campo del colegio es obligatorio').isMongoId().trim(),
    check('firstName', 'El nombre es obligatorio').trim(),
    check('lastName', 'El apellido es obligatorio').trim(),
    check('documentType', 'El tipo de documento es obligatorio').trim(),
    check('documentNumber', 'El número de documento es obligatorio').trim(),
    check('email', 'El correo es obligatorio').isEmail().trim(),
    check('password', 'La contraseña es obligatoria').trim(),
    check('phone', 'El teléfono es obligatorio').trim(),
    check('address', 'La dirección es obligatoria').trim(),
    check('dateOfBirth', 'La fecha de nacimiento es obligatoria').trim().isISO8601().isDate(),
    check('gender', 'El género es obligatorio').trim(),
    validateFields
],httpTuition.createdAttendant)  //Crear acudiente

routes.put("/attendant/:attendantId/tuition", [
    check('attendantId', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.updatedAttendant)  //Actualizar acudiente

routes.put("/attendant/:attendantId/activate/tuition", [
    check('attendantId', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.activateAttendant)  //Activar acudiente

routes.put("/attendant/:attendantId/desactivate/tuition", [
    check('attendantId', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.desactivateAttendant) //Desactivar acudiente

routes.delete("/attendant/:attendantId/tuition", [
    check('attendantId', 'No es un ID válido').isMongoId().trim(),
    validateFields
], httpTuition.deleteAttendant)  //Eliminar acudiente

export default routes