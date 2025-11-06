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

router.get('/', listSubjects);                          // GET /api/subjects

router.get('/:id',[
  check('id', 'El ID de la materia es obligatorio').isMongoId().isEmpty(),
  validateFields
], getSubject);                        // GET /api/subjects/:id

router.get('/tipo/:tipoId',[
  check('tipoId', 'El ID del tipo es obligatorio').isMongoId().isEmpty(),
  validateFields
], listByType);                 // GET /api/subjects/tipo/:tipoId

router.get('/area/:areaCode',[
  check('areaCode', 'El código del área es obligatorio').not().isEmpty(),
  validateFields
], listByArea);             // GET /api/subjects/area/:areaCode

router.post('/',[
  check('school', 'El ID del colegio es obligatorio').isMongoId().not().isEmpty().trim(),
  check('name', 'El nombre de la materia es obligatorio').not().isEmpty(),
  check('code', 'El código de la materia es obligatorio').not().isEmpty(),
  check('independent', 'El campo independiente es obligatorio').isBoolean().not().isEmpty(),
  check('includeInStatistics', 'El campo incluir en estadísticas es obligatorio').isBoolean().not().isEmpty(),
  check('type', 'El tipo de la materia es obligatorio').isMongoId().not().isEmpty(),
  check('area', 'El área de la materia es obligatoria').not().isEmpty(),
  validateFields
], createSubject);             // POST /api/subjects

router.put('/:id',[
  check('id', 'El ID de la materia es obligatorio').isMongoId().not().isEmpty(),
  check('school', 'El ID del colegio es obligatorio').isMongoId().not().isEmpty().trim(),
  check('name', 'El nombre de la materia es obligatorio').not().isEmpty(),
  check('code', 'El código de la materia es obligatorio').not().isEmpty(),
  check('independent', 'El campo independiente es obligatorio').isBoolean().not().isEmpty(),
  check('includeInStatistics', 'El campo incluir en estadísticas es obligatorio').isBoolean().not().isEmpty(),
  check('type', 'El tipo de la materia es obligatorio').isMongoId().not().isEmpty(),
  check('area', 'El área de la materia es obligatoria').not().isEmpty(),
  validateFields
], updateSubject);                     // PUT /api/subjects/:id

router.put('/:id/activar',[
  check('id', 'El ID de la materia es obligatorio').isMongoId().not().isEmpty(),
  validateFields
], activateSubject);          // PUT /api/subjects/:id/activar

router.put('/:id/deactivar',[
  check('id', 'El ID de la materia es obligatorio').isMongoId().not().isEmpty(),
  validateFields
], deactivateSubject);      // PUT /api/subjects/:id/deactivar

router.delete('/:id',[
  check('id', 'El ID de la materia es obligatorio').isMongoId().not().isEmpty(),
  validateFields
], deleteSubject);                  // DELETE /api/subjects/:id

export default router;
