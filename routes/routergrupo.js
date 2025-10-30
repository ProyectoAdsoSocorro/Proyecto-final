import { Router } from "express";
import { check, param, body } from "express-validator";
import groupController from '../controllers/controllersgrupo.js';
import groupHelper from '../helpers/helpergrupo.js';
import { validarCampos } from '../middlewares/validar-campo.js'; 

const router = Router();

// 1. POST /api/groups - Create a new group
router.post('/',
    [
        check('schoolBranch', 'School Branch is required.').exists().custom(groupHelper.validateSchoolBranch),
        check('groupDirector', 'Group Director is required.').exists().custom(groupHelper.validateGroupDirector),
        check('year', 'Year is required.').exists().isInt().withMessage('Year must be an integer.').custom(groupHelper.validateYear),
        check('cycle', 'Cycle is required.').exists().custom(groupHelper.validateCycle),
        check('level', 'Level is required.').exists().custom(groupHelper.validateLevel),
        check('grade', 'Grade is required.').exists().custom(groupHelper.validateGrade),
        check('groupIdentifier', 'Group Identifier is required.').exists().notEmpty(),
        check('session', 'Session is required.').exists().custom(groupHelper.validateSession),
        validarCampos
    ], 
    groupController.createGroup
);

// 2. GET /api/groups/year/:year - Get groups by year
router.get('/year/:year',
    [
        param('year', 'Year is required and must be a number.').isInt(),
        validarCampos
    ],
    groupController.getGroupsByYear
);

// 3. GET /api/groups/:id/students - Get students by group
router.get('/:id/students',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validarCampos
    ],
    groupController.getStudentsByGroup
);

// 4. GET /api/groups/:id/guardians - Get guardians by group
router.get('/:id/guardians',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validarCampos
    ],
    groupController.getGuardiansByGroup
);

// 5. GET /api/groups/:id - Get group by ID (should be after more specific routes)
router.get('/:id',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validarCampos
    ],
    groupController.getGroupById
);

// 6. PUT /api/groups/:id - Update a group
router.put('/:id',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        body('schoolBranch').optional().custom(groupHelper.validateSchoolBranch),
        body('groupDirector').optional().custom(groupHelper.validateGroupDirector),
        body('year').optional().isInt().withMessage('Year must be an integer.').custom(groupHelper.validateYear),
        body('cycle').optional().custom(groupHelper.validateCycle),
        body('level').optional().custom(groupHelper.validateLevel),
        body('grade').optional().custom(groupHelper.validateGrade),
        body('groupIdentifier').optional().notEmpty(),
        body('session').optional().custom(groupHelper.validateSession),
        validarCampos
    ],
    groupController.updateGroup
);

// 7. PUT /api/groups/:id/activate - Activate a group (Cambiado de PATCH a PUT)
router.put('/:id/activate',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validarCampos
    ],
    groupController.activateGroup
);

// 8. PUT /api/groups/:id/deactivate - Deactivate a group (Cambiado de PATCH a PUT)
router.put('/:id/deactivate',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validarCampos
    ], 
    groupController.deactivateGroup
);

// 9. DELETE /api/groups/:id - Delete a group
router.delete('/:id',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validarCampos
    ],
    groupController.deleteGroup
);

export default router;