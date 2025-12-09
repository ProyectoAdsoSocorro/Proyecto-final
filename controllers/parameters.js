import Parameter from '../models/Parameter.js';

import School from '../models/schools.js';

// const SchoolSchema = new mongoose.Schema({}, { collection: 'schools' });
// // const School = mongoose.model('Schools', SchoolSchema);

export const getParameters = async (req, res) => {
  try {
    const parameters = await Parameter.find();
    res.json(parameters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getParameterById = async (req, res) => {
  try {
    const parameter = await Parameter.findById(req.params.id);
    if (!parameter) return res.status(404).json({ error: 'extraviado' });
    res.json(parameter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getParameterBySchool = async (req, res) => {
  try {
    const parameter = await Parameter.findOne({ school: req.params.schoolId });
    if (!parameter) return res.status(404).json({ error: 'extraviado' });
    res.json(parameter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

export const createParameter = async (req, res) => {
  try {
    const schoolId = req.body.school;    
    const school = await School.findById(schoolId);

    if (!school) {
      return res.status(400).json({ error: "El colegio indicado no existe en la base de datos." });
    }

    const parameter = new Parameter(req.body);
    await parameter.save();
    res.status(201).json(parameter);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateParameter = async (req, res) => {
  try {
    const parameter = await Parameter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!parameter) return res.status(404).json({ error: 'extraviado' });
    res.json(parameter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteParameter = async (req, res) => {
  try {
    await Parameter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const activateParameter = async (req, res) => {
  try {
    const parameter = await Parameter.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true }
    );
    if (!parameter) return res.status(404).json({ error: 'extraviado' });
    res.json(parameter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deactivateParameter = async (req, res) => {
  try {
    const parameter = await Parameter.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!parameter) return res.status(404).json({ error: 'extraviado' });
    res.json(parameter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
