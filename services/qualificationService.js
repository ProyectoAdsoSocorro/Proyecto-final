/**
 * --------------------------------------------------
 * Capa de servicio para la gestión de calificaciones.
 * Implementa toda la lógica de negocio relacionada con:
 * - Creación y actualización de calificaciones
 * - Consultas filtradas por estudiante, grupo, materia
 * - Generación automática de calificaciones finales
 * - Manejo de transacciones para operaciones múltiples
 */

import Qualification from '../models/qualifications.js';
// Modelos comentados hasta implementar la generación de finales
// import Period from '../models/period.js';
// import AcademicLoad from '../models/academicLoad.js';
// import Subject from '../models/subject.js';
import mongoose from 'mongoose';

/**
 * Crea una nueva calificación
 * @param {Object} data - Datos de la calificación según modelo
 * @returns {Promise<Object>} Calificación creada
 */
export const create = async (data) => {
  const created = await Qualification.create(data);
  return created;
};

/**
 * Crea múltiples calificaciones en una sola transacción
 * Si falla alguna inserción, se revierten todas (rollback)
 * @param {Array} qualificationsArray - Array de objetos calificación
 * @returns {Promise<Array>} Calificaciones creadas
 */
export const createBatch = async (dataArray) => {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error('Debe enviar un array de calificaciones');
  }
  // Verifica si todas las calificaciones tienen los campos mínimos requeridos
  dataArray.forEach((item, index) => {
    if (!item.school || !item.student || !item.subject || !item.year) {
      throw new Error(`Faltan campos requeridos en la calificación #${index + 1}`);
    }
  });
  // Usa insertMany para crear todas en una sola operación
  const created = await Qualification.insertMany(dataArray, { ordered: true });
  return created;
};

/**
 * Genera calificaciones finales automáticamente para un año y (opcionalmente) grupo o colegio.
 * 
 * Estrategia:
 * 1. Busca todas las calificaciones tipo PERIOD para cada estudiante+materia
 * 2. Calcula el promedio simple de todas las notas de período
 * 3. Crea/actualiza la calificación final con ese promedio
 * 
 * @param {Object} params - Parámetros de generación
 * @param {string} params.schoolId - ID del colegio
 * @param {number} params.year - Año académico
 * @param {string} [params.groupId] - ID del grupo (opcional)
 * @returns {Promise<Array>} Calificaciones finales generadas
 */
