import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Función para validar existencia de referencias
const refExists = (modelName) => {
    return {
        validator: async function (value) {
            if (!value) return false; // No permitir null si es requerido
            return await mongoose.models[modelName].exists({ _id: value });
        },
        message: (props) => `${modelName} con ID ${props.value} no existe`
    };
};

const QualificationSchema = new Schema({
    // ──────────────────────────────────────────────────────────
    // REFERENCIAS
    // ──────────────────────────────────────────────────────────

    school: { 
        type: Schema.Types.ObjectId, 
        ref: 'School', 
        required: true,
        validate: refExists('School'),
        description: 'Colegio al que pertenece la calificación'
    },

    student: { 
        type: Schema.Types.ObjectId, 
        ref: 'users', 
        required: true,
        validate: refExists('users'),
        description: 'Estudiante al que pertenece la calificación'
    },

    subject: { 
        type: Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: true,
        validate: refExists('Subject'),
        description: 'Materia/asignatura'
    },

    group: { 
        type: Schema.Types.ObjectId, 
        ref: 'Group', 
        required: true,
        validate: refExists('Group'),
        description: 'Grupo/curso del estudiante'
    },

    period: { 
        type: Schema.Types.ObjectId, 
        ref: 'Period', 
        default: null,
        validate: {
            validator: async function (value) {
                if (this.noteType === 'FINAL') {
                    return value === null;
                }
                if (this.noteType === 'PERIOD') {
                    if (!value) return false;
                    return await mongoose.models.Period.exists({ _id: value });
                }
            },
            message: 'Las notas FINAL deben tener period = null y las PERIOD deben tener un período válido'
        },
        description: 'Período académico (null para notas finales)'
    },

    // ──────────────────────────────────────────────────────────
    // CAMPOS DE LA CALIFICACIÓN
    // ──────────────────────────────────────────────────────────

    year: { 
        type: Number, 
        required: true,
        min: [2000, 'El año no puede ser menor a 2000'],
        max: [2100, 'El año no puede ser mayor a 2100'],
        description: 'Año académico'
    },

    noteType: { 
        type: String, 
        enum: ['PERIOD', 'FINAL'], 
        required: true,
        description: 'Tipo de nota: PERIOD o FINAL'
    },

    note: {
        type: Number, 
        required: true,
        min: [0, 'La nota mínima es 0'],
        max: [5, 'La nota máxima es 5'],
        description: 'Calificación numérica (0 a 5)'
    },

    evaluativeJudgment: { 
        type: String, 
        default: '',
        description: 'Juicio evaluativo cualitativo'
    },

    absences: { 
        type: Number, 
        default: 0,
        min: [0, 'Las ausencias no pueden ser negativas'],
        description: 'Número de ausencias en el período'
    },

    observations: { 
        type: String, 
        default: '',
        description: 'Observaciones adicionales'
    },

    // ──────────────────────────────────────────────────────────
    // METADATOS
    // ──────────────────────────────────────────────────────────

    registeredBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'users',
        validate: refExists('users'),
        description: 'Usuario que registró la calificación'
    }

}, { 
    timestamps: true
});

// ──────────────────────────────────────────────────────────
// ÍNDICES
// ──────────────────────────────────────────────────────────

// Optimiza búsquedas masivas por estudiante/materia/periodo
QualificationSchema.index(
    { student: 1, subject: 1, period: 1, year: 1 }, 
    { 
        unique: true,
        partialFilterExpression: { period: { $ne: null } } // El índice único solo se aplica si 'period' no es null
    }
);

export default model('Qualification', QualificationSchema);
