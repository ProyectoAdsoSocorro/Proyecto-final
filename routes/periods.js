import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '../middlewares/checksPeriodos.js';
import * as httpPeriods from '../controllers/periodController.js';

const router = Router();

// Apply middleware for role-based access control
const ensureSecretariaRole = (req, res, next) => {
    if (req.user && req.user.role === 'secretaria') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Only secretaria role is allowed.' });
};

// Routes
router.get('/', httpPeriods.getAll);

router.get('/:id', [
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields
], httpPeriods.getById);

router.get('/year/:year', [
  check('year')
    .isNumeric()
    .withMessage("Validación: Año debe ser un número"),
  validateFields
], httpPeriods.getByYear);

router.post('/', [
  ensureSecretariaRole,
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
  validateFields
], httpPeriods.createPeriod);

router.put('/:id', [
  ensureSecretariaRole,
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
  validateFields
], httpPeriods.updatePeriod);

router.put('/:id/activate', [
  ensureSecretariaRole,
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido")
], httpPeriods.activatePeriod);

router.put('/:id/deactivate', [
  ensureSecretariaRole,
  check('id')
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido")
], httpPeriods.deactivatePeriod);

router.delete('/:id', [
  ensureSecretariaRole,
  check("id")
    .isMongoId()
    .withMessage("Validación: ID de período debe ser válido"),
  validateFields
], httpPeriods.deletePeriod);

export default router;
