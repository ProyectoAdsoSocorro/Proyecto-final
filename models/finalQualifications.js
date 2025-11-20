import mongoose from 'mongoose';

const FinalQualificationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },

  /** Nota final (promedio o cálculo según períodos) */
  finalNote: {
    type: Number,
    required: true,
  },

  /** Juicio valorativo final */
  finalEvaluativeJudgment: {
    type: String,
    default: null,
  },

  /** Observaciones finales */
  finalObservations: { 
        type: String, 
        default: '',
    },

  /** Fallas acumuladas */
  totalAbsences: {
    type: Number,
    default: 0,
  },

  /** Fecha del cálculo */
  calculatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true, // createdAt, updatedAt
  versionKey: false,
});

export default mongoose.model('FinalQualification', FinalQualificationSchema);
