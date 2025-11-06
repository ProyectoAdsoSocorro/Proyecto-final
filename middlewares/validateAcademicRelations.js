import mongoose from "mongoose";

const validateAcademicRelations = async (req, res, next) => {
    try {
        const { academicLoad, period } = req.body;
        const errors = [];

        // Validar que academicLoad exista
        if (academicLoad) {
            try {
                const AcademicLoad = mongoose.model('AcademicLoad');
                const academicLoadExists = await AcademicLoad.findById(academicLoad);
                if (!academicLoadExists) {
                    errors.push('La carga académica especificada no existe');
                }
            } catch (error) {
                errors.push('Error al validar la carga académica: ' + error.message);
            }
        } else {
            errors.push('El campo academicLoad es requerido');
        }

        // Validar que period exista
        if (period) {
            try {
                const Period = mongoose.model('Period');
                const periodExists = await Period.findById(period);
                if (!periodExists) {
                    errors.push('El período especificado no existe');
                }
            } catch (error) {
                errors.push('Error al validar el período: ' + error.message);
            }
        } else {
            errors.push('El campo period es requerido');
        }

        // Si hay errores, retornarlos
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Errores de validación en relaciones académicas",
                errors: errors
            });
        }

        next();
    } catch (error) {
        console.error("Error en middleware de relaciones académicas:", error);
        res.status(500).json({ 
            error: "Error interno del servidor en validación de relaciones académicas",
            details: error.message 
        });
    }
};

export default validateAcademicRelations;

