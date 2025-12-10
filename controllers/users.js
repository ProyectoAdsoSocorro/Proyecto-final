import modelUser from "../models/users.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { emailService } from "../services/emailService.js";
import { generateJWT } from '../middlewares/jwt.js';
import { response } from "express";
import users from "../models/users.js";



const functionsUsers = {
    register: async (req, res) => {
        try {
            let { names, lastNames, typeDocument, numberDocument, email, password, cellphone, direction, dateBorn, gender, roles, stratum, sisben, eps, typeBlood, victimPopulation, disability, ethnic, profilePhoto, signDigital, college } = req.body
            const salt = bcrypt.genSaltSync();
            password = bcrypt.hashSync(password, salt);
            const user = new modelUser({ names, lastNames, typeDocument, numberDocument, email, password, cellphone, direction, dateBorn, gender, roles, stratum, sisben, eps, typeBlood, victimPopulation, disability, ethnic, profilePhoto, signDigital, college });
            await user.save()
            /*
            generateJWT(user._id)
                .then((x) => {
                    console.log(x)
                    res.send(x)
                })
            */
            return res.send("usuario registrado")
            //console.log(user)
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    // POST /api/users/login
    login: async (req, res) => {
        try {
            const { numberDocument, password, role } = req.body
            const user = await modelUser.findOne({ numberDocument })
            if (!user) {
                return res.status(400).send("Usuario no existe");
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(401).send("Contraseña incorrecta");
            }
            const validRole = await modelUser.findOne({ numberDocument: numberDocument, roles: { $in: [role] } })
            if (!validRole) {
                return res.status(401).send("Este usuario no tiene ese rol");
            }
            generateJWT(user._id, role)
                .then((token) => {
                    return res.json({
                        token,
                        user: {
                            id: user._id,
                            numeroDocumento: user.numberDocument,
                            role: role // incluir los roles
                        }
                    });
                })
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({ error: "Error del servidor" });
        }
    },

    // GET /api/users/rol/:rol - Buscar en array de roles
    getUsersByRol: async (req, res) => {
        try {
            const { rol } = req.params;
            const users = await modelUser.find({ roles: { $in: [rol] } });
            res.json(users);
        }
        catch (e) {
            res.status(500).json({ error: e });
        }
    },

    // GET /api/users/:id
    getUsersById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await modelUser.findById(id);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json(user);
        }
        catch (e) {
            res.status(500).json({ error: e });
        }
    },

    // PUT /api/users/:id/change-password
    changePassword: async (req, res) => {
        try {
            let { id } = req.params
            const { currentPassword, newPassword } = req.body;

            const user = await modelUser.findById(id);
            console.log(user)
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const validPassword = bcrypt.compareSync(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: "Contraseña actual incorrecta" });
            }

            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(newPassword, salt);
            //user.updateAt = new Date();

            await user.save();
            res.json({ message: "Contraseña actualizada correctamente" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
    recoveryPassword: async (req, res) => {
        try {
            let { email } = req.body
            if (!email) {
                return res.status(400).send("no hay nigun email en la peticion")
            }
            let user = await modelUser.findOne({ email: email })
            console.log(user)
            if (!user) {
                return res.status(404).send("El usuario con ese gmail no existe")
            }
            const info = {
                from: `"Boletines" <${process.env.EMAIL_USER}>`,
                to: `${email}`,
                subject: "Hello",
                text: "Hello world?",
                html: "<b>Hello world?</b>",
            };
            await emailService.sendEmail(info)
            return generateJWT(email)
                .then((token) => {
                    return res.json({
                        token,
                        user: {
                            email: email
                        },
                        response: "email enviado correctamente"
                    });
                })
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
    updatePassword: async (req, res) => {
        try {
            let { password } = req.body
            let token = req.header("x-token")
            //console.log(token)
            if (!token) {
                return res.send("no hay token para la validacion");
            }
            if (!password) {
                return res.send("no hay niguna contraseña")
            }
            let email = jwt.verify(token, process.env.JWT_SECRET)
            console.log(email)
            email = email.uid;

            const salt = bcrypt.genSaltSync();
            password = bcrypt.hashSync(password, salt)
            const userUpdate = await modelUser.findOneAndUpdate({ email: email }, { password })
            const user = await modelUser.findOne({ email: email })
            console.log(user)
            console.log(user)
            const info = {
                from: `"Boletines" <${process.env.EMAIL_USER}>`,
                to: `${email}`,
                subject: "Hello",
                text: "Hello world?",
                html: "<b>tu contraseña ha sido actualizada correctamente</b>",
            };
            await emailService.sendEmail(info)
            res.send(`La contraseña actualizada del usuario ${user.names} ${user.lastNames} ha sido actualizada exitosamente`)
        }
        catch (e) {
            return res.status(500).json({ error: e.message });
        }
    },

    // PUT /api/users/:id/activar
    activateUser: async (req, res) => {
        try {
            const { id } = req.params;
            //const updateAt = new Date();
            const user = await modelUser.findByIdAndUpdate(
                id,
                { isActive: true },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json({ message: "Usuario activado", user });
        }
        catch (e) {
            res.status(500).json({ error: e });
        }
    },

    // PUT /api/users/:id/desactivar
    desactivateUser: async (req, res) => {
        try {
            const { id } = req.params;
            //const updateAt = new Date();

            const user = await modelUser.findByIdAndUpdate(
                id,
                { isActive: false, /*updateAt*/ },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json({ message: "Usuario desactivado", user });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
 refreshToken : async (req, res) => {
    try {
        const expiredToken = req.header("x-token");
        if (!expiredToken) return res.status(400).json({ msg: "Token requerido" });

        const decoded = jwt.decode(expiredToken);
        if (!decoded) {
            return res.status(401).json({ msg: "Token inválido" });
        }
        let user;
        if (decoded.role === "direccionNucleo") {
            user = await CoreDirection.findById(decoded.uid);
        } else {
            user = await users.findById(decoded.uid);
        }

        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
        if (!user.isActive) return res.status(403).json({ msg: "Usuario inactivo" });

        const newToken = jwt.sign(
            { uid: decoded.uid, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.json({ token: newToken, msg: "Token renovado" });

    } catch (error) {
        res.status(500).json({ msg: "Error renovando token" });
    }
},
    // PUT /api/users/:id - Actualizar usuario (incluyendo roles)
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { names, lastNames, typeDocument, numberDocument, email, cellphone, direction, dateBorn, gender, roles, stratum, sisben, eps, typeBlood, victimPopulation, disability, ethnic, profilePhoto, signDigital, college } = req.body;
            // Si se envían roles, asegurarse de que sea un array
            /*
            if (updateData.roles && !Array.isArray(updateData.roles)) {
                updateData.roles = [updateData.roles];
            }
            */
            const user = await modelUser.findByIdAndUpdate(
                id, { names, lastNames, typeDocument, numberDocument, email, cellphone, direction, dateBorn, gender, roles, stratum, sisben, eps, typeBlood, victimPopulation, disability, ethnic, profilePhoto, signDigital, college, },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json(user);
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // DELETE /api/usuarios-colegio/:id
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await modelUser.findByIdAndDelete(id);

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json({ message: "Usuario eliminado permanentemente" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Función adicional para agregar roles a un usuario
    addRoleToUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await modelUser.findByIdAndUpdate(
                id,
                { $addToSet: { roles: role }/*, updateAt: new Date()*/ },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json({ message: "Rol agregado", user });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Función adicional para remover roles de un usuario
    removeRoleFromUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await modelUser.findByIdAndUpdate(
                id,
                { $pull: { roles: role }/*, updateAt: new Date()*/ },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json({ message: "Rol removido", user });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default functionsUsers;


