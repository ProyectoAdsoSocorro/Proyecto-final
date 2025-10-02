import mongoose from "mongoose";
import Period from "../models/periodModel.js";

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all periods
export const getAllPeriods = async (req, res) => {
  try {
    const periods = await Period.find().sort({ year: -1, period: 1 });
    res.json({ success: true, message: "Períodos listados con éxito", data: periods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET period by ID
export const getPeriodById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "El ID proporcionado no es válido" });
    }

    const period = await Period.findById(id);
    if (!period) {
      return res.status(404).json({ success: false, message: "Período no encontrado" });
    }
    res.json({ success: true, message: "Período encontrado", data: period });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET periods by year
export const getPeriodsByYear = async (req, res) => {
  try {
    const periods = await Period.find({ year: req.params.year });
    res.json({ success: true, message: "Períodos del año listados", data: periods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create period
export const createPeriod = async (req, res) => {
  try {
    const exists = await Period.findOne({ year: req.body.year, period: req.body.period });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `El período ${req.body.period} ya existe para el año ${req.body.year}`
      });
    }

    const newPeriod = new Period(req.body);
    await newPeriod.save();

    res.status(201).json({
      success: true,
      message: "Período creado con éxito",
      data: newPeriod
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `El período ${req.body.period} ya existe para el año ${req.body.year}`
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update period
export const updatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "El ID proporcionado no es válido" });
    }

    if (req.body.year && req.body.period) {
      const exists = await Period.findOne({
        year: req.body.year,
        period: req.body.period,
        _id: { $ne: id }
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: `El período ${req.body.period} ya existe para el año ${req.body.year}`
        });
      }
    }

    const updated = await Period.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Período no encontrado" });
    }
    res.json({ success: true, message: "Período actualizado", data: updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `El período ${req.body.period} ya existe para el año ${req.body.year}`
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT activate period
export const activatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "El ID proporcionado no es válido" });
    }

    const activated = await Period.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!activated) {
      return res.status(404).json({ success: false, message: "Período no encontrado" });
    }

    res.json({
      success: true,
      message: "Período activado con éxito",
      data: activated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT deactivate period
export const deactivatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "El ID proporcionado no es válido" });
    }

    const deactivated = await Period.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deactivated) {
      return res.status(404).json({ success: false, message: "Período no encontrado" });
    }

    res.json({
      success: true,
      message: "Período desactivado con éxito",
      data: deactivated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE (disabled as per rules)
export const deletePeriod = async (req, res) => {
  return res.status(405).json({
    success: false,
    message: "La eliminación de períodos está deshabilitada"
  });
};
