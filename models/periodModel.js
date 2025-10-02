import mongoose from "mongoose";

const periodSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true
    },
    period: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4] // Solo se permiten 4 períodos por año
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
    isActive: {
      type: Boolean,
      default: true // Campo activar/desactivar
    }
  },
  {
    timestamps: true
  }
);

// Rule: No more than 4 periods per year
periodSchema.pre("save", async function (next) {
  const Period = mongoose.model("Period");
  if (this.isNew) {
    const count = await Period.countDocuments({ year: this.year });
    if (count >= 4) {
      return next(new Error("Cannot create more than 4 periods in a year"));
    }
  }
  next();
});

// Rule: Year + Period must be unique
periodSchema.index({ year: 1, period: 1 }, { unique: true });

const Period = mongoose.model("Period", periodSchema);
export default Period;
