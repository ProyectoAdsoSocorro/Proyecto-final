import { Router } from 'express';
import {
  getParameters,
  getParameterById,
  getParameterBySchool,
  createParameter,
  updateParameter,
  deleteParameter,
  activateParameter,
  deactivateParameter
} from '../controllers/parameterController.js';

import { checksParameter } from '../middlewares/checksParameter.js';
import { check } from 'express-validator';

const router = Router();

router.get('/', getParameters);
router.get('/:id', [
  check('id', 'ID no válido').isMongoId(),
  checksParameter
], getParameterById);
router.get('/school/:schoolId', [
  check('schoolId', 'ID de colegio no válido').isMongoId(),
  checksParameter
], getParameterBySchool);
router.post('/', [
  check('school', 'El ID del colegio es obligatorio').isMongoId(),
  check('shield', 'El escudo es obligatorio').not().isEmpty(),
  check('certificateHeader', 'El encabezado del certificado es obligatorio').not().isEmpty(),
  check('cardFront', 'El frente de la tarjeta es obligatorio').not().isEmpty(),
  check('cardBack', 'El reverso de la tarjeta es obligatorio').not().isEmpty(),
  check('studentPhoto', "El campo 'studentPhoto' debe ser booleano").isBoolean(),
  check('linkedToPeriod', "El campo 'linkedToPeriod' debe ser booleano").isBoolean(),
  check('linkedToGrade', "El campo 'linkedToGrade' debe ser booleano").isBoolean(),
  check('approximateAverage', "El campo 'approximateAverage' debe ser booleano").isBoolean(),
  checksParameter
], createParameter);
router.put('/:id', [
  check('id', 'ID no válido').isMongoId(),
  check('school', 'El ID del colegio es obligatorio').isMongoId(),
  check('shield', 'El escudo es obligatorio').not().isEmpty(),
  check('certificateHeader', 'El encabezado del certificado es obligatorio').not().isEmpty(),
  check('cardFront', 'El frente de la tarjeta es obligatorio').not().isEmpty(),
  check('cardBack', 'El reverso de la tarjeta es obligatorio').not().isEmpty(),
  check('studentPhoto', "El campo 'studentPhoto' debe ser booleano").isBoolean(),
  check('linkedToPeriod', "El campo 'linkedToPeriod' debe ser booleano").isBoolean(),
  check('linkedToGrade', "El campo 'linkedToGrade' debe ser booleano").isBoolean(),
  check('approximateAverage', "El campo 'approximateAverage' debe ser booleano").isBoolean(),
  checksParameter
], updateParameter);
router.put('/:id/activate', [
  check('id', 'ID no válido').isMongoId(),
  checksParameter
], activateParameter);
router.put('/:id/deactivate', [
  check('id', 'ID no válido').isMongoId(),
  checksParameter
], deactivateParameter);
router.delete('/:id', [
  check('id', 'ID no válido').isMongoId(),
  checksParameter
], deleteParameter);

export default router;
