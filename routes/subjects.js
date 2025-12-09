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
} from '../controllers/subjects.js';
import authRole from "../middlewares/authRole.js"
import { check } from 'express-validator';
import { validateJWT } from '../middlewares/jwt.js';
import  showValidations  from '../middlewares/showValidations.js';

const router = Router();
const onlyList = authRole(["rector", "coordinador", "secretaria"]);
const onlySecretary = authRole(["secretaria"]);


router.get('/',validateJWT,onlyList, listSubjects);                          // GET /api/subjects

router.get('/:id',validateJWT,onlyList,[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().isEmpty(),
  showValidations
], getSubject);                        // GET /api/subjects/:id

router.get('/type/:type',validateJWT,onlyList,[
  check('type', 'Validación: ID de tipo debe ser válido').not().isEmpty(),
  showValidations
], listByType);                 // GET /api/subjects/type/:type

router.get('/area/:areaCode',validateJWT,onlyList,[
  check('areaCode', 'Validación: ID de tipo debe ser válido').not().isEmpty(),
  showValidations
], listByArea);             // GET /api/subjects/area/:areaCode

router.post('/',validateJWT,onlySecretary,[
  check('group', 'Validación: ID del grupo debe ser válido').isMongoId().not().isEmpty().trim(),
  check('name', 'Campo requerido: Nombre de materia').not().isEmpty(),
  check('code', 'Campo requerido: Código de materia').not().isEmpty(),
  check('type', 'Campo requerido:  Tipo (materia/area)').not().isEmpty(),
  check('areaCode', 'Campo requerido: Área de materia').not().isEmpty(),
  showValidations
], createSubject);             // POST /api/subjects

router.put('/:id',validateJWT,onlySecretary,[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  check('group', 'Validación: ID del grupo debe ser válido').isMongoId().not().isEmpty().trim(),
  check('name', 'Campo requerido: Nombre de materia').not().isEmpty(),
  check('code', 'Campo requerido: Código de materia').not().isEmpty(),
  check('type', 'Campo requerido:  Tipo (materia/area)').not().isEmpty(),
  check('areaCode', 'Campo requerido: Área de materia').not().isEmpty(),
  showValidations
], updateSubject);                     // PUT /api/subjects/:id

router.put('/:id/activate',validateJWT,onlySecretary,[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  showValidations
], activateSubject);          // PUT /api/subjects/:id/activate

router.put('/:id/desactivate',validateJWT,onlySecretary,[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  showValidations
], deactivateSubject);      // PUT /api/subjects/:id/desactivate

router.delete('/:id',validateJWT,onlySecretary,[
  check('id', 'Validación: ID de materia debe ser válido').isMongoId().not().isEmpty(),
  showValidations
], deleteSubject);                  // DELETE /api/subjects/:id

export default router;
