import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ParameterSchema = new Schema({
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School', 
    required: true
  },
  shield: String,
  certificateHeader: String,
  cardFront: String,
  cardBack: String,
  studentPhoto: Boolean,
  linkedToPeriod: Boolean,
  linkedToGrade: Boolean,
  approximateAverage: Boolean,
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ParameterSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

ParameterSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default model('Parameter', ParameterSchema);
