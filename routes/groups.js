import { Router } from "express";
import { check, param, body } from "express-validator";
import authRole from "../middlewares/authRole.js";
import { validateJWT } from "../middlewares/jwt.js";
import groupController from '../controllers/groups.js';
import groupHelper from '../helpers/helpersGroup.js';
import  showValidations  from '../middlewares/showValidations.js'; 

const router = Router();
const onlyList = authRole(["rector", "coordinador", "secretaria"])
const onlySecretary = authRole(["secretaria"])



// 1. GET /api/grupos/año/:año - Listar todos por año //* se puso year ya que año da error
router.get('/year/:year',
    validateJWT,onlyList,
    [
        param('year', 'Year is required and must be a number.').isInt(),
        showValidations
    ],
    groupController.getGroupsByYear
);



// 2. GET /api/grupos/:id - Obtener por ID
router.get('/:id',
    validateJWT,onlyList,
    [
        param('id', 'Invalid ID format.').isMongoId(),
        showValidations
    ],
    groupController.getGroupById
);

// 3. GET /api/grupos/:id/acudientes - Listar los acudientes por grupo
router.get('/:id/acudientes',validateJWT,onlyList,
    [
        param('id', 'Invalid ID format.').isMongoId(),
        showValidations
    ],
    groupController.getGuardiansByGroup
);

// 4. GET /api/grupos/sedes/:sedeId/grupos - Grupos por sede (añadida)
router.get('/sedes/:sedeId/grupos',validateJWT,onlyList,
    [
        param('sedeId', 'Invalid ID format.').isMongoId(),
        showValidations
    ],
    groupController.getGroupsByHeadquarters
);

// 5. GET /api/grupos/:id/estudiantes - Estudiantes por grupo
router.get('/:id/estudiantes',validateJWT,onlyList,
    [
        param('id', 'Invalid ID format.').isMongoId(),
        showValidations
    ],
    groupController.getStudentsByGroup
);

// 6. POST /api/grupos - Crear
router.post('/',validateJWT,onlySecretary,
    [
        check('headquarters', 'headquarters is required.').exists().custom(groupHelper.validateHeadquarters),
        check('groupDirector', 'Group Director is required.').exists().custom(groupHelper.validateGroupDirector),
        check('year', 'Year is required.').exists().isInt().withMessage('Year must be an integer.').toInt().custom(groupHelper.validateYear),
        check('cycle', 'Cycle is required.').exists().notEmpty().custom(groupHelper.validateCycle),
        check('level', 'Level is required.').exists().notEmpty().custom(groupHelper.validateLevel),
        check('grade', 'Grade is required.').exists().notEmpty().custom(groupHelper.validateGrade),
        check('groupIdentifier', 'Group Identifier is required.').exists().notEmpty(),
        check('session', 'Session is required.').exists().custom(groupHelper.validateSession),
        showValidations
    ], 
    groupController.createGroup
);

// 8. PUT /api/grupos/:id - Actualizar
router.put('/:id', validateJWT,onlySecretary,
    [
        param('id', 'El ID proporcionado no es un ID de Mongo válido.').isMongoId(),
        body('groupDirector').optional().custom(groupHelper.validateGroupDirector),
        body('cycle').optional().custom(groupHelper.validateCycle),
        body('level').optional().custom(groupHelper.validateLevel),
        body('session').optional().custom(groupHelper.validateSession),
        body('isActive').optional().isBoolean(),
        body('periodData').optional().isArray(),
        showValidations
    ], 
    groupController.updateGroup
);
// 9. PUT /api/grupos/:id/activar - Activar
router.put('/:id/activar',validateJWT,onlySecretary,
    [
        param('id', 'Invalid ID format.').isMongoId(),
        showValidations
    ],
    groupController.activateGroup
);

// 10. PUT /api/grupos/:id/desactivar - Desactivar
router.put('/:id/desactivar',validateJWT,onlySecretary,
    [
        param('id', 'Invalid ID format.').isMongoId(),
        showValidations
    ], 
    groupController.deactivateGroup
);

// 11. DELETE /api/grupos/:id - Eliminar
router.delete('/:id',validateJWT,onlySecretary,
    [
        param('id', 'Invalid ID format.').isMongoId(),
        showValidations
    ],
    groupController.deleteGroup
);

export default router;