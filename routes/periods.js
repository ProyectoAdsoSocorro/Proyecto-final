import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '../middlewares/check.js';
import * as httpPeriods from '../controllers/periodController.js';
import { authPeriodosFlexible } from '../middlewares/authPeriod.js';

const router = Router();


// Routes
router.get('/', httpPeriods.getAll);

router.get('/:id', [
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields,
  authPeriodosFlexible
], httpPeriods.getById);

router.get('/year/:year', [
  check('year')
    .isNumeric()
    .withMessage("Validación: Año debe ser un número"),
  validateFields,
  authPeriodosFlexible
], httpPeriods.getByYear);

router.post('/', [
  check('school')
    .isMongoId()
    .withMessage("Validación: ID de colegio debe ser válido"),
  check('startDate')
    .isDate()
    .withMessage("Validación: Fecha de inicio debe ser válida"),
  check('year')
    .isNumeric()
    .withMessage("Validación: Año debe ser un número"),
  check('cycle')
    .isIn(['normal', 'semestral', 'trimestral'])
    .withMessage("Validación: Ciclo debe ser normal, semestral o trimestral"),
  check('number')
    .isNumeric()
    .withMessage("Validación: Número debe ser un número"),
  check('name')
    .notEmpty()
    .withMessage("Campo requerido: Nombre"),
  check('endDate')
    .isDate()
    .withMessage("Validación: Fecha de fin debe ser válida"),
  check('percentage')
    .isNumeric()
    .withMessage("Validación: Porcentaje debe ser un número"),
  validateFields,
  authPeriodosFlexible
], httpPeriods.createPeriod);

router.put('/:id', [
  check("id")
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  check("school")
    .optional()
    .isMongoId()
    .withMessage("Validación: ID de escuela debe ser válido"),
  check("year")
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Rango: Año debe estar entre 1900 y 2100"),
  check("cycle")
    .optional()
    .isIn(["normal", "semestral", "trimestral"])
    .withMessage("Validación: Ciclo debe ser normal, semestral o trimestral"),
  check("number")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Rango: Número debe ser entero positivo"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Campo requerido: Nombre"),
  check("startDate")
    .optional()
    .isISO8601()
    .withMessage("Validación: Fecha de inicio debe ser válida"),
  check("endDate")
    .optional()
    .isISO8601()
    .withMessage("Validación: Fecha de finalización debe ser válida"),
  check("percentage")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Rango: Porcentaje debe estar entre 0 y 100"),
  check("active")
    .optional()
    .isBoolean()
    .withMessage("Validación: Estado debe ser verdadero o falso"),
  validateFields,
  authPeriodosFlexible
], httpPeriods.updatePeriod);

router.put('/:id/activate', [
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields,
  authPeriodosFlexible
], httpPeriods.activatePeriod);

router.put('/:id/deactivate', [
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields,
  authPeriodosFlexible
], httpPeriods.deactivatePeriod);

router.delete('/:id', [
  check("id")
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields,
  authPeriodosFlexible
], httpPeriods.deletePeriod);

export default router;
