import Subject from '../models/subject.js';

// Listar todas las materias/áreas
export const listSubjects = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const subjects = await Subject.find(filter);
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar materias/áreas', error });
  }
};

// Obtener materia/área por ID
export const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject)
      return res.status(404).json({ message: 'Materia/área no encontrada' });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener materia/área', error });
  }
};

// Listar por tipo (subject o area)
export const listByType = async (req, res) => {
  try {
    const { type } = req.params;
    const subjects = await Subject.find({ type });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar por tipo', error });
  }
};

// Listar materias por código de área
export const listByArea = async (req, res) => {
  try {
    const { areaCode } = req.params;
    const subjects = await Subject.find({ areaCode });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar por área', error });
  }
};

// Crear materia/área
export const createSubject = async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear materia/área', error });
  }
};

// Actualizar materia/área
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subject)
      return res.status(404).json({ message: 'Materia/área no encontrada' });
    res.status(200).json(subject);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar materia/área', error });
  }
};

// Activar materia/área
export const activateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { active: true },
      { new: true }
    );
    if (!subject)
      return res.status(404).json({ message: 'Materia/área no encontrada' });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error al activar materia/área', error });
  }
};

// Desactivar materia/área
export const deactivateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!subject)
      return res.status(404).json({ message: 'Materia/área no encontrada' });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar materia/área', error });
  }
};

// Eliminar materia/área
export const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject)
      return res.status(404).json({ message: 'Materia/área no encontrada' });
    res.status(200).json({ message: 'Materia/área eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar materia/área', error });
  }
};
