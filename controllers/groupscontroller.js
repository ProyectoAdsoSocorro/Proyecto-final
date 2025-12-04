import Group from '../models/groups.js';
import groupHelper from '../helpers/helpersGroup.js';
import ModelUser from "../models/users.js"; // modelo usuario

// 1. GET /api/grupos/año/:año - Listar todos por año
const getGroupsByYear = async (req, res) => {
    try {
        const { year } = req.params;

        const groups = await Group.find({ year: parseInt(year) })

        res.status(200).json({
            success: true,
            data: groups
        });
    } catch (error) {
        console.error('Error retrieving groups:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los grupos.',
            error: error.message,
        });
    }
};

// 2. GET /api/grupos/:id - Obtener por ID
const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;

        const group = await Group.findById(id)
            .populate('headquarters')//trae datos de headquarters
            .populate('groupDirector','-password'); //trae datos de groupDirector excluyendo password

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Grupo no encontrado.',
            });
        }

        res.status(200).json({
            success: true,
            data: group,
        });
    } catch (error) {
        console.error('Error retrieving group:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el grupo.',
                error: error.message,
            });
    }
};

// 3. GET /api/grupos/:id/acudientes - Listar los acudientes por grupo
const getGuardiansByGroup = async (req, res) => {
    try {
        const { id } = req.params;

    // Buscar el grupo e incluir la sede (headquarters)
    const group = await Group.findById(id).populate('headquarters');

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Grupo no encontrado.',
            });
        }

    const sede = group.headquarters;
        if (!sede) {
            return res.status(404).json({
                success: false,
                message: 'La sede de este grupo no fue encontrada.',
            });
        }

        // La sede referencia al colegio en el campo school
        const collegeId = sede.school;

        // Buscar usuarios (ModelUser) que pertenezcan al colegio y tengan el rol 'acudiente'
        const guardians = await ModelUser.find({
            college: collegeId,
            roles: 'acudiente',
            isActive: true,
        }).select('-password'); // excluir password por seguridad

            return res.status(200).json({
                success: true,
                data: guardians,
            });
    } catch (error) {
        console.error('Error retrieving guardians:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los acudientes.',
                error: error.message,
            });
    }
};

// 4. GET /api/grupos/sedes/:sedeId/grupos - Grupos por sede
const getGroupsByHeadquarters = async (req, res) => {
    try {
        const { sedeId } = req.params;

        const groups = await Group.find({ headquarters: sedeId })
            .populate('headquarters')
            .populate('groupDirector');

            res.status(200).json({
                success: true,
                data: groups,
            });
    } catch (error) {
        console.error('Error retrieving groups:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los grupos.',
                error: error.message,
            });
    }
};

// 5. GET /api/grupos/:id/estudiantes - Estudiantes por grupo
const  getStudentsByGroup = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el grupo e incluir la sede (headquarters)
        const group = await Group.findById(id).populate('headquarters');

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Grupo no encontrado.',
            });
        }

        const sede = group.headquarters;
        if (!sede) {
            return res.status(404).json({
                success: false,
                message: 'La sede de este grupo no fue encontrada.',
            });
        }

        // La sede referencia al colegio en el campo school
        const colegioId = sede.school;

        // Buscar usuarios (ModelUser) que pertenezcan al colegio y tengan el rol 'estudiante'
        const students = await ModelUser.find({
            schoolId: colegioId,
            roles: 'estudiante',
            isActive: true,
        }).select('-password'); // excluir password por seguridad

            return res.status(200).json({
                success: true,
                data: students,
            });
            
    } catch (error) {
        console.error('Error retrieving students:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los estudiantes.',
                error: error.message,
            });
    }
};

// 6. POST /api/grupos - Crear
const createGroup = async (req, res) => {
    try {
        const { headquarters, year, cycle, level, grade, groupIdentifier, session, groupDirector } = req.body;

        const newGroup = new Group({
            headquarters,
            year,
            cycle,
            level,
            grade,
            groupIdentifier,
            session,
            groupDirector,
            periodData: [],
            isActive: true,
        });

        await newGroup.save();

            res.status(201).json({
                success: true,
                message: 'Grupo creado correctamente.',
                data: newGroup,
            });
    } catch (error) {
        console.error('Error creating group:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear el grupo.',
                error: error.message,
            });
    }
};

