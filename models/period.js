import mongoose from 'mongoose';
const { Schema } = mongoose;

const periodSchema = new Schema({
  school: {
    type: Schema.Types.ObjectId,
    // ref: 'Colegios', //se activa cuando ya esta integrado para que tome ref a colegios
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
    if(this.fechaFin<this.fechaInicio){
        this.invalidate('fechaFin','la fecha de fin no puede ser anterior a la fecha de inicio')
    }
    next();
})
//indice unico el colegio no puede tener dos periodos con el mismo numero en un año
periodSchema.index({ school: 1, year: 1, number: 1 }, { unique: true });

export default mongoose.model('Period', periodSchema);
