import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  period: { type: Number, required: true, enum: [1, 2, 3, 4] },
  name: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Rule: No more than 4 periods per year
periodSchema.pre("save", async function (next) {
  const Period = mongoose.model("Period");
  const count = await Period.countDocuments({ year: this.year });
  if (count >= 4 && this.isNew) {
    return next(new Error("Cannot create more than 4 periods in a year"));
  }
  next();
});

// Rule: Year + Period must be unique
periodSchema.index({ year: 1, period: 1 }, { unique: true });

export default mongoose.model("Period", periodSchema);
