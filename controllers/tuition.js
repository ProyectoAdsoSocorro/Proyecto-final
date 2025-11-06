import Tuition from "../models/tuition.js";
import ModelUsers from "../models/modelAttendant.js"
import bcrypt from "bcrypt" 
const httpTuition = {

    listAllByYear: async (req, res) => {
        const { year } = req.params;

        try {
            const tuitionYear = await Tuition.findOne({ year: year });

            if (!tuitionYear) {
                return res.status(400).json({ msg: "No se encontro este Año: " + year });
            };

            res.status(200).json({ 
                data: tuitionYear 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno en el servidor", error: error.message })
        }
    },

    listById: async (req, res) => {
        const { id } = req.params;

        try {

            const tuition = await Tuition.findById(id)

            if (!tuition) {
                return res.status(404).json({ msg: "No se encontraron matriculas para este id:" + id });
            }

            res.status(200).json({ 
                data: tuition 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message })
        }
    },

    listTuitionByGroup: async (req, res) => {
        const { groupId } = req.params;
        console.log(groupId);
        

        try {
            const tuitionGroup = await Tuition.findOne({ group: groupId });

            if(!tuitionGroup) {
                return res.status(404).json({ msg: "No se encontro este grupo" });
            };

            res.status(200).json({ data: tuitionGroup })

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    listTuitionByStudent: async (req, res) => {
        const { studentId } = req.params;

        try {
            const tuitionStudent = await Tuition.findOne({ student: studentId });

            if(!tuitionStudent) {
                return res.status(404).json({ msg: "No se encontro este estudiante" });
            };

            res.status(200).json({ data: tuitionStudent })

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    createTuition: async (req, res) => {

        const { student, attendant, group, year, tuitionDate, tuitionNumber, description, school }  = req.body

        try {

            // validar que el estudiante exista con su rol correspondiente en el modelo de UserModel
            const userExists = await ModelUsers.findById(student);
            
            if(!userExists) {
                return res.status(400).json({ msg: "El estudiante no existe" });
            }
    

            if (!Array.isArray(userExists.roles) || !userExists.roles.includes('estudiante')) {
                return res.status(400).json({ msg: "El usuario no tiene el rol de estudiante" });
            }

            // Validar cada acudiente en el array
            for (const att of attendant) {
                const attendantDoc = await ModelUsers.findById(att._id);
                if (!attendantDoc) {
                    return res.status(400).json({ msg: `Acudiente con ID ${att._id} no encontrado` });
                }

                if (!Array.isArray(attendantDoc.roles) || !attendantDoc.roles.includes('acudiente')) {
                    return res.status(400).json({ msg: `El usuario con ID ${att._id} no tiene el rol de acudiente` });
                }
            }

            const existing = await Tuition.findOne({
                student: student,
                year: year,
                state: { $ne: "RETIRADA" }
            });

            if(existing){
                return res.status(400).json({ 
                    msg: "El estudiante ya tiene una matrícula activa en este año" 
                });
            };

            const tuition = new Tuition({
                student, 
                attendant,
                group, 
                year, 
                tuitionDate: tuitionDate ? new Date(tuitionDate) : new Date(), 
                tuitionNumber, 
                description, 
                school
            });

            await tuition.save();
            res.status(200).json({ 
                msg: "Matrícula creada con exito", 
                data: tuition 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message })
        }
    },

    updateTuition: async (req, res) => {

        const { id } = req.params;
        const { student, attendant, group, year, tuitionDate, tuitionNumber, description, school }  = req.body;

        try {
            const updateTuition = await Tuition.findByIdAndUpdate(id, {
                student,
                attendant,
                group,
                year,
                tuitionDate,
                tuitionNumber,
                description,
                school
            }, 
            { new: true }
        )

            res.status(200).json({ msg: "La matrícula se actualizo correctamente", data: updateTuition });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    activateTuition: async (req, res) => {
        const { id } = req.params;

        try {
            
            const tuition = await Tuition.findByIdAndUpdate(id, {
                state: "ACTIVO"
            },
            { new: true });

            if(!tuition) {
                return res.status(404).json({ msg: `No se encontro esta matricula` })
            }

            res.status(200).json({ 
                msg: "Se cambio el estado a ACTIVO", 
                data: tuition 
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    withdrawnTuition: async (req, res) => {
        const { id } = req.params;

        try {
            
            const tuition = await Tuition.findByIdAndUpdate(id, {
                state: "RETIRADO"
            },
            { new: true });

            if(!tuition) {
                return res.status(404).json({ msg: "No se encontro esta matricula" })
            }

            res.status(200).json({ msg: 
                "Se cambio el estado a RETIRADO", 
                data: tuition 
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    desertionTuition: async (req, res) => {
        const { id } = req.params;

        try {
            
            const tuition = await Tuition.findByIdAndUpdate(id, {
                state: "DESERTADO"
            },
            { new: true });

            if(!tuition) {
                return res.status(404).json({ msg: "No se encontro esta matricula" })
            }

            res.status(200).json({ 
                msg: "Se cambio el estado a DESERTADO", 
                data: tuition 
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    graduatedTuition: async (req, res) => {
        const { id } = req.params;

        try {
            
            const tuition = await Tuition.findByIdAndUpdate(id, {
                state: "GRADUADO"
            },
            {new: true});

            if(!tuition) {
                return res.status(404).json({ msg: "No se encontro esta matricula" })
            }

            res.status(200).json({ msg: 
                "Se cambio el estado a GRADUADO", 
                data: tuition 
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    withdrawStudent: async (req, res) => {
        const { id } = req.params;
        console.log(id);

        try {
            const student = await Tuition.findOneAndUpdate({ student: id }, {
                state: "RETIRADO"
            }, { new: true })

            if(!student) {
                return res.status(404).json({ 
                    msg: "No se encontro este estudiante" 
                });
            };

            res.status(200).json({ 
                msg: "Estudiante retirado correctamente", 
                data: student 
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", error: error.message });
        }
    },

    // Controladores para acudientes si no hay acudientes en el modelo 

    listAttendantById: async (req, res) => {
        
        const { attendantId } = req.params;
        console.log(attendantId);

        try {
            const attendant = await ModelUsers.findById(attendantId);

            if(!attendant) {
                return res.status(400).json({ msg: "Acudiente no encontrado" })
            }

            res.status(200).json({ data: attendant });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error
            })
        }
    },

    createdAttendant: async (req, res) => {
        const { schoolId,firstName, lastName, documentOfType, documentOfNumber, email, password, phone, address, dateOfBirth, gender, roles } = req.body;

        try {
            const existing = await ModelUsers.findOne({
                documentOfNumber: documentOfNumber,
                isActive: true
            });

            if(existing){
                return res.status(400).json({ msg: `Ya existe un acudiente activo con el documento ${documentOfNumber}` });
            };

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
                roles
            });

            const passwordEncript = bcrypt.hashSync(password, 10);
            attendant.password = passwordEncript;

            console.log(passwordEncript);
            
            await attendant.save()

            res.status(201).json({
                msg: "Acudiente creado exitosamente",
                data: attendant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
                error
            })
        }
    },

    updatedAttendant: async (req, res) => {
        const { attendantId } = req.params;
        const { schoolId, firstName, lastName, documentOfType, documentOfNumber, email, password, phone, address, dateOfBirth, gender, roles } = req.body;
        
        try {
            // Encriptar la contraseña si el acudiente la cambia 
            const passwordUpdate = bcrypt.hashSync(password, 10);
            console.log(passwordUpdate);

            const attendant = await ModelUsers.findByIdAndUpdate( attendantId, {
                schoolId,
                firstName,
                lastName,
                documentOfType,
                documentOfNumber,
                email,
                password: passwordUpdate,
                phone,
                address,
                dateOfBirth,
                gender,
                roles
            }, {new: true} 
            
            );

            if(!attendant) {
                return res.status(404).json({ msg: "No se encontro este acudiente" })
            };

            res.status(200).json({
                msg: "Acudiente actualizado correctamente",
                data: attendant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
            });
        }
    },

    activateAttendant: async (req, res) => {
        const { attendantId } = req.params;

        try {
            const attedant = await ModelUsers.findByIdAndUpdate(attendantId, {
                isActive: true
            }, { new: true} );

            if(!attedant) {
                return res.status(404).json({ msg: "No se encontro este acudiente" });
            };

            res.status(200).json({
                msg: "Acudiente activado correctamente",
                data: attedant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
            });
        }
    },

    desactivateAttendant : async (req, res) => {
        const { attendantId } = req.params;

        try {
            const attendant = await ModelUsers.findByIdAndUpdate(attendantId, {
                isActive: false
            }, { new: true });

            if(!attendant) {
                return res.status(404).json({ msg: "No se encontro este acudiente" });
            }

            res.status(200).json({
                msg: "Acudiente desactivado correctamente",
                data: attendant
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
            });
        }
    },

    deleteAttendant: async (req, res) => {
        const { attendantId } = req.params;
        try {
            const attendant = await ModelUsers.findByIdAndDelete(attendantId);

            if(!attendant) {
                return res.status(404).json({ msg: "No se encontro este acudiente" });
            }
            res.status(200).json({
                msg: "Acudiente eliminado correctamente"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: "Error interno del servidor",
            });
        }
    }
};

export default httpTuition;