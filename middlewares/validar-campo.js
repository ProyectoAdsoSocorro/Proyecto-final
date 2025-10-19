import { validationResult } from 'express-validator';

const validarCampos = (req, res, next) => {
    console.log('validar campo campos');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export { validarCampos };