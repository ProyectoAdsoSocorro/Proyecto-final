import express from "express";
import { check ,body, param } from "express-validator";
import { validar } from "../middlewares/Jwt.js";
import functionsUsers from "../controllers/users.js";
import seeValidations from "../middlewares/SeeValidations.js";

const router = express.Router();


const validationsLogin = [
    check("numberDocument")
        .notEmpty()
        .withMessage('Campo requerido: Número de documento')
        .isNumeric()
        .withMessage('Validación: Número de documento debe ser numérico')
        .isLength({
            min: 10,
            max: 10
        }).withMessage('Rango: Número de documento debe tener exactamente 10 dígitos')
        .escape(),
    check("password")
        .notEmpty()
        .withMessage('Campo requerido: Contraseña')
        .escape()
];

const validationsRegister = [
    check("names")
        .notEmpty()
        .withMessage('Campo requerido: Nombres')
        .escape(),
    check("lastNames")
        .notEmpty()
        .withMessage('Campo requerido: Apellidos')
        .escape(),
    check("typeDocument")
        .notEmpty()
        .withMessage('Campo requerido: Tipo de documento')
        .escape(),
    check("numberDocument")
        .notEmpty()
        .withMessage('Campo requerido: Número de documento')
        .isNumeric()
        .withMessage('Validación: Número de documento debe ser numérico')
        .isLength({
            min: 10,
            max: 10
        }).withMessage('Rango: Número de documento debe tener exactamente 10 dígitos')
        .escape(),
    check("email")
        .notEmpty()
        .withMessage('Campo requerido: Correo electrónico')
        .isEmail()
        .withMessage('Validación: Correo electrónico debe tener formato válido')
        .escape(),
    check("password")
        .notEmpty()
        .withMessage('Campo requerido: Contraseña')
        .escape(),
    check("cellphone")
        .notEmpty()
        .withMessage('Campo requerido: Número de celular')
        .isNumeric()
        .withMessage('Validación: Número de celular debe ser numérico')
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage('Rango: Número de celular debe tener exactamente 10 dígitos')
        .escape(),
    check("direction")
        .notEmpty()
        .withMessage('Campo requerido: Dirección')
        .escape(),
    check('dateBorn')
        .notEmpty()
        .withMessage('Campo requerido: Fecha de nacimiento')
        .isDate({ format: 'DD/MM/YYYY', strictMode: true })
        .withMessage('Formato: Fecha debe ser DD/MM/YYYY'),
    check("gender")
        .notEmpty()
        .withMessage('Campo requerido: Género')
        .escape(),
    check("roles")
        .notEmpty()
        .withMessage('Campo requerido: Rol')
        .escape(),
    check("stratum")
        .notEmpty()
        .withMessage('Campo requerido: Estrato')
        .escape(),
    check("sisben")
        .notEmpty()
        .withMessage('Campo requerido: Información SISBEN')
        .escape(),
    check("eps")
        .notEmpty()
        .withMessage('Campo requerido: EPS')
        .escape(),
    check("typeBlood")
        .notEmpty()
        .withMessage('Campo requerido: Tipo de sangre')
        .escape(),
    check("victimPopulation")
        .notEmpty()
        .withMessage('Campo requerido: Población víctima')
        .isBoolean()
        .withMessage('Validación: Población víctima debe ser verdadero o falso')
        .escape(),
    check("disability")
        .notEmpty()
        .withMessage('Campo requerido: Información de discapacidad')
        .escape(),
    check("ethnic")
        .notEmpty()
        .withMessage('Campo requerido: Etnia')
        .escape(),
    check("profilePhoto")
        .notEmpty()
        .withMessage('Campo requerido: Foto de perfil')
        .escape(),
    check("signDigital")
        .notEmpty()
        .withMessage('Campo requerido: Firma digital')
        .escape(),
    check("college")
        .notEmpty()
        .withMessage('Campo requerido: Colegio')
        .isMongoId()
        .withMessage('Validación: ID de colegio debe ser válido')
        .escape(),
];

const validationsChangePassword = [
    check("currentPassword")
        .notEmpty()
        .withMessage('Campo requerido: Contraseña actual')
        .escape(),
    check("newPassword")
        .notEmpty()
        .withMessage('Campo requerido: Nueva contraseña')
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
router.get("/role/:role", /* validar, */ param("role").notEmpty().withMessage ('campo requerido: Rol'), seeValidations, functionsUsers.getUsersByRol);

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
router.get("/:id", /* validar */ param("id").notEmpty().withMessage('Campo requerido: ID') .isMongoId(), seeValidations, functionsUsers.getUsersById);

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
