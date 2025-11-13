import express from 'express';
import { check, validationResult } from 'express-validator';
import * as controller from '../controllers/qualificationController.js';
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
 * Reglas de acceso actualizadas:
 * - Rector, Coordinador y Secretaria → solo pueden listar (GET)
 * - Profesor → puede realizar todas las operaciones (GET, POST, PUT)
 */

/**
 * Obtener calificación por ID
 */
router.get(
  '/:id',
  [
    check('id').isMongoId().withMessage('El ID de la calificación no es válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria', 'profesor']),
  ],
  handleValidationErrors,
  controller.get
);

/**
 * Calificaciones de un estudiante
 */
router.get(
  '/estudiantes/:studentId/calificaciones',
  [
    check('studentId').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria', 'profesor']),
  ],
  handleValidationErrors,
  controller.listByStudent
);

/**
 * Calificaciones de un grupo
 */
router.get(
  '/grupos/:groupId/calificaciones',
  [
    check('groupId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria', 'profesor']),
  ],
  handleValidationErrors,
  controller.listByGroup
);

/**
 * Calificaciones por grupo y materia
 */
router.get(
  '/grupos/:groupId/materias/:subjectId/calificaciones',
  [
    check('groupId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('subjectId').isMongoId().withMessage('El ID de la materia no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria', 'profesor']),
  ],
  handleValidationErrors,
  controller.listByGroupAndSubject
);

/**
 * Listar todas las calificaciones finales por año
 */
router.get(
  '/finales/:year',
  [
    check('year').isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser un número válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria', 'profesor']),
  ],
  handleValidationErrors,
  controller.listFinalsByYear
);

/**
 * Calificaciones finales de un estudiante (por año)
 */
router.get(
  '/estudiantes/:studentId/calificaciones/finales',
  [
    check('studentId').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria', 'profesor']),
  ],
  handleValidationErrors,
  controller.listFinalsByStudent
);

/**
 * Calificaciones finales de un grupo
 */
router.get(
  '/grupos/:groupId/calificaciones/finales',
  [
    check('groupId').isMongoId().withMessage('El ID del grupo no es válido'),
    check('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    // auth,
    // roleCheck(['rector', 'coordinador', 'secretaria', 'profesor']),
  ],
  handleValidationErrors,
  controller.listFinalsByGroup
);

/**
 * Crear calificación individual
 * Solo profesor
 */
router.post(
  '/',
  [
    check('school').isMongoId().withMessage('El ID del colegio no es válido'),
    check('student').isMongoId().withMessage('El ID del estudiante no es válido'),
    check('subject').isMongoId().withMessage('El ID de la materia no es válido'),
    check('group').optional().isMongoId().withMessage('El ID del grupo no es válido'),
    check('year').isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    check('gradeType').isIn(['PERIOD', 'FINAL']).withMessage('El tipo de nota debe ser PERIOD o FINAL'),
    check('grade').isFloat({ min: 0, max: 5 }).withMessage('La nota debe estar entre 0 y 5'),
    // auth,
    // roleCheck(['profesor']),
  ],
  handleValidationErrors,
  controller.create
);

/**
 * Crear múltiples calificaciones (lote)
 * Solo profesor
 */
router.post(
  '/lote',
  [
    check().custom((value, { req }) => {
      const calificaciones = req.body;
      if (!Array.isArray(calificaciones) || calificaciones.length === 0) {
        throw new Error('Debe enviar un array de calificaciones');
      }

      calificaciones.forEach((item, index) => {
        if (!item.school?.match(/^[0-9a-fA-F]{24}$/)) throw new Error(`Calificación #${index + 1}: ID de colegio inválido`);
        if (!item.student?.match(/^[0-9a-fA-F]{24}$/)) throw new Error(`Calificación #${index + 1}: ID de estudiante inválido`);
        if (!item.subject?.match(/^[0-9a-fA-F]{24}$/)) throw new Error(`Calificación #${index + 1}: ID de materia inválido`);
        if (item.group && !item.group.match(/^[0-9a-fA-F]{24}$/)) throw new Error(`Calificación #${index + 1}: ID de grupo inválido`);
        if (typeof item.year !== 'number' || item.year < 2000 || item.year > 2100)
          throw new Error(`Calificación #${index + 1}: año no válido`);
        if (!['PERIOD', 'FINAL'].includes(item.gradeType))
          throw new Error(`Calificación #${index + 1}: tipo de nota inválido`);
        if (typeof item.grade !== 'number' || item.grade < 0 || item.grade > 5)
          throw new Error(`Calificación #${index + 1}: nota fuera del rango (0–5)`);
      });
      return true;
    }),
    handleValidationErrors,
    // auth,
    // roleCheck(['profesor']),
  ],
  controller.createBatch
);

/**
 * Generar calificaciones finales automáticamente
 * Se calculan como promedio de todas las notas de período del estudiante
 * Solo profesor
 */
router.post(
  '/finales/generar',
  [
    check('schoolId').isMongoId().withMessage('El ID del colegio no es válido'),
    check('year').isInt({ min: 2000, max: 2100 }).withMessage('El año debe ser válido'),
    check('groupId').optional().isMongoId().withMessage('El ID del grupo no es válido'),
    // auth,
    // roleCheck(['profesor']),
  ],
  handleValidationErrors,
  controller.generateFinals
);

/**
 * Actualizar calificación de período
 * Solo profesor
 */
router.put(
  '/:id',
  [
    check('id').isMongoId().withMessage('El ID de la calificación no es válido'),
    check('grade').optional().isFloat({ min: 0, max: 5 }).withMessage('La nota debe estar entre 0 y 5'),
    // auth,
    // roleCheck(['profesor']),
  ],
  handleValidationErrors,
  controller.update
);

/**
 * Actualizar calificación final
 * Solo profesor
 */
router.put(
  '/finales/:id',
  [
    check('id').isMongoId().withMessage('El ID de la calificación final no es válido'),
    check('grade').optional().isFloat({ min: 0, max: 5 }).withMessage('La nota debe estar entre 0 y 5'),
    // auth,
    // roleCheck(['profesor']),
  ],
  handleValidationErrors,
  controller.updateFinal
);

export default router;


