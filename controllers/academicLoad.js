import AcademicLoad from '../models/academicLoad.js';

// @desc    Obtener todas las cargas académicas por año
// @route   GET /api/carga-academica/año/:año
// @access  Rector, Coordinador, Secretaria
export const getLoadsByYear = async (req, res) => {
    try {
        const { year } = req.params;
       

        const filter = { isActive: true };
        if (year) filter.year = parseInt(year);
        // si el middleware de auth añade req.user, filtrar por school
        const school = req.user ? req.user.school : undefined;
        if (school) filter.school = school;

        const loads = await AcademicLoad.find(filter);

     
        if (!loads || loads.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No existen registros de carga académica para el año solicitado.'
            });
        }

        res.json({
            success: true,
            data: loads,
            count: loads.length
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            message: 'Error al obtener cargas académicas',
           
        });
    }
};


// @desc    Obtener carga académica por ID
// @route   GET /api/carga-academica/:id
// @access  Rector, Coordinador, Secretaria
export const getLoadById = async (req, res) => {
    try {
        const { id } = req.params;
        const load = await AcademicLoad.findById(id)
           

        if (!load) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            data: load
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener carga académica',
            error: error.message
        });
    }
};

// @desc    Obtener asignaciones por profesor
// @route   GET /api/profesores/:profesorId/carga-academica
// @access  Rector, Coordinador, Secretaria
export const getLoadsByProfessor = async (req, res) => {
    try {
        const { professorId } = req.params;
        console.log(professorId);
        const load = await AcademicLoad.find({ professor: professorId })
        res.send(load);
        

    } catch (error) {
        console.error('Error en getLoadsByProfessor:', error);
        
     
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Error de duplicación: ya existe una carga académica con estos datos'
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación en los datos',
                errors: errors
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Formato de ID inválido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener las cargas académicas',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// @desc    Obtener asignaciones por grupo
// @route   GET /api/grupos/:grupoId/carga-academica
// @access  Rector, Coordinador, Secretaria
 // @desc    Obtener asignaciones por grupo
// @route   GET /api/grupos/:grupoId/carga-academica
// @access  Rector, Coordinador, Secretaria
export const getLoadsByGroup = async (req, res) => {
    try {
        const { groupId } = req.params; // 
        
        const filter = {
            group: groupId, // ✅ Ahora coincide con el parámetro
            isActive: true
        };
        console.log(filter);

      
        const cargas = await AcademicLoad.find(filter)
            
        res.json({
            success: true,
            data: cargas,
            count: cargas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener cargas por grupo',
            error: error.message
        });
    }
};

// @desc    Crear nueva carga académica
// @route   POST /api/carga-academica
// @access  Solo Secretaria
export const createAcademicLoad = async (req, res) => {
    try {
        const { school, professor, subject, group, year, hoursIntensity, percentage } = req.body;
console.log(req.body);


        const newLoad = new AcademicLoad({
            school,
            professor,
            subject,
            group,
            year,
            hoursIntensity,
            percentage,
            isActive: true
        });

       await newLoad.save();
        res.status(201).json({
            success: true,
            message: 'Carga académica creada correctamente',
            data: newLoad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la carga académica',
            error: error.message
        });
    }
};

// @desc    Actualizar carga académica
// @route   PUT /api/carga-academica/:id
// @access  Solo Secretaria
export const updateAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;
        const { hoursIntensity, percentage, year } = req.body;

        const updatedLoad = await AcademicLoad.findByIdAndUpdate(
            id,
            { 
                hoursIntensity, 
                percentage,
                year
            },
            { new: true, runValidators: true }
        )
        if (!updatedLoad) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Carga académica actualizada correctamente',
            data: updatedLoad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar carga académica',
            error: error.message
        });
    }
};

// @desc    Activar carga académica
// @route   PUT /api/carga-academica/:id/activar
// @access  Solo Secretaria
export const activateAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;

        const activatedLoad = await AcademicLoad.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        )
         if (!activatedLoad) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Carga académica activada correctamente',
            data: activatedLoad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al activar la carga académica',
            error: error.message
        });
    }
};

// @desc    Desactivar carga académica
// @route   PUT /api/carga-academica/:id/desactivar
// @access  Solo Secretaria
export const deactivateAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;

        const deactivatedLoad = await AcademicLoad.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        )
        if (!deactivatedLoad) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Carga académica desactivada correctamente',
            data: deactivatedLoad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al desactivar la carga académica',
            error: error.message
        });
    }
};

// @desc    Eliminar carga académica
// @route   DELETE /api/carga-academica/:id
// @access  Solo Secretaria
export const deleteAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLoad = await AcademicLoad.findByIdAndDelete(id);

        if (!deletedLoad) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Carga academica elimiada correctamente',
            data: deletedLoad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la carga académica',
            error: error.message
        });
    }
};
