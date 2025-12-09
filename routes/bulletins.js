import { Router } from "express";
import { check, validationResult } from 'express-validator';
import * as controller from '../controllers/bulletins.js';
import showValidations from "../middlewares/showValidations.js"
// import auth from '../middlewares/auth.js';
// import roleCheck from '../middlewares/roleCheck.js';

const router = Router();
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

//------------estudiante----------------- //

// Boletín corto 

router.get('/boletin-corto/:estudianteId/:periodoId/:año',
  [
    check('estudianteId').isMongoId().withMessage('El ID del estudiante no es válido'),//falta funcion de si esta aprendiz y esta el rol
    check('periodoId').isMongoId().withMessage('El ID del periodo no es válido'),//
   check('año', 'Year is required.').exists().isInt().withMessage('Year must be an integer.').toInt(),//funcion validar año necesita estar 
    //auth,
    // roleCheck(['rector', 'coordinador', 'secretaria']),\r\n
  ],
  handleValidationErrors,
  controller.getStudentShortBulletin 
);


export default router;