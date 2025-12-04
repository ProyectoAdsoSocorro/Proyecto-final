import mongoose from 'mongoose';
const { Schema } = mongoose;

const periodSchema = new Schema({
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School', //se activa cuando ya esta integrado para que tome ref a colegios
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2010,
    max: new Date().getFullYear() + 1
  },
  cycle: {
    type: String,
    enum: ['normal', 'semestral', 'trimestral'],
    default: 'normal',
    required: true
  },
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
//validacion de fechas
periodSchema.pre('validate', function(next){
  // usar startDate/endDate (no fechaInicio/fechaFin)
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'La fecha de fin no puede ser anterior a la fecha de inicio');
  }
    next();
})
//indice unico el colegio no puede tener dos periodos con el mismo numero en un año
periodSchema.index({ school: 1, year: 1, number: 1 }, { unique: true });

periodSchema.index(
  { school: 1, year: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

// Protección a nivel de modelo: evitar que se guarde un periodo activo si ya existe otro
periodSchema.pre('save', async function(next) {
  try {
    if (this.active) {
      const Period = this.constructor;
      const other = await Period.findOne({ school: this.school, year: this.year, active: true, _id: { $ne: this._id } });
      if (other) {
        return next(new Error('Ya existe otro periodo activo para este colegio y año'));
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Protección al actualizar vía findOneAndUpdate (por ejemplo activate endpoint)
periodSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();
    if (!update) return next();

    const willActivate = (update.active === true) || (update.$set && update.$set.active === true);
    if (!willActivate) return next();

    // Obtener el documento actual para conocer school/year si no vienen en la actualización
    const doc = await this.model.findOne(this.getQuery()).lean();
    if (!doc) return next(new Error('Periodo no encontrado'));

    const school = (update.school || (update.$set && update.$set.school)) || doc.school;
    const year = (update.year || (update.$set && update.$set.year)) || doc.year;

    const other = await this.model.findOne({ school, year, active: true, _id: { $ne: doc._id } });
    if (other) return next(new Error('Ya existe otro periodo activo para este colegio y año'));

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Period', periodSchema);
