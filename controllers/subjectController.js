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

// Listar por tipo (materia o area)
export const listByType = async (req, res) => {
  try {
    // Param name changed to typeId to match English routes
    const { typeId } = req.params;
    if (!['materia', 'area'].includes(typeId)) {
      return res.status(400).json({ message: 'El tipo debe ser materia o area' });
    }
    const subjects = await Subject.find({ type: typeId });
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
    const { id } = req.params;

    // Recuperar documento actual
    const current = await Subject.findById(id);
    if (!current) return res.status(404).json({ message: 'Materia/área no encontrada' });

    // Campos permitidos para actualizar
    const allowed = ['school', 'name', 'code', 'type', 'areaCode', 'independent', 'includeInStatistics', 'active'];

    const updates = {};

    // Normalización y construcción del objeto de cambios sólo con campos que realmente cambian
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        let val = req.body[key];

        if (val === undefined || val === null) continue;

        // Normalizaciones comunes
        if (typeof val === 'string') val = val.trim();
        if (key === 'code' && typeof val === 'string') val = val.toUpperCase();
        if (key === 'type' && typeof val === 'string') val = val.toLowerCase();

        // Comparar con valor actual (tener en cuenta ObjectId -> string)
        const currentVal = (current[key] === undefined || current[key] === null) ? current[key] : (current[key].toString ? current[key].toString() : current[key]);
        const newVal = (val && val.toString) ? val.toString() : val;

        if (newVal !== currentVal) {
          updates[key] = val;
        }
      }
    }

    // Si no hay cambios, devolver error
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No hay cambios para actualizar' });
    }

    // Si se intenta cambiar el código, comprobar duplicados
    if (updates.code) {
      const existing = await Subject.findOne({ code: updates.code, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'El código de la materia ya existe', keyValue: { code: updates.code } });
      }
    }

    // Ejecutar actualización sólo con los campos modificados
    const subject = await Subject.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true, context: 'query' }
    );

    res.status(200).json(subject);
  } catch (error) {
    // Si llegara un error de clave duplicada (por alguna carrera rara), devolvemos mensaje claro
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'Código duplicado', error });
    }
    res.status(400).json({ message: 'Error al actualizar materia/área', error });
  }
};

// Activar materia/área
export const activateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await Subject.findById(id);
    if (!current) return res.status(404).json({ message: 'Materia/área no encontrada' });
    if (current.active === true) return res.status(400).json({ message: 'La materia ya está activa' });

    current.active = true;
    await current.save();
    res.status(200).json(current);
  } catch (error) {
    res.status(500).json({ message: 'Error al activar materia/área', error });
  }
};

// Desactivar materia/área
export const deactivateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await Subject.findById(id);
    if (!current) return res.status(404).json({ message: 'Materia/área no encontrada' });
    if (current.active === false) return res.status(400).json({ message: 'La materia ya está desactivada' });

    current.active = false;
    await current.save();
    res.status(200).json(current);
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
