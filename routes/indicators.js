import { Router } from "express";
import httpIndicators from "../controllers/indicators.js";
import { check } from "express-validator";
import validateFields from "../middlewares/check.js";
import validateAcademicRelations from "../middlewares/validateAcademicRelations.js";
import validateIndicatorData from "../middlewares/validateIndicatorData.js";

const routes = Router();

//obtener todos los indicadores 
routes.get("/api/indicators", httpIndicators.getIndicators,);


//obtener todos los indicadores por ID
routes.get("/api/indicators/:id", [
 check("id")
   .isMongoId()
   .withMessage("Validación: ID de indicador debe ser válido")
   .trim(),
    validateFields
], httpIndicators.getIndicatorById);

// GET - INDICADORES POR CARGA ACADÉMICA
routes.get("/api/academicloads/:academicLoadId/indicators", [
    check("academicLoadId")
      .isMongoId()
      .withMessage("Validación: ID de carga académica debe ser válido"),
    validateFields
], httpIndicators.getIndicatorsByAcademicLoad);

routes.get("/api/indicators/years/:years", [
     check("years")
       .isString()
       .withMessage("Validación: Año debe ser válido")
       .trim(),
    validateFields
], httpIndicators.getIndicatorsByYear);


/* routes.get("/api/groups/:groupsId/indicators", [

    check("groupsId").isMongoId().withMessage("ID de Grupo no válido").trim(),
    validateFields


],httpIndicators.getIndicatorsByGroup); */


/* routes.get("/api/subjects/:subjectsId/indicators", [


] ,httpIndicators.getIndicatorsBySubject); */


routes.get("/api/periods/:periodsId/indicators", [
    check("periodsId")
      .isMongoId()
      .withMessage("Validación: ID de período debe ser válido")
      .trim(),
    validateFields
], httpIndicators.getIndicatorsByPeriod);


routes.get("/api/modelusers/:usersId/indicators", [
    check("usersId")
      .isMongoId()
      .withMessage("Validación: ID de usuario debe ser válido")
      .trim(),
    validateFields
], httpIndicators.getIndicatorsByUser);
routes.post("/api/indicators", [
   check("academicLoad")
     .isMongoId()
     .withMessage("Validación: ID de carga académica debe ser válido"),
    check("period")
      .isMongoId()
      .withMessage("Validación: ID de período debe ser válido"),
    check("type")
      .isArray()
      .withMessage("Formato: Type debe ser un array"),
    check("description")
      .isString()
      .isLength({ min: 5, max: 500 })
      .withMessage("Rango: Descripción debe tener entre 5 y 500 caracteres"),
    check("performanceIndicators")
      .isIn(['Alto', 'Medio', 'Bajo', 'Excelente', 'Regular', 'Deficiente'])
      .withMessage("Validación: Indicador de desempeño no válido"),
    check("userWhoDidIt")
      .isMongoId()
      .withMessage("Validación: ID de usuario debe ser válido"),
     validateFields,
    validateIndicatorData,
], httpIndicators.createIndicator);
routes.put("/api/indicators/:id", [
    check("academicLoad")
      .isMongoId()
      .withMessage("Validación: ID de carga académica debe ser válido"),
    check("period")
      .isMongoId()
      .withMessage("Validación: ID de período debe ser válido"),
    check("type")
      .isArray()
      .withMessage("Formato: Type debe ser un array"),
    check("description")
      .isString()
      .isLength({ min: 5, max: 500 })
      .withMessage("Rango: Descripción debe tener entre 5 y 500 caracteres"),
    check("performanceIndicators")
      .isIn(['Alto', 'Medio', 'Bajo', 'Excelente', 'Regular', 'Deficiente'])
      .withMessage("Validación: Indicador de desempeño no válido"),
    check("userWhoDidIt")
      .isMongoId()
      .withMessage("Validación: ID de usuario debe ser válido"),
    validateFields,
    validateIndicatorData,
], httpIndicators.updateIndicator);
routes.put("/api/indicators/:id/active", [
    check("id")
      .isMongoId()
      .withMessage("Validación: ID de indicador debe ser válido")
      .trim(),
    validateFields
], httpIndicators.activeIndicator);
routes.put("/api/indicators/:id/deactive", [
    check("id")
      .isMongoId()
      .withMessage("Validación: ID de indicador debe ser válido")
      .trim(),
    validateFields
], httpIndicators.deactiveIndicator);
routes.delete("/api/indicators/:id", [
    check("id")
      .isMongoId()
      .withMessage("Validación: ID de indicador debe ser válido")
      .trim(),
    validateFields
], httpIndicators.deleteIndicator);

export default routes;