export const generateFinals = async ({ schoolId, year, groupId = null }) => {
  // 1) Validar parámetros
  if (!schoolId || !year) {
    throw new Error('schoolId y year son requeridos');
  }

  // 2) Buscar calificaciones tipo PERIOD para el año y filtros
  const match = { year, gradeType: 'PERIOD', school: schoolId };
  if (groupId) match.group = groupId;

  const periodGrades = await Qualification.find(match)
    .select('student subject period grade group')
    .lean();

  if (periodGrades.length === 0) {
    return [];
  }

  // 3) Agrupar por estudiante + materia y calcular promedio
  const grouping = {};
  for (const g of periodGrades) {
    const key = `${g.student}_${g.subject}`;
    if (!grouping[key]) {
      grouping[key] = { 
        student: g.student, 
        subject: g.subject, 
        group: g.group,
        grades: [],
        sumGrades: 0,
        count: 0 
      };
    }
    grouping[key].grades.push(g.grade ?? 0);
    grouping[key].sumGrades += (g.grade ?? 0);
    grouping[key].count += 1;
  }

  // 4) Crear/actualizar calificaciones tipo FINAL
  const results = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    for (const key of Object.keys(grouping)) {
      const item = grouping[key];
      // Calcular promedio simple
      const finalGrade = item.count > 0 ? item.sumGrades / item.count : 0;
      
      const finalObj = {
        school: schoolId,
        student: item.student,
        subject: item.subject,
        group: item.group || null, 
        period: null,
        year,
        gradeType: 'FINAL',
        grade: Number(finalGrade.toFixed(2)),
        evaluativeJudgment: '',
        registrationDate: new Date(),
      };
     
      const filter = { 
        student: item.student, 
        subject: item.subject, 
        year, 
        gradeType: 'FINAL', 
        school: schoolId 
      };
      
      const updated = await Qualification.findOneAndUpdate(
        filter, 
        finalObj, 
        { upsert: true, new: true, session, setDefaultsOnInsert: true }
      );
      
      results.push(updated);
    }
    
    await session.commitTransaction();
    session.endSession();
    return results;
    
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/**
 * Actualiza una calificación existente
 * @param {string} id - ID de la calificación
 * @param {Object} changes - Cambios a aplicar
 * @returns {Promise<Object>} Calificación actualizada
 */
export const update = async (id, changes) => {
  return Qualification.findByIdAndUpdate(id, changes, { new: true });
};

/**
 * Obtiene una calificación por su ID
 * Incluye población de referencias:
 * - estudiante (student)
 * - materia (subject)
 * - período (period)
 * - registrado por (registeredBy)
 * - grupo (group)
 * - colegio (school)
 * @param {string} id - ID de la calificación
 * @returns {Promise<Object>} Calificación con referencias pobladas
 */
export const getById = async (id) => {
  return Qualification.findById(id).populate('student subject period registeredBy group school');
};

/**
 * Lista calificaciones de un estudiante, opcionalmente filtradas por año
 * @param {string} studentId - ID del estudiante
 * @param {number} [year] - Año académico (opcional)
 * @returns {Promise<Array>} Calificaciones ordenadas por año y tipo, incluye:
 * - materia (subject)
 * - período (period)
 * - grupo (group)
 * - colegio (school)
 */
export const listByStudent = async (studentId, year) => {
  const q = { student: studentId };
  if (year) q.year = year;
  return Qualification.find(q).populate('subject period group school').sort({ year: -1, gradeType: 1 });
};

/**
 * Lista calificaciones de un grupo, opcionalmente filtradas por año
 * @param {string} groupId - ID del grupo
 * @param {number} [year] - Año académico (opcional)
 * @returns {Promise<Array>} Calificaciones ordenadas por materia, incluye:
 * - estudiante (student)
 * - materia (subject) 
 * - período (period)
 */
export const listByGroup = async (groupId, year) => {
  const q = { group: groupId };
  if (year) q.year = year;
  return Qualification.find(q).populate('student subject period').sort({ 'subject': 1 });
};

/**
 * Lista calificaciones de un grupo en una materia específica
 * @param {string} groupId - ID del grupo
 * @param {string} subjectId - ID de la materia
 * @param {number} [year] - Año académico (opcional)
 * @returns {Promise<Array>} Calificaciones ordenadas por estudiante, incluye:
 * - estudiante (student)
 * - materia (subject)
 * - período (period)
 * - grupo (group)
 * - colegio (school)
 */
export const listByGroupAndSubject = async (groupId, subjectId, year) => {
  const query = { group: groupId, subject: subjectId };
  if (year) query.year = year;
  return Qualification.find(query)
    .populate('student subject period group school')
    .sort({ 'student': 1 });
};

/**
 * Lista todas las calificaciones finales de un año específico
 * @param {number} year - Año académico
 * @returns {Promise<Array>} Calificaciones finales ordenadas por grupo y estudiante, incluye:
 * - estudiante (student)
 * - materia (subject)
 * - grupo (group)
 * - colegio (school)
 */
export const listFinalsByYear = async (year) => {
  return Qualification.find({ year, gradeType: 'FINAL' })
    .populate('student subject group school')
    .sort({ group: 1, student: 1 });
};

/**
 * Lista calificaciones finales de un estudiante
 * @param {string} studentId - ID del estudiante
 * @param {number} [year] - Año académico (opcional)
 * @returns {Promise<Array>} Calificaciones finales ordenadas por año, incluye:
 * - materia (subject)
 * - grupo (group)
 * - colegio (school)
 */
export const listFinalsByStudent = async (studentId, year) => {
  const q = { student: studentId, gradeType: 'FINAL' };
  if (year) q.year = year;
  return Qualification.find(q)
    .populate('subject group school')
    .sort({ year: -1 });
};

/**
 * Lista calificaciones finales de un grupo
 * @param {string} groupId - ID del grupo
 * @param {number} [year] - Año académico (opcional)
 * @returns {Promise<Array>} Calificaciones finales ordenadas por estudiante, incluye:
 * - estudiante (student)
 * - materia (subject)
 * - colegio (school)
 */
export const listFinalsByGroup = async (groupId, year) => {
  const q = { group: groupId, gradeType: 'FINAL' };
  if (year) q.year = year;
  return Qualification.find(q)
    .populate('student subject school')
    .sort({ 'student': 1 });
};

/**
 * Actualiza una calificación final
 * Verifica que sea de tipo FINAL antes de actualizar
 * @param {string} id - ID de la calificación final
 * @param {Object} changes - Cambios a aplicar
 * @returns {Promise<Object>} Calificación final actualizada
 */
export const updateFinal = async (id, changes) => {
  return Qualification.findOneAndUpdate(
    { _id: id, gradeType: 'FINAL' },
    changes,
    { new: true }
  );
};
