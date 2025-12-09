import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Modelo Subject para materias y áreas
const SubjectSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group', // referencia al modelo de grupos
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['materia', 'area'],
    required: true,
    default: 'materia'
  },
  areaCode: {
    type: String,
    trim: true
  },
  independent: {
    type: Boolean,
    default: false
  },
  includeInStatistics: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

SubjectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default model('Subject', SubjectSchema);
