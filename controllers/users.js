import modelUser from "../models/users.js"
import bcrypt from "bcrypt";
import { emailService } from "../services/emailService.js";
import { generateJWT } from '../middlewares/jwt.js';

let Email = "";

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
            res.send("usuario registrado")
            //console.log(user)
        } catch (error) {
            res.send("error").status(400)
            console.log(error)
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
                return res.status(400).send("Contraseña incorrecta");
            }
            const validRole = await modelUser.findOne({ numberDocument: numberDocument, roles: { $in: [role] } })
            if (!validRole) {
                return res.status(400).send("Este usuario no tiene ese rol");
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
                return res.status(400).send("no hay nigun email")
            }
            Email=email
            
            const info = {
                from: `"Boletines" <${process.env.EMAIL_USER}>`, // sender address
                to: `${email}`, // list of receivers
                subject: "Hello", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            };
            await emailService.sendEmail(info)
            res.send("success email")
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
    updatePassword: async (req, res) => {
        try {
            let { password } = req.body
            console.log(Email)
            const salt = bcrypt.genSaltSync();
            if (!password) {
                return res.send("no hay niguna contraseña")
            }
            password = bcrypt.hashSync(password, salt)
            const user = await modelUser.findOneAndUpdate({ email: Email }, password)
            const info = {
                from: `"Boletines" <${process.env.EMAIL_USER}>`, // sender address
                to: `${Email}`, // list of receivers
                subject: "Hello", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>tu contraseña ha sido actualizada correctamente</b>", // html body
            };
            await emailService.sendEmail(info)
            res.send("contraseña actualizada")
        }
        catch (e) {
            res.status(500).json({ error: e.message });
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


