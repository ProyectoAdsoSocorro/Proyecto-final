import express from "express";
import { body, param } from "express-validator";
import { validar } from "../middlewares/Jwt.js";
import functionsUsers from "../controllers/Users.js";
import seeValidations from "../middlewares/SeeValidations.js";

const router = express.Router();

const validationsLogin = [
    body("numberDocument").notEmpty().escape().isNumeric().isLength({
        min: 10,
        max: 10
    }).escape(),
    body("password").notEmpty().escape()
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
router.get("/rol/:rol", validar, param("rol").notEmpty(), seeValidations, functionsUsers.getUsersByRol);

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
router.get("/:id", validar, param("id").notEmpty().isMongoId(), seeValidations, functionsUsers.getUsersById);

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
router.post("/:id/change-password", validar, validationsChangePassword, seeValidations, functionsUsers.changePassword);

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
router.post("/:id/activate", validar, param("id").notEmpty(), seeValidations, functionsUsers.activateUser);

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
router.post("/:id/deactivate", validar, param("id").notEmpty(), seeValidations, functionsUsers.desactivateUser);

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
router.delete("/:id", validar, param("id").notEmpty(), seeValidations, functionsUsers.deleteUser);

export default router;
