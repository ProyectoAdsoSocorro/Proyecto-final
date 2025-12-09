import express from 'express';
import { check, validationResult } from 'express-validator';
import * as controller from '../controllers/validitys.js';
import showValidations from "../middlewares/showValidations.js"
import { validateJWT } from '../middlewares/jwt.js';
import authRole from '../middlewares/authRole.js';

const router = express.Router();
const onlyList = authRole(["rector", "coordinador", "secretaria"]);
const onlySecretary = authRole(["secretaria"]);

/**
 * Middleware para manejar errores de validación
 */

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
  validateJWT,
  onlyList,
  controller.list
);

/**
 * Obtener la vigencia activa
 * GET /api/vigencias/activa
 */
router.get(
  '/activa',
  validateJWT,
  onlyList,
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
      .withMessage('Rango: Año académico debe estar entre 2000 y 2100'),
    check('school')
      .isMongoId()
      .withMessage('Validación: ID del colegio debe ser válido'),
    check('rector')
      .optional()
      .isMongoId()
      .withMessage('Validación: ID del rector debe ser válido'),
    check('generalSecretary')
      .optional()
      .isMongoId()
      .withMessage('Validación: ID de secretaria general debe ser válido'),
    check('headquarterInfo')
      .optional()
      .isArray()
      .withMessage('Formato: Información de sedes debe ser un array'),
    check('maxGrade')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('Rango: Nota máxima debe estar entre 0 y 10'),
    check('minGrade')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('Rango: Nota mínima debe estar entre 0 y 10'),
    check('recoveryType')
      .optional()
      .isIn(['PROMEDIO', 'REEMPLAZO'])
      .withMessage('Validación: Tipo de recuperación debe ser PROMEDIO o REEMPLAZO'),
    check('recoveryPercentage')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Rango: Porcentaje de recuperación debe estar entre 0 y 100'),
  ],
  validateJWT,
  onlySecretary,
  showValidations,
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
    check('id').isMongoId().withMessage('Validación: ID de vigencia debe ser válido'),
  ],
  validateJWT,
  onlySecretary,
  showValidations,
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
    check('id').isMongoId().withMessage('Validación: ID de vigencia debe ser válido'),
  ],
  validateJWT,
  onlySecretary,
  showValidations,
  controller.deactivate
);

export default router;
