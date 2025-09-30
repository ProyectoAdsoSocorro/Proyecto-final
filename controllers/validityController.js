import Validity from "../models/validityModel.js";


export const getAllValidities = async (req, res) => {
  try {
    const validities = await Validity.find();
    res.json({
      success: true,
      message: "Lista de vigencias obtenida correctamente",
      validities
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getActiveValidity = async (req, res) => {
  try {
    const active = await Validity.findOne({ active: true });

    if (!active) {
      return res.status(404).json({
        success: false,
        message: "No hay vigencia activa actualmente"
      });
    }

    res.json({
      success: true,
      message: "Vigencia activa encontrada",
      active
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createValidity = async (req, res) => {
  try {
    const newValidity = new Validity({ year: req.body.year });
    await newValidity.save();

    res.status(201).json({
      success: true,
      message: "Vigencia creada correctamente",
      newValidity
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Ya existe una vigencia con el año ${req.body.year}`
      });
    }

    res.status(500).json({ error: err.message });
  }
};



export const activateValidity = async (req, res) => {
  try {
    await Validity.updateMany({}, { $set: { active: false } });

    const active = await Validity.findByIdAndUpdate(
      req.params.id,
      { active: true },
      { new: true }
    );

    if (!active) {
      return res.status(404).json({
        success: false,
        message: " No se encontró la vigencia a activar"
      });
    }

    res.json({
      success: true,
      message: "Vigencia activada correctamente",
      active
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteValidity = async (req, res) => {
  try {
    const yearToDelete = Number(req.params.year); 
    const deleted = await Validity.findOneAndDelete({ year: yearToDelete });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "No se encontró la vigencia a eliminar" });
    }

    res.json({
      success: true,
      message: "Vigencia eliminada correctamente",
      deleted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
