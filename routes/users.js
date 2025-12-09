import express from "express";
import { body, check, param } from "express-validator";
import { validateJWT } from "../middlewares/jwt.js";
import functionsUsers from "../controllers/users.js";
import showValidations from "../middlewares/showValidations.js";
import authRole from "../middlewares/authRole.js";
const router = express.Router();

const validationsLogin = [
    body("numberDocument").notEmpty().escape().isNumeric().isLength({
        min: 10,
        max: 10
    }).escape(),
    body("password").notEmpty().escape(),
    body("role").notEmpty().escape()
];
const validationsRegister = [
    body("names").notEmpty().escape(),
    body("lastNames").notEmpty().escape(),
    body("typeDocument").notEmpty().escape(),
    body("numberDocument").notEmpty().isNumeric().escape().isLength({
        min: 10
    }),
    body("email").notEmpty().isEmail().escape(),
    body("password").notEmpty().escape(),
    body("cellphone").notEmpty().isNumeric().escape().isLength({
        min: 10,
        max: 10
    }),
    body("direction").notEmpty().escape(),
    body('dateBorn').notEmpty().isDate({ format: 'DD/MM/YYYY', strictMode: true })
        .withMessage('La fecha debe tener formato DD/MM/YYYY'),
    body("gender").notEmpty().escape(),
    body("roles").notEmpty().escape(),
    body("stratum").notEmpty().escape(),
    body("sisben").notEmpty().escape(),
    body("eps").notEmpty().escape(),
    body("typeBlood").notEmpty().escape(),
    body("victimPopulation").notEmpty().isBoolean().escape(),
    body("disability").notEmpty().escape(),
    body("ethnic").notEmpty().escape(),
    body("profilePhoto").notEmpty().escape(),
    body("signDigital").notEmpty().escape(),
    body("college").notEmpty().isMongoId().escape(),
];
const validationsChangePassword = [
    body("currentPassword").notEmpty().escape(),
    body("newPassword").notEmpty().escape()
];
const validationsUpdate = [
    body("names").notEmpty().escape(),
    body("lastNames").notEmpty().escape(),
    body("typeDocument").notEmpty().escape(),
    body("numberDocument").notEmpty().isNumeric().escape().isLength({
        min: 10
    }),
    body("email").notEmpty().isEmail().escape(),
    body("cellphone").notEmpty().isNumeric().escape().isLength({
        min: 10,
        max: 10
    }),
    body("direction").notEmpty().escape(),
    body('dateBorn').notEmpty().isDate({ format: 'DD/MM/YYYY', strictMode: true })
        .withMessage('La fecha debe tener formato DD/MM/YYYY'),
    body("gender").notEmpty().escape(),
    body("roles").notEmpty().escape(),
    body("stratum").notEmpty().escape(),
    body("sisben").notEmpty().escape(),
    body("eps").notEmpty().escape(),
    body("typeBlood").notEmpty().escape(),
    body("victimPopulation").notEmpty().isBoolean().escape(),
    body("disability").notEmpty().escape(),
    body("ethnic").notEmpty().escape(),
    body("profilePhoto").notEmpty().escape(),
    body("signDigital").notEmpty().escape(),
    body("college").notEmpty().isMongoId().escape(),
];

const onlySecretary = authRole(['secretaria']);
const onlyList = authRole(['rector', 'coordinador', 'secretaria']); 


router.post("/", validationsLogin, showValidations, functionsUsers.login);

router.post("/register", validationsRegister, showValidations, functionsUsers.register);

router.get("/recovery", body("email").notEmpty(), showValidations, functionsUsers.recoveryPassword);

router.get("/:id",
    validateJWT,
    onlyList,
    param("id").notEmpty().isMongoId(),
    showValidations,
    functionsUsers.getUsersById
);

router.get("/rol/:rol",
    validateJWT,
    onlyList,
    param("rol").notEmpty(),
    showValidations,
    functionsUsers.getUsersByRol
);

router.post("/:id/change-password",
    validateJWT,
    onlySecretary,
    validationsChangePassword,
    showValidations,
    functionsUsers.changePassword
);

router.post("/refreshToken",functionsUsers.refreshToken);

router.put("/:id/activate",
    validateJWT,
    onlySecretary,
    param("id").notEmpty(),
    showValidations,
    functionsUsers.activateUser
);

router.put("/:id/desactivate",
    validateJWT,
    onlySecretary,
    param("id").notEmpty(),
    showValidations,
    functionsUsers.desactivateUser
);

router.put("/passwordRecovered",
    check("password").notEmpty(),
    showValidations,
    functionsUsers.updatePassword
);

router.put("/:id/",
    validateJWT,
    onlySecretary,
    validationsUpdate,
    param("id").notEmpty(),
    showValidations,
    functionsUsers.updateUser
);

router.delete("/:id",
    validateJWT,
    onlySecretary,
    param("id").notEmpty(),
    showValidations,
    functionsUsers.deleteUser
);

export default router;