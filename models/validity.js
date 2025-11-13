import mongoose from 'mongoose';
const { Schema, model } = mongoose;

/**
 * Modelo: Validity (Vigencia)
 * Define la configuración académica anual de un colegio:
 * - Año activo
 * - Rector, secretaria y coordinadores por sede
 * - Parámetros de calificación y habilitación
 */
const ValiditySchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
    description: 'Año académico (único por colegio)'
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    description: 'Referencia al colegio'
  },
  active: {
    type: Boolean,
    default: false,
    description: 'Indica si esta vigencia está activa'
  },

  // Roles principales
  rector: {
    type: Schema.Types.ObjectId,
    ref: 'SchoolUsers',
    description: 'Usuario con rol rector asignado'
  },
  generalSecretary: {
    type: Schema.Types.ObjectId,
    ref: 'SchoolUsers',
    description: 'Usuario con rol secretaria general'
  },

  // Información por sede
  headquarterInfo: [{
    headquarter: { type: Schema.Types.ObjectId, ref: 'Headquarters', required: true },
    coordinator: { type: Schema.Types.ObjectId, ref: 'SchoolUsers' },
    secretary: { type: Schema.Types.ObjectId, ref: 'SchoolUsers' }
  }],

  // Parámetros académicos
  maxGrade: { type: Number, default: 5.0 },
  minGrade: { type: Number, default: 1.0 },

  gradeConventions: [{
    code: String, // Ejemplo: “ALTO”
    value: String, // Ejemplo: “A” o “4.5”
    order: Number  // Orden para mostrar en reportes
  }],

  failYearCondition: {
    type: String,
    default: '2 Materias',
    description: 'Condición para perder el año (ej. 2 áreas o 2 materias)'
  },
  recoveryType: {
    type: String,
    enum: ['PROMEDIO', 'REEMPLAZO'],
    default: 'PROMEDIO',
    description: 'Tipo de nota para habilitaciones'
  },
  recoveryPercentage: {
    type: Number,
    default: 20,
    description: 'Porcentaje de habilitación si el tipo es promedio'
  },
  maxFailedSubjects: {
    type: Number,
    default: 2,
    description: 'Número máximo de materias perdidas para habilitar'
  },
  recoveryActTemplate: {
    type: String,
    default: '',
    description: 'Plantilla de acta de recuperación (si aplica)'
  }
}, { timestamps: true });

export default model('Validities', ValiditySchema);

