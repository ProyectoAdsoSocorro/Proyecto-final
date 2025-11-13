import express from "express";
import { check ,body, param } from "express-validator";
import { validar } from "../middlewares/Jwt.js";
import functionsUsers from "../controllers/Users.js";
import seeValidations from "../middlewares/SeeValidations.js";

const router = express.Router();


const validationsLogin = [
    check("numberDocument")
        .notEmpty()
        .withMessage('El número de documento es obligatorio')
        .isNumeric()
        .withMessage('El número de documento debe ser numérico')
        .isLength({
            min: 10,
            max: 10
        }).withMessage('El número de documento debe tener minimo y maximo 10 caracteres')
        .escape(),
    check("password")
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .escape()
];

const validationsRegister = [
    check("names")
        .notEmpty()
        .withMessage('Los nombres son obligatorios')
        .escape(),
    check("lastNames")
        .notEmpty()
        .withMessage('Los apellidos son obligatorios')
        .escape(),
    check("typeDocument")
        .notEmpty()
        .withMessage('El tipo de documento es obligatorio')
        .escape(),
    check("numberDocument")
        .notEmpty()
        .withMessage('El número de documento es obligatorio')
        .isNumeric()
        .withMessage('El número de documento debe ser numérico')
        .isLength({
            min: 10,
            max: 10
        }).withMessage('El número de documento debe tener minimo y maximo 10 caracteres')
        .escape(),
    check("email")
        .notEmpty()
        .withMessage('El correo electrónico es obligatorio')
        .isEmail()
        .withMessage('El correo electrónico debe tener un formato válido')
        .escape(),
    check("password")
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .escape(),
    check("cellphone")
        .notEmpty()
        .withMessage('El número de celular es obligatorio')
        .isNumeric()
        .withMessage('El número de celular debe ser numérico')
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage('El número de celular debe tener exactamente 10 dígitos')
        .escape(),
    check("direction")
        .notEmpty()
        .withMessage('La dirección es obligatoria')
        .escape(),
    check('dateBorn')
        .notEmpty()
        .withMessage('La fecha de nacimiento es obligatoria')
        .isDate({ format: 'DD/MM/YYYY', strictMode: true })
        .withMessage('La fecha debe tener formato DD/MM/YYYY'),
    check("gender")
        .notEmpty()
        .withMessage('El género es obligatorio')
        .escape(),
    check("roles")
        .notEmpty()
        .withMessage('El rol es obligatorio')
        .escape(),
    check("stratum")
        .notEmpty()
        .withMessage('El estrato es obligatorio')
        .escape(),
    check("sisben")
        .notEmpty()
        .withMessage('La información de SISBEN es obligatoria')
        .escape(),
    check("eps")
        .notEmpty()
        .withMessage('La EPS es obligatoria')
        .escape(),
    check("typeBlood")
        .notEmpty()
        .withMessage('El tipo de sangre es obligatorio')
        .escape(),
    check("victimPopulation")
        .notEmpty()
        .withMessage('La información de población víctima es obligatoria')
        .isBoolean()
        .withMessage('La población víctima debe ser un valor booleano')
        .escape(),
    check("disability")
        .notEmpty()
        .withMessage('La información de discapacidad es obligatoria')
        .escape(),
    check("ethnic")
        .notEmpty()
        .withMessage('La etnia es obligatoria')
        .escape(),
    check("profilePhoto")
        .notEmpty()
        .withMessage('La foto de perfil es obligatoria')
        .escape(),
    check("signDigital")
        .notEmpty()
        .withMessage('La firma digital es obligatoria')
        .escape(),
    check("college")
        .notEmpty()
        .withMessage('El colegio es obligatorio')
        .isMongoId()
        .withMessage('El colegio debe ser un ID de MongoDB válido')
        .escape(),
];

const validationsChangePassword = [
    check("currentPassword")
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria')
        .escape(),
    check("newPassword")
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria')
        .escape()
];

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /api/usuarios-colegio/rol/{rol}:
 *   get:
 *     summary: Obtener usuarios por rol
 *     tags: [Usuarios]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: rol
 *         required: true
 *         schema:
 *           type: string
 *         description: Rol del usuario (ej. "acudiente", "profesor", etc.)
 *     responses:
 *       200:
 *         description: Lista de usuarios del rol indicado
 *       400:
 *         description: Parámetro inválido o faltante
 *       401:
 *         description: Token inválido o ausente
 */
router.get("/role/:role", /* validar, */ param("role").notEmpty(), seeValidations, functionsUsers.getUsersByRol);

/**
 * @swagger
 * /api/usuarios-colegio/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario en MongoDB
 *     responses:
 *       200:
 *         description: Datos del usuario encontrados
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", /* validar */ param("id").notEmpty().isMongoId(), seeValidations, functionsUsers.getUsersById);

/**
 * @swagger
 * /api/usuarios-colegio/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - names
 *               - lastNames
 *               - numberDocument
 *               - email
 *               - password
 *             properties:
 *               names:
 *                 type: string
 *               lastNames:
 *                 type: string
 *               typeDocument:
 *                 type: string
 *               numberDocument:
 *                 type: string
 *               direction:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               cellphone:
 *                 type: string
 *               dateBorn:
 *                 type: string
 *               gender:
 *                 type: string
 *               roles:
 *                 type: string
 *               stratum:
 *                 type: string
 *               sisben:
 *                 type: string
 *               eps:
 *                 type: string
 *               typeBlood:
 *                 type: string
 *               victimPopulation:
 *                 type: boolean
 *               disability:
 *                 type: string
 *               ethnic:
 *                 type: string
 *               profilePhoto:
 *                 type: string
 *               signDigital:
 *                 type: string
 *               college:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/register", validationsRegister, seeValidations, functionsUsers.register);

/**
 * @swagger
 * /api/usuarios-colegio:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numberDocument
 *               - password
 *             properties:
 *               numberDocument:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/", validationsLogin, seeValidations, functionsUsers.login);

/**
 * @swagger
 * /api/usuarios-colegio/{id}/change-password:
 *   post:
 *     summary: Cambiar la contraseña de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Error en la validación
 *       401:
 *         description: Token inválido
 */
router.post("/:id/change-password", /* validar, */ validationsChangePassword, seeValidations, functionsUsers.changePassword);

/**
 * @swagger
 * /api/usuarios-colegio/{id}/activar:
 *   post:
 *     summary: Activar usuario
 *     tags: [Usuarios]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario activado correctamente
 */
router.post("/:id/activate", /* validar, */ param("id").notEmpty(), seeValidations, functionsUsers.activateUser);

/**
 * @swagger
 * /api/usuarios-colegio/{id}/desactivar:
 *   post:
 *     summary: Desactivar usuario
 *     tags: [Usuarios]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 */
router.post("/:id/desactivate", /* validar, */ param("id").notEmpty(), seeValidations, functionsUsers.desactivateUser);

/**
 * @swagger
 * /api/usuarios-colegio/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     security:
 *       - XTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", /* validar, */ param("id").notEmpty(), seeValidations, functionsUsers.deleteUser);

export default router;
