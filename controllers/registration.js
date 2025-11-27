import registration from "../models/registration.js";
import ModelUsers from "../models/users.js";
import bcrypt from "bcrypt";

const httpRegistration = {

    /**
     * Obtiene una matrícula activa por año.
     * @param {Object} req - Objeto de solicitud con parámetro 'year'.
     * @param {Object} res - Objeto de respuesta.
     */
    listAllByYear: async (req, res) => {
        const { year } = req.params;

        try {
            const registrationYear = await registration.find({ year: year }).populate('student', 'names lastNames').populate('attendant._id', 'names lastNames').populate('group', 'level grade').populate('school', 'name');

            if (!registrationYear) {
                return res.status(400).json({ msg: "No se encontró matrícula para este año." });
            }

            res.status(200).json({
                data: registrationYear
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno en el servidor", error: error.message });
        }
    },

    /**
     * Obtiene una matrícula por ID.
     * @param {Object} req - Objeto de solicitud con parámetro 'id'.
     * @param {Object} res - Objeto de respuesta.
     */
    listById: async (req, res) => {
        const { id } = req.params;

        try {
            const Registration = await registration.findById(id).populate('student', 'names lastNames' ).populate('attendant._id', 'firstName lastName' ).populate('group', 'level grade' ).populate('school', 'name' ) ;

            if (!Registration) {
                return res.status(404).json({ msg: `No se encontró una matrícula con el ID: ${id}` });
            }

            res.status(200).json({
                data: Registration
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Obtiene una matrícula por ID del grupo.
     * @param {Object} req - Objeto de solicitud con parámetro 'groupId'.
     * @param {Object} res - Objeto de respuesta.
     */
    listRegistrationByGroup: async (req, res) => {
        const { groupId } = req.params;
        console.log(groupId);

        try {
            const registrationGroup = await registration.findOne({ group: groupId });

            if (!registrationGroup) {
                return res.status(404).json({ msg: "No se encontró matrícula asociada a este grupo." });
            }

            res.status(200).json({ data: registrationGroup });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Obtiene una matrícula por ID del estudiante.
     * @param {Object} req - Objeto de solicitud con parámetro 'studentId'.
     * @param {Object} res - Objeto de respuesta.
     */
    listRegistrationByStudent: async (req, res) => {
        const { studentId } = req.params;

        try {
            const registrationStudent = await registration.findOne({ student: studentId });

            if (!registrationStudent) {
                return res.status(404).json({ msg: "No se encontró matrícula asociada a este estudiante." });
            }

            res.status(200).json({ data: registrationStudent });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Crea una nueva matrícula.
     * Valida que el estudiante y los acudientes existan y tengan los roles correctos.
     * Verifica que no exista ya una matrícula activa para el estudiante en el año indicado.
     * @param {Object} req - Objeto de solicitud con datos de la matrícula.
     * @param {Object} res - Objeto de respuesta.
     */
    createRegistration: async (req, res) => {
        const { student, attendant, group, year, registrationDate, registrationNumber, description, school } = req.body;

        try {
            // Validar que el estudiante exista y tenga el rol correspondiente
            const userExists = await ModelUsers.findById(student);

            if (!userExists) {
                return res.status(400).json({ msg: "El estudiante no existe." });
            }

            if (!Array.isArray(userExists.roles) || !userExists.roles.includes('ESTUDIANTE')) {
                return res.status(400).json({ msg: "El usuario no tiene el rol de ESTUDIANTE." });
            }

            // Validar cada acudiente en el array
            for (const att of attendant) {
                const attendantDoc = await ModelUsers.findById(att._id);
                if (!attendantDoc) {
                    return res.status(400).json({ msg: `Acudiente con ID ${att._id} no encontrado.` });
                }

                if (!Array.isArray(attendantDoc.roles) || !attendantDoc.roles.includes('acudiente')) {
                    return res.status(400).json({ msg: `El usuario con ID ${att._id} no tiene el rol de acudiente.` });
                }
            }

            // Verificar si ya existe una matrícula activa para el estudiante en el mismo año
            const existing = await registration.findOne({
                student: student,
                year: year,
                state: { $ne: "RETIRADA" }
            });

            if (existing) {
                return res.status(400).json({
                    msg: "El estudiante ya tiene una matrícula activa en este año."
                });
            }

            const Registration = new registration({
                student,
                attendant,
                group,
                year,
                registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
                registrationNumber,
                description,
                school
            }).populate('student', 'names lastNames').populate('attendant._id', 'firstName lastName').populate('group', 'level grade').populate('school', 'name');

            await Registration.save();

            const populateRegistration = await registration.findById(Registration._id).populate('student', 'names lastNames').populate('attendant._id', 'firstName lastName').populate('group', 'level grade').populate('school', 'name');

            res.status(200).json({
                msg: "Matrícula creada con éxito.",
                data: populateRegistration
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Actualiza una matrícula existente por ID.
     * @param {Object} req - Objeto de solicitud con parámetro 'id' y datos a actualizar.
     * @param {Object} res - Objeto de respuesta.
     */
    updateRegistration: async (req, res) => {
        const { id } = req.params;
        const { student, attendant, group, year, registrationDate, registrationNumber, description, school } = req.body;

        try {
            const updateRegistration = await registration.findByIdAndUpdate(
                id,
                {
                    student: student._id,
                    attendant,
                    group,
                    year,
                    registrationDate,
                    registrationNumber,
                    description,
                    school
                },
                { new: true } // Devuelve el documento actualizado
            ).populate('student', 'names lastNames').populate('attendant._id', 'names lastNames').populate('group', 'level grade').populate('school', 'name');

            if (!updateRegistration) {
                return res.status(404).json({ msg: "No se encontró la matrícula para actualizar." });
            }

            res.status(200).json({
                msg: "La matrícula se actualizó correctamente.",
                data: updateRegistration
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Activa una matrícula cambiando su estado a "ACTIVO".
     * @param {Object} req - Objeto de solicitud con parámetro 'id'.
     * @param {Object} res - Objeto de respuesta.
     */
    activateRegistration: async (req, res) => {
        const { id } = req.params;

        try {
            const Registration = await registration.findByIdAndUpdate(
                id,
                { state: "ACTIVO" },
                { new: true }
            );

            if (!Registration) {
                return res.status(404).json({ msg: "No se encontró la matrícula." });
            }

            res.status(200).json({
                msg: "Se cambió el estado a ACTIVO.",
                data: Registration
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Cambia el estado de una matrícula a "RETIRADO".
     * @param {Object} req - Objeto de solicitud con parámetro 'id'.
     * @param {Object} res - Objeto de respuesta.
     */
    withdrawnRegistration: async (req, res) => {
        const { id } = req.params;

        try {
            const Registration = await registration.findByIdAndUpdate(
                id,
                { state: "RETIRADO" },
                { new: true }
            );

            if (!Registration) {
                return res.status(404).json({ msg: "No se encontró la matrícula." });
            }

            res.status(200).json({
                msg: "Se cambió el estado a RETIRADO.",
                data: Registration
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Cambia el estado de una matrícula a "DESERTADO".
     * @param {Object} req - Objeto de solicitud con parámetro 'id'.
     * @param {Object} res - Objeto de respuesta.
     */
    desertionRegistration: async (req, res) => {
        const { id } = req.params;

        try {
            const Registration = await registration.findByIdAndUpdate(
                id,
                { state: "DESERTADO" },
                { new: true }
            );

            if (!Registration) {
                return res.status(404).json({ msg: "No se encontró la matrícula." });
            }

            res.status(200).json({
                msg: "Se cambió el estado a DESERTADO.",
                data: Registration
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Cambia el estado de una matrícula a "GRADUADO".
     * @param {Object} req - Objeto de solicitud con parámetro 'id'.
     * @param {Object} res - Objeto de respuesta.
     */
    graduatedRegistration: async (req, res) => {
        const { id } = req.params;

        try {
            const Registration = await registration.findByIdAndUpdate(
                id,
                { state: "GRADUADO" },
                { new: true }
            );

            if (!Registration) {
                return res.status(404).json({ msg: "No se encontró la matrícula." });
            }

            res.status(200).json({
                msg: "Se cambió el estado a GRADUADO.",
                data: Registration
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    /**
     * Cambia el estado de la matrícula de un estudiante a "RETIRADO" usando el ID del estudiante.
     * @param {Object} req - Objeto de solicitud con parámetro 'id' (ID del estudiante).
     * @param {Object} res - Objeto de respuesta.
     */
    withdrawStudent: async (req, res) => {
        const { id } = req.params;

        try {
            const student = await registration.findOneAndUpdate(
                { student: id },
                { state: "RETIRADO" },
                { new: true }
            );

            if (!student) {
                return res.status(404).json({
                    msg: "No se encontró una matrícula asociada a este estudiante."
                });
            }

            res.status(200).json({
                msg: "Estudiante retirado correctamente.",
                data: student
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    // === CONTROLADORES PARA ACUDIENTES ===

    /**
     * Obtiene un acudiente por ID.
     * @param {Object} req - Objeto de solicitud con parámetro 'attendantId'.
     * @param {Object} res - Objeto de respuesta.
     */
    listAttendantById: async (req, res) => {
        const { attendantId } = req.params;

        try {
            const attendant = await ModelUsers.findById(attendantId);

            if (!attendant) {
                return res.status(404).json({ msg: "Acudiente no encontrado." });
            }

            res.status(200).json({ data: attendant });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error
            });
        }
    },

    /**
     * Crea un nuevo acudiente.
     * Valida si ya existe un acudiente con el mismo número de documento.
     * Encripta la contraseña antes de guardar.
     * @param {Object} req - Objeto de solicitud con datos del acudiente.
     * @param {Object} res - Objeto de respuesta.
     */
    createdAttendant: async (req, res) => {
        const { schoolId, firstName, lastName, documentOfType, documentOfNumber, email, password, phone, address, dateOfBirth, gender, roles } = req.body;

        try {
            // Validar si ya existe un acudiente activo con el mismo documento
            const existing = await ModelUsers.findOne({
                documentOfNumber: documentOfNumber,
                isActive: true
            });

            if (existing) {
                return res.status(400).json({ msg: `Ya existe un acudiente activo con el documento ${documentOfNumber}.` });
            }

            const attendant = new ModelUsers({
                schoolId,
                firstName,
                lastName,
                documentOfType,
                documentOfNumber,
                email,
                password,
                phone,
                address,
                dateOfBirth,
                gender,
                roles: roles || ['acudiente'] // Asignar rol por defecto si no se envía
            });

            const passwordEncript = bcrypt.hashSync(password, 10);
            attendant.password = passwordEncript;

            await attendant.save();

            res.status(201).json({
                msg: "Acudiente creado exitosamente.",
                data: attendant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error
            });
        }
    },

    /**
     * Actualiza un acudiente existente por ID.
     * Encripta la contraseña si se envía.
     * @param {Object} req - Objeto de solicitud con parámetro 'attendantId' y datos a actualizar.
     * @param {Object} res - Objeto de respuesta.
     */
    updatedAttendant: async (req, res) => {
        const { attendantId } = req.params;
        const { schoolId, firstName, lastName, documentOfType, documentOfNumber, email, password, phone, address, dateOfBirth, gender, roles } = req.body;

        try {
            let passwordUpdate;
            if (password) {
                passwordUpdate = bcrypt.hashSync(password, 10);
            }

            const attendant = await ModelUsers.findByIdAndUpdate(
                attendantId,
                {
                    schoolId,
                    firstName,
                    lastName,
                    documentOfType,
                    documentOfNumber,
                    email,
                    password: passwordUpdate || undefined, // Solo actualizar si hay nueva contraseña
                    phone,
                    address,
                    dateOfBirth,
                    gender,
                    roles
                },
                { new: true }
            );

            if (!attendant) {
                return res.status(404).json({ msg: "No se encontró el acudiente." });
            }

            res.status(200).json({
                msg: "Acudiente actualizado correctamente.",
                data: attendant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error: error.message
            });
        }
    },

    /**
     * Activa un acudiente cambiando su estado a activo.
     * @param {Object} req - Objeto de solicitud con parámetro 'attendantId'.
     * @param {Object} res - Objeto de respuesta.
     */
    activateAttendant: async (req, res) => {
        const { attendantId } = req.params;

        try {
            const attendant = await ModelUsers.findByIdAndUpdate(
                attendantId,
                { isActive: true },
                { new: true }
            );

            if (!attendant) {
                return res.status(404).json({ msg: "No se encontró el acudiente." });
            }

            res.status(200).json({
                msg: "Acudiente activado correctamente.",
                data: attendant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error: error.message
            });
        }
    },

    /**
     * Desactiva un acudiente cambiando su estado a inactivo.
     * @param {Object} req - Objeto de solicitud con parámetro 'attendantId'.
     * @param {Object} res - Objeto de respuesta.
     */
    desactivateAttendant: async (req, res) => {
        const { attendantId } = req.params;

        try {
            const attendant = await ModelUsers.findByIdAndUpdate(
                attendantId,
                { isActive: false },
                { new: true }
            );

            if (!attendant) {
                return res.status(404).json({ msg: "No se encontró el acudiente." });
            }

            res.status(200).json({
                msg: "Acudiente desactivado correctamente.",
                data: attendant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error: error.message
            });
        }
    },

    /**
     * Elimina un acudiente por ID.
     * @param {Object} req - Objeto de solicitud con parámetro 'attendantId'.
     * @param {Object} res - Objeto de respuesta.
     */
    deleteAttendant: async (req, res) => {
        const { attendantId } = req.params;

        try {
            const attendant = await ModelUsers.findByIdAndDelete(attendantId);

            if (!attendant) {
                return res.status(404).json({ msg: "No se encontró el acudiente." });
            }

            res.status(200).json({
                msg: "Acudiente eliminado correctamente."
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error: error.message
            });
        }
    }
};

export default httpRegistration;