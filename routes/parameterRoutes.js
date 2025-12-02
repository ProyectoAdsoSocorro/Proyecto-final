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
  check('id', 'Invalid ID').isMongoId(),
  checksParameter
], getParameterById);
router.get('/school/:schoolId', [
  check('schoolId', 'Invalid School ID').isMongoId(),
  checksParameter
], getParameterBySchool);
router.post('/', [
  check('school', 'School ID is required').isMongoId(),
  check('shield', 'Shield is required').not().isEmpty(),
  check('certificateHeader', 'Certificate Header is required').not().isEmpty(),
  check('cardFront', 'Card Front is required').not().isEmpty(),
  check('cardBack', 'Card Back is required').not().isEmpty(),
  check('studentPhoto', 'Student Photo must be a boolean').isBoolean(),
  check('linkedToPeriod', 'Linked To Period must be a boolean').isBoolean(),
  check('linkedToGrade', 'Linked To Grade must be a boolean').isBoolean(),
  check('approximateAverage', 'Approximate Average must be a boolean').isBoolean(),
  checksParameter
], createParameter);
router.put('/:id', [
  check('id', 'Invalid ID').isMongoId(),
  check('school', 'School ID is required').isMongoId(),
  check('shield', 'Shield is required').not().isEmpty(),
  check('certificateHeader', 'Certificate Header is required').not().isEmpty(),
  check('cardFront', 'Card Front is required').not().isEmpty(),
  check('cardBack', 'Card Back is required').not().isEmpty(),
  check('studentPhoto', 'Student Photo must be a boolean').isBoolean(),
  check('linkedToPeriod', 'Linked To Period must be a boolean').isBoolean(),
  check('linkedToGrade', 'Linked To Grade must be a boolean').isBoolean(),
  check('approximateAverage', 'Approximate Average must be a boolean').isBoolean(),
  checksParameter
], updateParameter);
router.put('/:id/activate', [
  check('id', 'Invalid ID').isMongoId(),
  checksParameter
], activateParameter);
router.put('/:id/deactivate', [
  check('id', 'Invalid ID').isMongoId(),
  checksParameter
], deactivateParameter);
router.delete('/:id', [
  check('id', 'Invalid ID').isMongoId(),
  checksParameter
], deleteParameter);

export default router;
