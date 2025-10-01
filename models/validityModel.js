import mongoose from "mongoose";

const validitySchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  active: { type: Boolean, default: false },
}, { timestamps: true }); 

const Validity = mongoose.model("Validity", validitySchema);

export default Validity;