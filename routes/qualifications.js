import express from 'express';
import { check, body } from 'express-validator';
import * as controller from '../controllers/qualifications.js';
import showValidations from "../middlewares/showValidations.js"
import {validateJWT} from '../middlewares/jwt.js';
import authRole from '../middlewares/authRole.js';

const router = express.Router();
const onlySecretary = authRole(['secretaria']);
const onlyList = authRole(['rector', 'coordinador', 'secretaria']); 

/**
 * Middleware para manejar errores de validación
 */

/**
 * Reglas de acceso actualizadas:
 * - Rector y Coordinador → solo pueden listar (GET)
 * - Secretaria → puede realizar todas las operaciones (GET, POST, PUT)
 */


/**
 * Obtener calificación por ID
 */
router.get(
  '/:id',
  validateJWT,
  onlyList,
  [
    check('id').isMongoId().withMessage('El ID de la calificación no es válido')
  ],
  showValidations,
  controller.get
);

/**
 * Calificaciones de un estudiante
 */
router.get(
  '/estudiantes/:studentId/calificaciones',
  validateJWT,
  onlyList,
  [
    check('studentId').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  showValidations,
  controller.listByStudent
);

/**
 * Calificaciones de un grupo
 */
router.get(
  '/grupos/:groupId/calificaciones',
  validateJWT,
  onlyList,
  [
    check('groupId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  showValidations,
  controller.listByGroup
);

/**
 * Calificaciones por grupo y materia
 */
router.get(
  '/grupos/:groupId/materias/:subjectId/calificaciones',
  validateJWT,
  onlyList,
  [
    check('groupId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('subjectId').isMongoId().withMessage('El ID de la materia no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  showValidations,
  controller.listByGroupAndSubject
);

/**
 * Listar todas las calificaciones finales por año
 */
router.get(
  '/finales/:year',
  validateJWT,
  onlyList,
  [
    check('year').isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser un número válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  showValidations,
  controller.listFinalsByYear
);

/**
 * Calificaciones finales de un estudiante (por año)
 */
router.get(
  '/estudiantes/:studentId/calificaciones/finales',
  validateJWT,
  onlyList,
  [
    check('studentId').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  showValidations,
  controller.listFinalsByStudent
);

/**
 * Calificaciones finales de un grupo
 */
router.get(
  '/grupos/:groupId/calificaciones/finales',
  validateJWT,
  onlyList,
  [
    check('groupId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),
  ],
  showValidations,
  controller.listFinalsByGroup
);

/**
 * Crear calificación individual
 * Solo secretaria
 */
router.post(
  '/',
  validateJWT,
  onlySecretary,
  [
    check('school').isMongoId().withMessage('El ID del colegio no es válido'),
    check('student').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('subject').isMongoId().withMessage('El ID de la materia no es válido'),
    check('group').optional().isMongoId().withMessage('El ID del grupo no es válido'),
    check('year').isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    check('noteType').isIn(['PERIOD', 'FINAL']).withMessage('El tipo de nota debe ser PERIOD o FINAL'),
    check('note').isFloat({ min: 0, max: 5 }).withMessage('La nota debe estar entre 0 y 5'),
    // auth,
    // roleCheck(['secretaria']),
  ],
  showValidations,
  controller.create
);

/**
 * Crear múltiples calificaciones (lote)
 * Solo secretaria
 */
router.post(
  '/lote',
  validateJWT,
  onlySecretary,
  [
    // Validar que el body sea un array no vacío
    // Usamos body() para asegurar que la validación se aplica solo al body
    body().isArray({ min: 1 })
      .withMessage('Debe enviar un array de calificaciones con al menos un elemento'),
    // Validar cada campo de cada objeto en el array
    body('*.school').isMongoId().withMessage('ID de colegio inválido en el lote'),
    body('*.student').isMongoId().withMessage('ID de estudiante inválido en el lote'),
    body('*.subject').isMongoId().withMessage('ID de materia inválido en el lote'),
    body('*.year').isInt({ min: 2000, max: 2100 }).withMessage('Año inválido en el lote'),
    body('*.noteType').isIn(['PERIOD', 'FINAL']).withMessage('Tipo de nota inválido en el lote'),
    body('*.note').isFloat({ min: 0, max: 5 }).withMessage('Nota fuera de rango en el lote'),
    showValidations,
    // auth,
    // roleCheck(['secretaria']),
  ],
  controller.createBatch
);

/**
 * Generar notas finales automáticamente para todo el sistema
 * Solo secretaria
 */
router.post(
  '/generar-finales',
  validateJWT,
  onlySecretary,
  [
    check('year')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('El año es obligatorio y debe ser válido'),
    // auth,
    // roleCheck(['secretaria']), 
  ],
  showValidations,
  controller.generateFinals
);


/**
 * Actualizar calificación de período
 * Solo secretaria
 */
router.put(
  '/:id',
  validateJWT,
  onlySecretary,
  [
    check('id').isMongoId().withMessage('El ID de la calificación no es válido'),
    check('note').optional().isFloat({ min: 0, max: 5 }).withMessage('La nota debe estar entre 0 y 5'),
    // auth,
    // roleCheck(['secretaria']),
  ],
  showValidations,
  controller.update
);

/**
 * Actualizar calificación final
 * Solo secretaria
 */
router.put(
  '/finales/:id',
  validateJWT,
  onlySecretary,
  [
    check('id').isMongoId().withMessage('El ID de la calificación final no es válido'),
    check('note').optional().isFloat({ min: 0, max: 5 }).withMessage('La nota debe estar entre 0 y 5'),
    // auth,
    // roleCheck(['secretaria']),
  ],
  showValidations,
  controller.updateFinal
);

export default router;
