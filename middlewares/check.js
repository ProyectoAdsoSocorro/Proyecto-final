import { validationResult } from "express-validator";

const validateFields = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json(errores);
    }
    next();
};

export default validateFields;
