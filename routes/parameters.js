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
} from '../controllers/parameters.js';
import authRole from '../middlewares/authRole.js';
import { validateJWT } from '../middlewares/jwt.js';
import showValidations from '../middlewares/showValidations.js';
import { check } from 'express-validator';

const router = Router();
const allActions = authRole(["rector", "coordinador", "secretaria"]);

router.get('/',validateJWT,allActions, getParameters);
router.get('/:id', validateJWT,allActions, [
  check('id', 'Invalid ID').isMongoId(),
  showValidations
], getParameterById);
router.get('/school/:schoolId',validateJWT,allActions, [
  check('schoolId', 'Invalid School ID').isMongoId(),
  showValidations
], getParameterBySchool);
router.post('/',validateJWT,allActions, [
  check('school', 'School ID is required').isMongoId(),
  check('shield', 'Shield is required').not().isEmpty(),
  check('certificateHeader', 'Certificate Header is required').not().isEmpty(),
  check('cardFront', 'Card Front is required').not().isEmpty(),
  check('cardBack', 'Card Back is required').not().isEmpty(),
  check('studentPhoto', 'Student Photo must be a boolean').isBoolean(),
  check('linkedToPeriod', 'Linked To Period must be a boolean').isBoolean(),
  check('linkedToGrade', 'Linked To Grade must be a boolean').isBoolean(),
  check('approximateAverage', 'Approximate Average must be a boolean').isBoolean(),
  showValidations
], createParameter);
router.put('/:id',validateJWT,allActions, [
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
  showValidations
], updateParameter);
router.put('/:id/activate', validateJWT,allActions, [
  check('id', 'Invalid ID').isMongoId(),
  showValidations
], activateParameter);
router.put('/:id/deactivate', validateJWT,allActions, [
  check('id', 'Invalid ID').isMongoId(),
  showValidations
], deactivateParameter);
router.delete('/:id', validateJWT,allActions,[
  check('id', 'Invalid ID').isMongoId(),
  showValidations
], deleteParameter);

export default router;