// 7. POST /api/sedes/:sedeId/grupos - Crear grupo dentro de la sede
const createGroupInHeadquarters = async (req, res) => {
    try {
        const { sedeId } = req.params;
        const { year, cycle, level, grade, groupIdentifier, session, groupDirector } = req.body;

        const newGroup = new Group({
            headquarters: sedeId,
            year,
            cycle,
            level,
            grade,
            groupIdentifier,
            session,
            groupDirector,
            periodData: [],
            isActive: true,
        });

        await newGroup.save();

            res.status(201).json({
                success: true,
                message: 'Grupo creado correctamente.',
                data: newGroup,
            });
    } catch (error) {
        console.error('Error creating group:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear el grupo.',
                error: error.message,
            });
    }
};

// 8. PUT /api/grupos/:id - Actualizar (persistente)
const updateGroup = async (req, res) => {
    const { id } = req.params;

    // Usamos desestructuración para separar los campos únicos
    // (que no queremos actualizar) del resto de los datos.
    const {
        _id, // Por seguridad
        headquarters,
        year,
        grade,
        groupIdentifier,
        ...dataToUpdate // Contiene el resto: cycle, level, groupDirector, etc.
    } = req.body;


    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            id,
            dataToUpdate, // <-- Pasamos SOLO los datos filtrados
            { new: true, runValidators: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({
                success: false,
                message: `Grupo con ID ${id} no encontrado`
            });
        }

        res.status(200).json({
            success: true,
            message: "Grupo actualizado correctamente.",
            data: updatedGroup
        });

    } catch (error) {
        // Con esta lógica, el error 11000 ya no debería ocurrir
        // por esta ruta, pero es bueno mantenerlo por si acaso.
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'No se pudo actualizar: Conflicto de datos únicos.'
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'El ID proporcionado no es válido.'
            });
        }

        console.error('Error en updateGroup:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar el grupo.'
        });
    }
};

// 9. PUT /api/grupos/:id/activar - Activar
const activateGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedGroup = await Group.findByIdAndUpdate(id, { isActive: true }, { new: true })
            .populate('headquarters')
            .populate('groupDirector');

        if (!updatedGroup) {
            return res.status(404).json({
                success: false,
                message: 'Grupo no encontrado.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Grupo activado correctamente.',
            data: updatedGroup,
        });
    } catch (error) {
        console.error('Error activating group:', error);
        res.status(500).json({
            success: false,
            message: 'Error al activar el grupo.',
            error: error.message,
        });
    }
};

// 10. PUT /api/grupos/:id/desactivar - Desactivar
const deactivateGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedGroup = await Group.findByIdAndUpdate(id, { isActive: false }, { new: true })
            .populate('headquarters')
            .populate('groupDirector');

        if (!updatedGroup) {
            return res.status(404).json({
                success: false,
                message: 'Grupo no encontrado.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Grupo desactivado correctamente.',
            data: updatedGroup,
        });
    } catch (error) {
        console.error('Error deactivating group:', error);
        res.status(500).json({
            success: false,
            message: 'Error al desactivar el grupo.',
            error: error.message,
        });
    }
};

// 11. DELETE /api/grupos/:id - Eliminar
const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedGroup = await Group.findByIdAndDelete(id);

        if (!deletedGroup) {
            return res.status(404).json({
                success: false,
                message: 'Grupo no encontrado.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Grupo eliminado correctamente.',
            data: deletedGroup,
        });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el grupo.',
            error: error.message,
        });
    }
};

const groupController = {
    getGroupsByYear,
    getGroupById,
    getGuardiansByGroup,
    getGroupsByHeadquarters,
    getStudentsByGroup,
    createGroup,
    createGroupInHeadquarters,
    updateGroup,
    activateGroup,
    deactivateGroup,
    deleteGroup,
};

export default groupController;