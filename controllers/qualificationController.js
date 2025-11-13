import * as service from '../services/qualificationService.js';

/**
 * Obtener una calificación por ID
 */
export const get = async (req, res) => {
  try {
    const qualification = await service.getById(req.params.id);
    if (!qualification) return res.status(404).json({ message: 'No encontrado' });
    res.json(qualification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar calificaciones de un estudiante
 */
export const listByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { year } = req.query;
    const list = await service.listByStudent(studentId, year);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar calificaciones de un grupo
 */
export const listByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { year } = req.query;
    const list = await service.listByGroup(groupId, year);
    res.status(200).json(list);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
};

/**
 * Listar calificaciones por grupo y materia
 */
export const listByGroupAndSubject = async (req, res) => {
  try {
    const { groupId, subjectId } = req.params;
    const { year } = req.query;
    const data = await service.listByGroupAndSubject(groupId, subjectId, year);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar calificaciones finales por año
 */
export const listFinalsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const data = await service.listFinalsByYear(year);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar calificaciones finales de un estudiante (opcionalmente por año)
 */
export const listFinalsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { year } = req.query;
    const data = await service.listFinalsByStudent(studentId, year);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar calificaciones finales de un grupo (opcionalmente por año)
 */
export const listFinalsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { year } = req.query;
    const data = await service.listFinalsByGroup(groupId, year);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Crear una calificación
 * - Ahora se asume que el rol 'profesor' crea las calificaciones.
 * - registeredBy se asigna al usuario autenticado si existe.
 */
export const create = async (req, res) => {
  try {
    const data = req.body;

    // Si existe req.user, asignar automáticamente quién registró la nota
    if (req.user) data.registeredBy = req.user._id;

    const created = await service.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Crear múltiples calificaciones (batch)
 * - Operación atómica
 * - Solo accesible para profesores
 */
export const createBatch = async (req, res) => {
  try {
    const created = await service.createBatch(req.body);
    res.status(201).json({
      message: `${created.length} calificaciones creadas correctamente`,
      data: created,
    });
  } catch (err) {
    console.error('❌ Error al crear calificaciones en lote:', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Generar calificaciones finales (cuando se activen períodos)
 */
export const generateFinals = async (req, res) => {
  try {
    const { schoolId, year, groupId } = req.body;
    const results = await service.generateFinals({ schoolId, year, groupId });
    res.json({ count: results.length, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar calificación (solo profesor)
 */
export const update = async (req, res) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Actualizar calificación final (solo profesor)
 */
export const updateFinal = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await service.updateFinal(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
