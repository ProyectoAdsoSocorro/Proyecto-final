import { Router } from "express";
import { check, param, body } from "express-validator";
import groupController from '../controllers/groupscontroller.js';
import groupHelper from '../helpers/helpersGroup.js';
import  validateFields  from '../middlewares/check.js'; 

const router = Router();

// 1. GET /api/grupos/año/:año - Listar todos por año //* se puso year ya que año da error
router.get('/year/:year',
    [
        param('year', 'Year is required and must be a number.').isInt(),
        validateFields
    ],
    groupController.getGroupsByYear
);



// 2. GET /api/grupos/:id - Obtener por ID
router.get('/:id',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validateFields
    ],
    groupController.getGroupById
);

// 3. GET /api/grupos/:id/acudientes - Listar los acudientes por grupo
router.get('/:id/acudientes',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validateFields
    ],
    groupController.getGuardiansByGroup
);

// 4. GET /api/grupos/sedes/:sedeId/grupos - Grupos por sede (añadida)
router.get('/sedes/:sedeId/grupos',
    [
        param('sedeId', 'Invalid ID format.').isMongoId(),
        validateFields
    ],
    groupController.getGroupsByHeadquarters
);

// 5. GET /api/grupos/:id/estudiantes - Estudiantes por grupo
router.get('/:id/estudiantes',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validateFields
    ],
    groupController.getStudentsByGroup
);

// 6. POST /api/grupos - Crear
router.post('/', 
    [
        check('headquarters', 'headquarters is required.').exists().custom(groupHelper.validateHeadquarters),
        check('groupDirector', 'Group Director is required.').exists().custom(groupHelper.validateGroupDirector),
        check('year', 'Year is required.').exists().isInt().withMessage('Year must be an integer.').toInt().custom(groupHelper.validateYear),
        check('cycle', 'Cycle is required.').exists().notEmpty().custom(groupHelper.validateCycle),
        check('level', 'Level is required.').exists().notEmpty().custom(groupHelper.validateLevel),
        check('grade', 'Grade is required.').exists().notEmpty().custom(groupHelper.validateGrade),
        check('groupIdentifier', 'Group Identifier is required.').exists().notEmpty(),
        check('session', 'Session is required.').exists().custom(groupHelper.validateSession),
        validateFields
    ], 
    groupController.createGroup
);

router.post('/sedes/:sedeId/grupos',
    [
        check('sedeId', 'sedeId is required.').exists().custom(groupHelper.validateHeadquarters),
        check('groupDirector', 'Group Director is required.').exists().custom(groupHelper.validateGroupDirector),
        check('year', 'Year is required.').exists().isInt().withMessage('Year must be an integer.').toInt().custom(groupHelper.validateYear),
        check('cycle', 'Cycle is required.').exists().notEmpty().custom(groupHelper.validateCycle),
        check('level', 'Level is required.').exists().notEmpty().custom(groupHelper.validateLevel),
        check('grade', 'Grade is required.').exists().notEmpty().custom(groupHelper.validateGrade),
        check('groupIdentifier', 'Group Identifier is required.').exists().notEmpty(),
        check('session', 'Session is required.').exists().custom(groupHelper.validateSession),
        validateFields
    ], 
    groupController.createGroupInHeadquarters
);

// 8. PUT /api/grupos/:id - Actualizar
router.put('/:id', 
    [
        param('id', 'El ID proporcionado no es un ID de Mongo válido.').isMongoId(),
        body('groupDirector').optional().custom(groupHelper.validateGroupDirector),
        body('cycle').optional().custom(groupHelper.validateCycle),
        body('level').optional().custom(groupHelper.validateLevel),
        body('session').optional().custom(groupHelper.validateSession),
        body('isActive').optional().isBoolean(),
        body('periodData').optional().isArray(),
        validateFields
    ], 
    groupController.updateGroup
);
// 9. PUT /api/grupos/:id/activar - Activar
router.put('/:id/activar',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validateFields
    ],
    groupController.activateGroup
);

// 10. PUT /api/grupos/:id/desactivar - Desactivar
router.put('/:id/desactivar',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validateFields
    ], 
    groupController.deactivateGroup
);

// 11. DELETE /api/grupos/:id - Eliminar
router.delete('/:id',
    [
        param('id', 'Invalid ID format.').isMongoId(),
        validateFields
    ],
    groupController.deleteGroup
);

export default router;