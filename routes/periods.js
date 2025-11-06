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
  check('id').isMongoId().withMessage("El ID de periodo no es valido"),
  validateFields
], httpPeriods.getById);

router.get('/year/:year', [
  check('year').isNumeric().withMessage("El año debe ser un número"),
  validateFields
], httpPeriods.getByYear);

router.post('/', [
  ensureSecretariaRole,
  check('school').isMongoId().withMessage("El ID del colegio no es válido"),
  check('startDate').isDate().withMessage("La fecha de inicio no es válida"),
  check('year').isNumeric().withMessage("El año debe ser un número"),
  check('cycle').isIn(['normal', 'semestral', 'trimestral']).withMessage("El ciclo no es válido"),
  check('number').isNumeric().withMessage("El número debe ser un número"),
  check('name').notEmpty().withMessage("El nombre no puede estar vacío"),
  check('endDate').isDate().withMessage("La fecha de fin no es válida"),
  check('percentage').isNumeric().withMessage("El porcentaje debe ser un número"),
  validateFields
], httpPeriods.createPeriod);

router.put('/:id', [
  ensureSecretariaRole,
  check("id").isMongoId().withMessage("ID de período no válido"),
  check("school").optional().isMongoId().withMessage("ID de escuela no válido"),
  check("year").optional().isInt({ min: 1900, max: 2100 }).withMessage("El año debe ser un número válido entre 1900 y 2100"),
  check("cycle").optional().isIn(["normal", "semestral", "trimestral"]).withMessage("El ciclo debe ser 'normal', 'semestral' o 'trimestral'"),
  check("number").optional().isInt({ min: 1 }).withMessage("El número debe ser un entero positivo"),
  check("name").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  check("startDate").optional().isISO8601().withMessage("La fecha de inicio debe ser válida"),
  check("endDate").optional().isISO8601().withMessage("La fecha de finalización debe ser válida"),
  check("percentage").optional().isInt({ min: 0, max: 100 }).withMessage("El porcentaje debe estar entre 0 y 100"),
  check("active").optional().isBoolean().withMessage("El estado activo debe ser un valor booleano"),
  validateFields
], httpPeriods.updatePeriod);

router.put('/:id/activate', [
  ensureSecretariaRole,
  check('id').isMongoId().withMessage("El ID de periodo no es correcto ¡Por favor verifique!")
], httpPeriods.activatePeriod);

router.put('/:id/deactivate', [
  ensureSecretariaRole,
  check('id').isMongoId().withMessage("El ID de periodo no es correcto ¡Por favor verifique!")
], httpPeriods.deactivatePeriod);

router.delete('/:id', [
  ensureSecretariaRole,
  check("id").isMongoId().withMessage("ID de período no válido"),
  validateFields
], httpPeriods.deletePeriod);

export default router;
