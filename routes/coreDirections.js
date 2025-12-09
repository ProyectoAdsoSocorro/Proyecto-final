import express from 'express';
import * as coreDirectionCtrl from '../controllers/coreDirections.js';
 import { validateJWT } from '../middlewares/jwt.js'; 
import  showValidations  from '../middlewares/showValidations.js';
import authRole from '../middlewares/authRole.js';
import { check } from 'express-validator';
const router = express.Router();
const onlyCore = authRole(["direccionNucleo"])

router.get('/', validateJWT,onlyCore,coreDirectionCtrl.getAll);

router.post('/', validateJWT,onlyCore, [
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
], coreDirectionCtrl.create);

router.post('/login', validateJWT,onlyCore, [
    check('email')
      .isEmail()
      .withMessage('Validación: Correo electrónico debe ser válido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Rango: Contraseña debe tener mínimo 6 caracteres'),
    showValidations
], coreDirectionCtrl.login);

router.put('/:id', validateJWT,onlyCore, [
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
],coreDirectionCtrl.update);

router.put('/:id/change-password', validateJWT,onlyCore, [
    check('id')
      .isMongoId()
      .not().isEmpty()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
],coreDirectionCtrl.changePassword);

router.delete('/:id', validateJWT,onlyCore, [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
], coreDirectionCtrl.remove);

router.put('/:id/activate', validateJWT,onlyCore, [
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
], coreDirectionCtrl.activate);

router.put('/:id/deactivate', validateJWT,onlyCore,[
    check('id')
      .isMongoId()
      .withMessage('Validación: ID debe ser válido'),
      showValidations
], coreDirectionCtrl.deactivate);

export default router;
