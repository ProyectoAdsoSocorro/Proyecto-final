import express from 'express';
import { check, validationResult } from 'express-validator';
import * as controller from '../controllers/validityController.js';
// import auth from '../middlewares/auth.js';
// import roleCheck from '../middlewares/roleCheck.js';

const router = express.Router();

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

/**
 * Reglas de acceso:
 * - Rector y Coordinador → solo pueden listar (GET)
 * - Secretaria → puede crear, activar y desactivar vigencias
 */

/**
 * Listar todas las vigencias (por años)
 * GET /api/vigencias/anio
 */
router.get(
  '/year',
  [
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  controller.list
);

/**
 * Obtener la vigencia activa
 * GET /api/vigencias/activa
 */
router.get(
  '/activa',
  [
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  controller.getActive
);

/**
 * Crear nueva vigencia
 * POST /api/vigencias
 * Solo secretaria
 */
router.post(
  '/',
  [
    check('year')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('El año académico debe ser un número válido'),
    check('school')
      .isMongoId()
      .withMessage('El ID del colegio no es válido'),
    check('rector')
      .optional()
      .isMongoId()
      .withMessage('El ID del rector no es válido'),
    check('generalSecretary')
      .optional()
      .isMongoId()
      .withMessage('El ID de la secretaria general no es válido'),
    check('headquarterInfo')
      .optional()
      .isArray()
      .withMessage('headquarterInfo debe ser un arreglo'),
    check('maxGrade')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('La nota máxima debe estar entre 0 y 10'),
    check('minGrade')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('La nota mínima debe estar entre 0 y 10'),
    check('recoveryType')
      .optional()
      .isIn(['PROMEDIO', 'REEMPLAZO'])
      .withMessage('El tipo de recuperación debe ser PROMEDIO o REEMPLAZO'),
    check('recoveryPercentage')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('El porcentaje de recuperación debe estar entre 0 y 100'),
    // auth,
    // roleCheck(['secretaria']),
  ],
  handleValidationErrors,
  controller.create
);

/**
 * Activar una vigencia específica
 * PUT /api/vigencias/:id/activar
 * Solo secretaria
 */
router.put(
  '/:id/activar',
  [
    check('id').isMongoId().withMessage('El ID de la vigencia no es válido'),
    // auth,
    // roleCheck(['secretaria']),
  ],
  handleValidationErrors,
  controller.activate
);

/**
 * Desactivar una vigencia específica
 * PUT /api/vigencias/:id/desactivar
 * Solo secretaria
 */
router.put(
  '/:id/desactivar',
  [
    check('id').isMongoId().withMessage('El ID de la vigencia no es válido'),
    // auth,
    // roleCheck(['secretaria']),
  ],
  handleValidationErrors,
  controller.deactivate
);

export default router;
