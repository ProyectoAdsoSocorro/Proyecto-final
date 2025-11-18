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
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de calificación debe ser válido'),
    handleValidationErrors,
  ],
  controller.get
);

/**
 * Calificaciones de un estudiante
 */
router.get(
  '/estudiantes/:studentId/calificaciones',
  [
    check('studentId')
      .isMongoId()
      .withMessage('Validación: ID de estudiante debe ser válido'),
    check('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    handleValidationErrors,
  ],
  controller.listByStudent
);

/**
 * Calificaciones de un grupo
 */
router.get(
  '/grupos/:groupId/calificaciones',
  [
    check('groupId')
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido'),
    check('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    handleValidationErrors,
  ],
  controller.listByGroup
);

/**
 * Calificaciones por grupo y materia
 */
router.get(
  '/grupos/:groupId/materias/:subjectId/calificaciones',
  [
    check('groupId')
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido'),
    check('subjectId')
      .isMongoId()
      .withMessage('Validación: ID de materia debe ser válido'),
    check('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    handleValidationErrors,
  ],
  controller.listByGroupAndSubject
);

/**
 * Listar todas las calificaciones finales por año
 */
router.get(
  '/finales/:year',
  [
    check('year')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    handleValidationErrors,
  ],
  controller.listFinalsByYear
);

/**
 * Calificaciones finales de un estudiante (por año)
 */
router.get(
  '/estudiantes/:studentId/calificaciones/finales',
  [
    check('studentId')
      .isMongoId()
      .withMessage('Validación: ID de estudiante debe ser válido'),
    check('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    handleValidationErrors,
  ],
  controller.listFinalsByStudent
);

/**
 * Calificaciones finales de un grupo
 */
router.get(
  '/grupos/:groupId/calificaciones/finales',
  [
    check('groupId')
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido'),
    check('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    handleValidationErrors,
  ],
  controller.listFinalsByGroup
);

/**
 * Crear calificación individual
 * Solo profesor
 */
router.post(
  '/',
  [
    check('school')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido'),
    check('student')
      .isMongoId()
      .withMessage('Validación: ID de estudiante debe ser válido'),
    check('subject')
      .isMongoId()
      .withMessage('Validación: ID de materia debe ser válido'),
    check('group')
      .optional()
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido'),
    check('year')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    check('gradeType')
      .isIn(['PERIOD', 'FINAL'])
      .withMessage('Validación: Tipo de nota debe ser PERIOD o FINAL'),
    check('grade')
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rango: Nota debe estar entre 0 y 5'),
    handleValidationErrors,
  ],
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
        throw new Error('Formato: Debe enviar un array de calificaciones');
      }

      calificaciones.forEach((item, index) => {
        if (!item.school?.match(/^[0-9a-fA-F]{24}$/)) 
          throw new Error(`Validación #${index + 1}: ID de colegio inválido`);
        if (!item.student?.match(/^[0-9a-fA-F]{24}$/)) 
          throw new Error(`Validación #${index + 1}: ID de estudiante inválido`);
        if (!item.subject?.match(/^[0-9a-fA-F]{24}$/)) 
          throw new Error(`Validación #${index + 1}: ID de materia inválido`);
        if (item.group && !item.group.match(/^[0-9a-fA-F]{24}$/)) 
          throw new Error(`Validación #${index + 1}: ID de grupo inválido`);
        if (typeof item.year !== 'number' || item.year < 2000 || item.year > 2100)
          throw new Error(`Rango #${index + 1}: Año no válido`);
        if (!['PERIOD', 'FINAL'].includes(item.gradeType))
          throw new Error(`Validación #${index + 1}: Tipo de nota inválido`);
        if (typeof item.grade !== 'number' || item.grade < 0 || item.grade > 5)
          throw new Error(`Rango #${index + 1}: Nota fuera del rango (0–5)`);
      });
      return true;
    }),
    handleValidationErrors,
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
    check('schoolId')
      .isMongoId()
      .withMessage('Validación: ID de colegio debe ser válido'),
    check('year')
      .isInt({ min: 2000, max: 2100 })
      .withMessage('Rango: Año debe estar entre 2000 y 2100'),
    check('groupId')
      .optional()
      .isMongoId()
      .withMessage('Validación: ID de grupo debe ser válido'),
    handleValidationErrors,
  ],
  controller.generateFinals
);

/**
 * Actualizar calificación de período
 * Solo profesor
 */
router.put(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de calificación debe ser válido'),
    check('grade')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rango: Nota debe estar entre 0 y 5'),
    handleValidationErrors,
  ],
  controller.update
);

/**
 * Actualizar calificación final
 * Solo profesor
 */
router.put(
  '/finales/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID de calificación final debe ser válido'),
    check('grade')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rango: Nota debe estar entre 0 y 5'),
    handleValidationErrors,
  ],
  controller.updateFinal
);

export default router;


