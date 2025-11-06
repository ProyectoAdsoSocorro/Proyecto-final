const validateIndicatorData = async (req, res, next) => {
    try {
        const { type, description, performanceIndicators } = req.body;
        const errors = [];

        // Validar tipo
        if (type && Array.isArray(type)) {
            if (type.length === 0) {
                errors.push('El array type no puede estar vacío');
            }
            if (type.length > 5) {
                errors.push('No se pueden especificar más de 5 tipos');
            }
        } else {
            errors.push('El campo type debe ser un array');
        }

        // Validar descripción
        if (!description || description.trim() === '') {
            errors.push('La descripción es requerida');
        } else if (description.length < 5) {
            errors.push('La descripción debe tener al menos 5 caracteres');
        } else if (description.length > 500) {
            errors.push('La descripción no puede tener más de 500 caracteres');
        }

        // 3. VALIDAR performanceIndicators (reemplaza qualification)
        if (!performanceIndicators) {
            errors.push('El campo performanceIndicators es requerido');
        } else {
            const validIndicators = ['Alto', 'Medio', 'Bajo', 'Excelente', 'Regular', 'Deficiente'];
            if (!validIndicators.includes(performanceIndicators)) {
                errors.push(`performanceIndicators debe ser uno de: ${validIndicators.join(', ')}`);
            }
        }

        // Si hay errores, retornarlos
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Errores de validación en datos del indicador",
                errors: errors
            });
        }

        next();
    } catch (error) {
        console.error("Error en middleware de datos del indicador:", error);
        res.status(500).json({ 
            error: "Error interno del servidor en validación de datos del indicador",
            details: error.message 
        });
    }
};

export default validateIndicatorData;