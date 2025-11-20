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
import  validateFields  from '../middlewares/check.js';


const router = Router();

router.get('/', listSubjects);                          // GET /api/subjects

router.get('/:id',[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().isEmpty(),
  validateFields
], getSubject);                        // GET /api/subjects/:id

router.get('/type/:type',[
  check('type', 'Validación: ID de tipo debe ser válido').not().isEmpty(),
  validateFields
], listByType);                 // GET /api/subjects/type/:type

router.get('/area/:areaCode',[
  check('areaCode', 'Validación: ID de tipo debe ser válido').not().isEmpty(),
  validateFields
], listByArea);             // GET /api/subjects/area/:areaCode

router.post('/',[
  check('school', 'Validación: ID de colegio debe ser válido').isMongoId().not().isEmpty().trim(),
  check('name', 'Campo requerido: Nombre de materia').not().isEmpty(),
  check('code', 'Campo requerido: Código de materia').not().isEmpty(),
  check('independent', 'Validación: Campo independiente debe ser verdadero o falso').isBoolean().not().isEmpty(),
  check('includeInStatistics', 'Validación: Campo incluir en estadísticas debe ser verdadero o falso').isBoolean().not().isEmpty(),
  check('type', 'Validación: ID de tipo debe ser válido').isMongoId().not().isEmpty(),
  check('area', 'Campo requerido: Área de materia').not().isEmpty(),
  validateFields
], createSubject);             // POST /api/subjects

router.put('/:id',[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  check('school', 'Validación: ID de colegio debe ser válido').isMongoId().not().isEmpty().trim(),
  check('name', 'Campo requerido: Nombre de materia').not().isEmpty(),
  check('code', 'Campo requerido: Código de materia').not().isEmpty(),
  check('independent', 'Validación: Campo independiente debe ser verdadero o falso').isBoolean().not().isEmpty(),
  check('includeInStatistics', 'Validación: Campo incluir en estadísticas debe ser verdadero o falso').isBoolean().not().isEmpty(),
  check('type', 'Validación: ID de tipo debe ser válido').isMongoId().not().isEmpty(),
  check('area', 'Campo requerido: Área de materia').not().isEmpty(),
  validateFields
], updateSubject);                     // PUT /api/subjects/:id

router.put('/:id/activate',[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  validateFields
], activateSubject);          // PUT /api/subjects/:id/activate

router.put('/:id/desactivate',[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  validateFields
], deactivateSubject);      // PUT /api/subjects/:id/desactivate

router.delete('/:id',[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  validateFields
], deleteSubject);                  // DELETE /api/subjects/:id

export default router;
