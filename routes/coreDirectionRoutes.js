import express from 'express';
import * as coreDirectionCtrl from '../controllers/coreDirectionController.js';
import { verifyToken } from '../middlewares/authJwt.js';
import { validateFields } from '../middlewares/checksCoreDirection.js';
import { check } from 'express-validator';

const router = express.Router();

router.get('/core-directions', verifyToken, coreDirectionCtrl.getAll);

router.post('/core-directions', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('code', 'El código es obligatorio').not().isEmpty(),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('phone', 'El teléfono es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('responsible', 'El responsable es obligatorio').not().isEmpty(),
    validateFields
], verifyToken, coreDirectionCtrl.create);

router.post('/core-directions/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validateFields
], coreDirectionCtrl.login);

router.put('/core-directions/:id', [
    check('id', 'No es un ID válido').isMongoId().not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('code', 'El código es obligatorio').not().isEmpty(),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('phone', 'El teléfono es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('responsible', 'El responsable es obligatorio').not().isEmpty(),
    validateFields
], verifyToken, coreDirectionCtrl.update);

router.put('/core-directions/:id/change-password', [
    check('id', 'No es un ID válido').isMongoId().not().isEmpty(),
], verifyToken, coreDirectionCtrl.changePassword);

router.delete('/core-directions/:id', verifyToken, coreDirectionCtrl.remove);
router.put('/core-directions/:id/activate', verifyToken, coreDirectionCtrl.activate);
router.put('/core-directions/:id/deactivate', verifyToken, coreDirectionCtrl.deactivate);

export default router;
