import Router from "express";
import httpHeadquarters from "../controllers/headquarters.js"
import { check } from "express-validator"
import { validateFields } from "../middlewares/checksHeadquarters.js";

const routes = Router();

routes.get("/",/* [
    validarol (["R","E"])
    check
] */ httpHeadquarters.listAll);

routes.get("/:id", [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], httpHeadquarters.listById);

routes.get("/colegios/:colegioId/sedes", [
    check('colegioId', 'No es un ID válido').isMongoId(),
    validateFields
], httpHeadquarters.headquartersBySchool);

routes.post("/", [
    check('school', 'El ID del colegio es obligatorio').isMongoId().notEmpty().trim(),
    check('name', 'El nombre de la sede es obligatorio').notEmpty().trim(),
    check('abbreviation', 'La abreviatura de la sede es obligatoria').notEmpty().trim(),
    check('code', 'El codigo de la sede es obligatorio').notEmpty().trim(),
    check('address', 'La direccion de la sede es obligatoria').notEmpty().trim(),
    check('phone', 'El numero de telefono es obligatorio').notEmpty().trim(),
    validateFields
], httpHeadquarters.createHeadquarters);

routes.put("/:id", [
    check('id', 'No es un ID válido').isMongoId().trim(),
    check('school', 'El ID del colegio es obligatorio').isMongoId().notEmpty().trim(),
    check('name', 'El nombre de la sede es obligatorio').notEmpty().trim(),
    check('abbreviation', 'La abreviatura de la sede es obligatoria').notEmpty().trim(),
    check('code', 'El codigo de la sede es obligatorio').notEmpty().trim(),
    check('address', 'La direccion de la sede es obligatoria').notEmpty().trim(),
    check('phone', 'El numero de telefono es obligatorio').notEmpty().trim(),
    validateFields
], httpHeadquarters.updateHeadquarters);

routes.put("/:id/activar", [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], httpHeadquarters.activateHeadquarters);

routes.put("/:id/inactivar", [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], httpHeadquarters.deactivateHeadquarters);

routes.delete("/:id", [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], httpHeadquarters.deleteHeadquarters);

export default routes;