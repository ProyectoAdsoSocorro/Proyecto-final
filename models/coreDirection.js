import mongoose from 'mongoose';

const CoreDirectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  responsible: { type: String, required: true },
  active: { type: Boolean, default: true }, // to activate/deactivate
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CoreDirection', CoreDirectionSchema);
