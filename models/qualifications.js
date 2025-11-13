import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const QualificationSchema = new Schema({
    // Referencias a otros modelos
    school: { 
        type: Schema.Types.ObjectId, 
        ref: 'School', 
        required: true,
        description: 'Colegio al que pertenece la calificación'
    },
    student: { 
        type: Schema.Types.ObjectId, 
        ref: 'SchoolUsers', 
        required: true,
        description: 'Estudiante al que pertenece la calificación'
    },
    subject: { 
        type: Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: true,
        description: 'Materia/asignatura'
    },
    group: { 
        type: Schema.Types.ObjectId, 
        ref: 'Group', 
        required: true,
        description: 'Grupo/curso del estudiante'
    },
    period: { 
        type: Schema.Types.ObjectId, 
        ref: 'Period', 
        default: null, // null indica que es una nota final
        description: 'Período académico (null para notas finales)'
    },

    // Campos de la calificación
    year: { 
        type: Number, 
        required: true,
        description: 'Año académico'
    },
    gradeType: { 
        type: String, 
        enum: ['PERIOD', 'FINAL'], 
        required: true,
        description: 'Tipo de nota: PERIOD (período) o FINAL'
    },
    grade: { 
        type: Number, 
        required: true,
        description: 'Calificación numérica'
    },
    evaluativeJudgment: { 
        type: String, 
        default: '',
        description: 'Juicio evaluativo cualitativo'
    },
    absences: { 
        type: Number, 
        default: 0,
        description: 'Número de ausencias en el período'
    },
    observations: { 
        type: String, 
        default: '',
        description: 'Observaciones adicionales'
    },

    // Metadatos
    registrationDate: { 
        type: Date, 
        default: Date.now,
        description: 'Fecha de registro de la calificación'
    },
    registeredBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'SchoolUsers',
        description: 'Usuario que registró la calificación'
    }
}, { 
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    description: 'Modelo de calificaciones académicas'
});

// Índice compuesto para búsquedas frecuentes
// No es único para permitir múltiples calificaciones del mismo estudiante
// en la misma materia (diferentes tipos de nota)
QualificationSchema.index(
    { student: 1, subject: 1, period: 1, year: 1 }, 
    { 
        unique: false,
        description: 'Índice para optimizar búsquedas por estudiante, materia, período y año'
    }
);

export default model('Qualifications', QualificationSchema);

