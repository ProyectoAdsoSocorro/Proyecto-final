import express from 'express';
import { check, validationResult } from 'express-validator';
import * as controller from '../controllers/bulletinController.js';
// import auth from '../middlewares/auth.js';
// import roleCheck from '../middlewares/roleCheck.js';

const router = express.Router();

/**
 * Reglas de acceso actualizadas:
 * - Rector, Coordinador → solo pueden listar (GET)
 * - Secretaria → puede realizar todas las operaciones (GET, POST, PUT)
 */


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};


/**
 * Boletín corto por estudiante
 */
router.get(
  '/boletin-corto/:estudianteId/:periodoId/:año',
  [
    check('estudianteId').isMongoId().withMessage('El ID del estudiante no es válido'),
     check('periodoId').isMongoId().withMessage('El ID del periodo no es válido'),
     check('año').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
     //auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listShortByStudent
);

/**
 * Boletín largo por estudiante
 */
router.get(
  '/boletin-largo/:estudianteId/:periodoId/:año',
  [
    check('estudianteId').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('periodoId').isMongoId().withMessage('El ID del periodo no es válido'),
    check('año').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    //auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listLongByStudent
);

/**
 * Boletín corto por grupo
 */
router.get(
  '/boletin-corto/:grupoId/:periodoId/:año',
  [
    check('grupoId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('periodoId').isMongoId().withMessage('El ID del periodo no es válido'),
    check('año').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listShortByGroup
);

/**
 * Boletín largo por grupo
 */
router.get(
  '/boletin-largo/:grupoId/:periodoId/:año',
  [
    check('grupoId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('periodoId').isMongoId().withMessage('El ID del periodo no es válido'),
    check('año').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listLongByGroup
);

/**
 * Boletín corto por estudiante con notas finales
 */
router.get(
  '/boletin-final-corto/:estudianteId/:año',
  [
    check('estudianteId').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('año').isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser un número válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listShortFinalsByStudent
);

/**
 * Boletín largo por estudiante con notas finales
 */
router.get(
  '/boletin-final-largo/:estudianteId/:año',
  [
    check('estudianteId').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('año').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listLongFinalsByStudent
);

/**
 * Boletín corto por grupo con notas finales
 */
router.get(
  '/boletin-final-corto/:grupoId/:año',
  [
    check('grupoId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('año').isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser un número válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listShortFinalsByGroup
);

/**
 * Boletín largo por grupo con notas finales
 */
router.get(
  '/boletin-final-largo/:grupoId/:año',
  [
    check('grupoId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('año').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  handleValidationErrors,
  controller.listLongFinalsByGroup
);

export default router;