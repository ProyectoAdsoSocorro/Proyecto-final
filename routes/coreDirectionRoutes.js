import express from 'express';
import * as coreDirectionCtrl from '../controllers/coreDirectionController.js';
/* import { verifyToken } from '../middlewares/authJwt.js'; */
import  showValidations  from '../middlewares/showValidations.js';
import { check } from 'express-validator';

const router = express.Router();

router.get('/', /* verifyToken */ coreDirectionCtrl.getAll);

router.post('/', [
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
    showValidations
], /* verifyToken, */ coreDirectionCtrl.create);

router.post('/login', [
    check('email')
      .isEmail()
      .withMessage('Validación: Correo electrónico debe ser válido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Rango: Contraseña debe tener mínimo 6 caracteres'),
    showValidations
], coreDirectionCtrl.login);

router.put('/:id', [
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
    showValidations
], /* verifyToken,  */coreDirectionCtrl.update);

router.put('/:id/change-password', [
    check('id')
      .isMongoId()
      .not().isEmpty()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
], /* verifyToken,  */coreDirectionCtrl.changePassword);

router.delete('/:id', [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
], coreDirectionCtrl.remove);

router.put('/:id/activate', [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
], coreDirectionCtrl.activate);

router.put('/:id/deactivate', [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
], coreDirectionCtrl.deactivate);

export default router;
