import Colegio from "../models/schools.js";
import ModelUser from "../models/users.js";
import { sendEmail } from "../utils/sendEmail.js";


import axios from 'axios';

const httpSchools = {
    getSchools: async (req, res) => {
        try {
            const schools = await Colegio.find()
            res.json(schools);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los colegios" });
        }
    },

    getSchoolById: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id);
            const school = await Colegio.findById(id)
            if (!school) {
                return res.status(404).json({ message: "Colegio no encontrado" });
            }
            res.json({ school });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el colegio" });
        }
    },

    createSchool: async (req, res) => {
        try {
            const { core_address } = req.body;

            if (!core_address) {
                return res.status(400).json({ message: "El core_address es requerido" });
            }
            const {
                nameSchool,
                addressSchool,
                phoneSchool,
                emailSchool,
                names,
                lastNames,
                typeDocument,
                numberDocument,
                email,
                cellphone,
                direction,
                dateBorn,
                gender,
            } = req.body;

            if (!nameSchool || !addressSchool || !phoneSchool || !emailSchool || !names || !lastNames || !typeDocument || !numberDocument || !email || !cellphone || !direction || !dateBorn || !gender) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }
            function obtenerCodigo(campo) {

                if (!campo || typeof campo !== 'string') return '';
                return campo
                    .trim()
                    .split(/\s+/)// multiples espacios
                    .map(palabra => palabra.charAt(0).toUpperCase())
                    .join('')
            }

            let baseCode = obtenerCodigo(nameSchool);
            let finalCode = baseCode;
            let counter = 3;
            let isCodeTaken = await Colegio.findOne({ code: finalCode });

            while (isCodeTaken) {
                finalCode = `${baseCode}${counter}`;
                counter++;
                isCodeTaken = await Colegio.findOne({ code: finalCode });
            }



            const school = new Colegio({ ...req.body, code: finalCode });
            await school.save();


            // Creacion del admin de cada colegio
            const newUser = new ModelUser({
                schoolId: school._id,
                names,
                lastNames,
                documentOfType: typeDocument,
                documentOfNumber: numberDocument,
                email: email,
                password: null,
                phone: cellphone,
                address: direction,

                gender: gender,
                roles: ['secretaria'],
                isActive: true,
                needsPasswordChange: true
            })

            await newUser.save();

            // Enviar correo para configurar contraseña
            const resetLink = `${process.env.FRONTEND_URL}/set-password?email=${encodeURIComponent(email)}`;

            const subject = `✅ Cuenta de Administrador Creada para ${nameSchool}`;
            const html = `
            <h2>¡Bienvenido al Sistema de Gestión de Colegios!</h2>
            <p>Se ha creado una cuenta de administrador (rol Secretaria) para el colegio <strong>${nameSchool}</strong>.</p>
            <p>El correo para iniciar sesión es: <strong>${email}</strong>.</p>
            <p>Por favor, comparte el siguiente enlace con la persona encargada para que pueda configurar su contraseña de acceso:</p>
            <a href="${resetLink}" style="display:inline-block; padding:12px 24px; background:#027be3; color:white; text-decoration:none; border-radius:6px;">
                Configurar Contraseña
            </a>
            <p><small>Este enlace expira en 24 horas.</small></p>
            <p>Saludos cordiales,<br><strong>El equipo de Dirección de Núcleo</strong></p>
            `;

            await sendEmail(emailSchool, subject, html); // Se envía al correo del colegio

            // Notificar creación (endpoint opcional) - Ahora con axios
            try {
                await axios.post(`${process.env.API_URL || 'http://localhost:3000'}/api/schools/notify-admin-created`, {
                    schoolName: nameSchool,
                    adminEmail: email
                });

            } catch (axiosError) {

                console.log('Error en la notificación con axios:', axiosError.message);

            }

            res.status(201).json({
                message: "Colegio y secretaria creados correctamente.",
                school: {
                    id: school._id,
                    name: school.nameSchool,
                    address: school.addressSchool,
                    code: school.code
                },
                secretary: {
                    id: newUser._id,
                    email: newUser.email,
                    full_name: `${newUser.names} ${newUser.lastNames}`
                }
            });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "Ya existe un colegio o usuario con el código, email o documento proporcionado.", error: error.message });
            }
            res.status(500).json({ message: "Error al crear el colegio", error: error.message });
        }
    },

    notifyAdminCreated: async (req, res) => {
        const { schoolName, adminEmail } = req.body;
        console.log(`🔔 Admin creado: ${adminEmail} para ${schoolName}`);
        res.json({ message: "Notificación recibida" });
    },

    updateSchool: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                nameSchool,
                addressSchool,
                phoneSchool,
                emailSchool,
            } = req.body;

            if (!nameSchool || !addressSchool || !phoneSchool || !emailSchool) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }
            const { core_address } = req.body;

            if (!core_address) {
                return res.status(400).json({ message: "El core_address es requerido" });
            }

            const school = await Colegio.findByIdAndUpdate(id, req.body, { new: true })
            if (!school) {
                return res.status(404).json({ message: "Colegio no encontrado" });
            }
            res.json({ message: "Colegio actualizado correctamente", school });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el Colegio", error: error.message })
        }
    },

    activateSchool: async (req, res) => {
        try {
            const { id } = req.params;
            const school = await Colegio.findByIdAndUpdate(
                id,
                { isActive: true },
                { new: true }
            )
            if (!school) {
                return res.status(404).json({ message: "Colegio no Encontrado" })
            }
            res.json({ message: "Colegio Activado Correctamente", school })
        } catch (error) {
            res.status(500).json({ message: "Error al Activar el Colegio" })
        }
    },

    deactivateSchool: async (req, res) => {
        try {
            const { id } = req.params;
            const school = await Colegio.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );
            if (!school) {
                return res.status(404).json({ message: "Colegio no encontrado" });
            }
            res.json({ message: "Colegio desactivado correctamente", school });
        } catch (error) {
            res.status(500).json({ message: "Error al desactivar el colegio" });
        }
    },

    deleteSchool: async (req, res) => {
        try {
            const { id } = req.params;
            const school = await Colegio.findByIdAndDelete(id);
            res.json({ message: "Colegio borrado correctamente", school });
        } catch (error) {
            res.status(500).json({ message: "Error al borrar el colegio" });
        }
    }
}

export default httpSchools;