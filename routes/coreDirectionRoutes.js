import express from 'express';
import * as coreDirectionCtrl from '../controllers/coreDirectionController.js';
/* import { verifyToken } from '../middlewares/authJwt.js'; */
import { validateFields } from '../middlewares/checksCoreDirection.js';
import { check } from 'express-validator';

const router = express.Router();

router.get('/core-directions', /* verifyToken */ coreDirectionCtrl.getAll);

router.post('/core-directions', [
    check('name')
      .not().isEmpty()
      .withMessage('Campo requerido: Nombre'),
    check('code')
      .not().isEmpty()
      .withMessage('Campo requerido: Código'),
    check('address')
      .not().isEmpty()
      .withMessage('Campo requerido: Dirección'),
    check('phone')
      .not().isEmpty()
      .withMessage('Campo requerido: Número de teléfono'),
    check('email')
      .isEmail()
      .withMessage('Validación: Correo electrónico debe ser válido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Rango: Contraseña debe tener mínimo 6 caracteres'),
    check('responsible')
      .not().isEmpty()
      .withMessage('Campo requerido: Responsable'),
    validateFields
], /* verifyToken, */ coreDirectionCtrl.create);

router.post('/core-directions/login', [
    check('email')
      .isEmail()
      .withMessage('Validación: Correo electrónico debe ser válido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Rango: Contraseña debe tener mínimo 6 caracteres'),
    validateFields
], coreDirectionCtrl.login);

router.put('/core-directions/:id', [
    check('id')
      .isMongoId()
      .not().isEmpty()
      .withMessage('Validación: ID debe ser válido'),
    check('name')
      .not().isEmpty()
      .withMessage('Campo requerido: Nombre'),
    check('code')
      .not().isEmpty()
      .withMessage('Campo requerido: Código'),
    check('address')
      .not().isEmpty()
      .withMessage('Campo requerido: Dirección'),
    check('phone')
      .not().isEmpty()
      .withMessage('Campo requerido: Número de teléfono'),
    check('email')
      .isEmail()
      .withMessage('Validación: Correo electrónico debe ser válido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Rango: Contraseña debe tener mínimo 6 caracteres'),
    check('responsible')
      .not().isEmpty()
      .withMessage('Campo requerido: Responsable'),
    validateFields
], /* verifyToken,  */coreDirectionCtrl.update);

router.put('/core-directions/:id/change-password', [
    check('id')
      .isMongoId()
      .not().isEmpty()
      .withMessage('Validación: ID debe ser válido'),
], /* verifyToken,  */coreDirectionCtrl.changePassword);

router.delete('/core-directions/:id', [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
], coreDirectionCtrl.remove);

router.put('/core-directions/:id/activate', [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
], coreDirectionCtrl.activate);

router.put('/core-directions/:id/deactivate', [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
], coreDirectionCtrl.deactivate);

export default router;
