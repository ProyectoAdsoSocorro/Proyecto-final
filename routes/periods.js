import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '../middlewares/check.js';
import { authPeriodos } from '../middlewares/authPeriod.js';
import * as httpPeriods from '../controllers/periodController.js';

const router = Router();

// Public GET routes (restricted to administrative roles)
router.get('/', [
  authPeriodos
], httpPeriods.getAll);

router.get('/:id', [
  authPeriodos,
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields
], httpPeriods.getById);

router.get('/year/:year', [
  authPeriodos,
  check('year')
    .isNumeric()
    .withMessage("Validación: Año debe ser un número"),
  validateFields
], httpPeriods.getByYear);


// Protected routes – only secretaria role can modify periods
router.post('/', [
  authPeriodos,
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

  validateFields
], httpPeriods.createPeriod);

router.put('/:id', [
  authPeriodos,
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  check('school')
    .optional()
    .isMongoId()
    .withMessage("Validación: ID de escuela debe ser válido"),
  check('year')
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Rango: Año debe estar entre 1900 y 2100"),
  check('cycle')
    .optional()
    .isIn(["normal", "semestral", "trimestral"])
    .withMessage("Validación: Ciclo debe ser normal, semestral o trimestral"),
  check('number')
    .optional()
    .isInt({ min: 1 })
    .withMessage("Rango: Número debe ser entero positivo"),
  check('name')
    .optional()
    .notEmpty()
    .withMessage("Campo requerido: Nombre"),
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage("Validación: Fecha de inicio debe ser válida"),
  check('endDate')
    .optional()
    .isISO8601()
    .withMessage("Validación: Fecha de finalización debe ser válida"),

  check('active')
    .optional()
    .isBoolean()
    .withMessage("Validación: Estado debe ser verdadero o falso"),
  validateFields
], httpPeriods.updatePeriod);

router.put('/:id/activate', [
  authPeriodos,
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields
], httpPeriods.activatePeriod);

router.put('/:id/deactivate', [
  authPeriodos,
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields
], httpPeriods.deactivatePeriod);

router.delete('/:id', [
  authPeriodos,
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields
], httpPeriods.deletePeriod);

export default router;





