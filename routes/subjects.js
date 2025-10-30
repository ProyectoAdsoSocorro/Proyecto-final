import { Router } from 'express';
import {
  listSubjects,
  getSubject,
  listByType,
  listByArea,
  createSubject,
  updateSubject,
  activateSubject,
  deactivateSubject,
  deleteSubject
} from '../controllers/subjectController.js';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/checksSubject.js';

const router = Router();

// Rutas específicas primero
// List by type (materia or area) - ruta en inglés
router.get('/type/:typeId',[
  check('typeId', 'El tipo debe ser materia o area').trim().isIn(['materia', 'area']),
  validateFields
], listByType);                 

router.get('/area/:areaCode',[
  check('areaCode', 'El código del área es obligatorio').trim().not().isEmpty(),
  validateFields
], listByArea);             

// Rutas genéricas después
router.get('/', listSubjects);  

router.get('/:id',[
  check('id', 'El ID de la materia es obligatorio').trim().not().isEmpty().isMongoId(),
  validateFields
], getSubject);           

router.post('/',[
  check('school', 'El ID del colegio es obligatorio').isMongoId().not().isEmpty().trim(),
  check('name', 'El nombre de la materia es obligatorio').not().isEmpty(),
  check('code', 'El código de la materia es obligatorio').not().isEmpty(),
  check('independent', 'El campo independiente es obligatorio').isBoolean().not().isEmpty(),
  check('includeInStatistics', 'El campo incluir en estadísticas es obligatorio').isBoolean().not().isEmpty(),
  // En el modelo `Subject` el campo `type` es un string con valores 'materia' o 'area'
  check('type', 'El tipo de la materia es obligatorio').isIn(['materia', 'area']),
  // El modelo usa `areaCode` para identificar el código del área
  check('areaCode', 'El código del área es obligatorio').trim().not().isEmpty(),
  validateFields
], createSubject);             // POST /api/subjects

router.put('/:id',[
  check('id', 'El ID de la materia es obligatorio').trim().not().isEmpty().isMongoId(),
  check('school', 'El ID del colegio es obligatorio').isMongoId().not().isEmpty().trim(),
  check('name', 'El nombre de la materia es obligatorio').not().isEmpty(),
  check('code', 'El código de la materia es obligatorio').not().isEmpty(),
  check('independent', 'El campo independiente es obligatorio').isBoolean().not().isEmpty(),
  check('includeInStatistics', 'El campo incluir en estadísticas es obligatorio').isBoolean().not().isEmpty(),
  check('type', 'El tipo de la materia es obligatorio').isIn(['materia', 'area']),
  // El modelo usa `areaCode` para identificar el código del área
  check('areaCode', 'El código del área es obligatorio').trim().not().isEmpty(),
  validateFields
], updateSubject);                     // PUT /api/subjects/:id

// Activate / deactivate (English routes)
router.put('/:id/activate',[
  check('id', 'El ID de la materia es obligatorio').trim().not().isEmpty().isMongoId(),
  validateFields
], activateSubject);          // PUT /api/subjects/:id/activate

router.put('/:id/deactivate',[
  check('id', 'El ID de la materia es obligatorio').trim().not().isEmpty().isMongoId(),
  validateFields
], deactivateSubject);      // PUT /api/subjects/:id/deactivate

router.delete('/:id',[
  check('id', 'El ID de la materia es obligatorio').trim().not().isEmpty().isMongoId(),
  validateFields
], deleteSubject);                  // DELETE /api/subjects/:id

export default router;
