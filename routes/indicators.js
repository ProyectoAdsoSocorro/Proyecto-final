import { Router } from "express";
import httpIndicators from "../controllers/indicators.js";
import { check } from "express-validator";
import showValidations from "../middlewares/showValidations.js";
import validateAcademicRelations from "../middlewares/validateAcademicRelations.js";
import validateIndicatorData from "../middlewares/validateIndicatorData.js";
import authRole from "../middlewares/authRole.js";
import { validateJWT } from "../middlewares/jwt.js"

const routes = Router();
const onlyList = authRole(["rector", "coordinador", "secretaria"])
const onlySecretary = authRole(["secretaria"])


//obtener todos los indicadores 
routes.get("/", validateJWT,onlyList, httpIndicators.getIndicators,);

//obtener todos los indicadores por ID
routes.get("/:id",validateJWT, onlyList, [
    check("id").isMongoId().withMessage("ID de Indicador no válido").trim(),
    showValidations
], httpIndicators.getIndicatorById);

// GET - INDICADORES POR CARGA ACADÉMICA
routes.get("/academicloads/:academicLoadId/indicators",validateJWT, onlyList,[
    check("academicLoadId").isMongoId().withMessage("ID de Carga Académica no válido"),
    showValidations
], httpIndicators.getIndicatorsByAcademicLoad);

routes.get("/years/:years",validateJWT, onlyList, [
    check("years").isString().withMessage("Año no válido").trim(),
    showValidations
], httpIndicators.getIndicatorsByYear);


/* routes.get("/api/groups/:groupsId/indicators", [

    check("groupsId").isMongoId().withMessage("ID de Grupo no válido").trim(),
    validateFields


],httpIndicators.getIndicatorsByGroup); */


/* routes.get("/api/subjects/:subjectsId/indicators", [


] ,httpIndicators.getIndicatorsBySubject); */


routes.get("/periods/:periodsId/indicators",validateJWT,onlyList, [

    check("periodsId").isMongoId().withMessage("ID de Período no válido").trim(),
    showValidations
], httpIndicators.getIndicatorsByPeriod);


routes.get("modelusers/:usersId/indicators", validateJWT, onlyList, [
    check("usersId").isMongoId().withMessage("ID de Usuario no válido").trim(),
    showValidations


], httpIndicators.getIndicatorsByUser);

routes.post("/", validateJWT,onlySecretary, [
    check("academicLoad").isMongoId().withMessage("ID de Carga Académica no válido"),
    check("period").isMongoId().withMessage("ID de Período no válido"),
    check("type").isArray().withMessage("Type debe ser un array"),
    check("description").isString().isLength({ min: 5, max: 500 }).withMessage("Descripción debe tener entre 5 y 500 caracteres"),
    check("performanceIndicators").isIn(['Alto', 'Medio', 'Bajo', 'Excelente', 'Regular', 'Deficiente']).withMessage("performanceIndicators no válido"),
    check("userWhoDidIt").isMongoId().withMessage("ID de Usuario no válido"),
    showValidations,
    validateIndicatorData,
], httpIndicators.createIndicator);

routes.put("/:id",validateJWT,onlySecretary,[
    check("academicLoad").isMongoId().withMessage("ID de Carga Académica no válido"),
    check("period").isMongoId().withMessage("ID de Período no válido"),
    check("type").isArray().withMessage("Type debe ser un array"),
    check("description").isString().isLength({ min: 5, max: 500 }).withMessage("Descripción debe tener entre 5 y 500 caracteres"),
    check("performanceIndicators").isIn(['Alto', 'Medio', 'Bajo', 'Excelente', 'Regular', 'Deficiente']).withMessage("performanceIndicators no válido"),
    check("userWhoDidIt").isMongoId().withMessage("ID de Usuario no válido"),
    showValidations,
    validateIndicatorData,

], httpIndicators.updateIndicator);

routes.put("/:id/active", validateJWT,onlySecretary,[
    check("id").isMongoId().withMessage("ID de Indicador no válido").trim(),
    showValidations
], httpIndicators.activeIndicator);

routes.put("/:id/deactive", validateJWT,onlySecretary,[
    check("id").isMongoId().withMessage("ID de Indicador no válido").trim(),
    showValidations
], httpIndicators.deactiveIndicator);

routes.delete("/:id", validateJWT,onlySecretary,[
    check("id").isMongoId().withMessage("ID de Indicador no válido").trim(),
    showValidations
], httpIndicators.deleteIndicator);

export default routes;