/**
 * --------------------------------------------------
 * Capa de servicio para la gestión de calificaciones.
 * Incluye:
 * - Calificaciones parciales (Qualification)
 * - Calificaciones finales (FinalQualification)
 * --------------------------------------------------
 */

import mongoose from 'mongoose';
import Qualification from '../models/qualifications.js';
import FinalQualification from '../models/finalQualifications.js';
import Period from '../models/period.js';

/* ============================================================
   CREAR CALIFICACIÓN
   ============================================================ */
export const create = async (data) => {
  // Verificación para evitar duplicados
  if (data.period) {
    const existing = await Qualification.findOne({
      student: data.student,
      subject: data.subject,
      period: data.period,
      year: data.year
    });
    if (existing) {
      throw new Error(`Ya existe una calificación para este estudiante en la materia y período seleccionados.`);
    }
  }
  return Qualification.create(data);
};

/* ============================================================
   CREAR CALIFICACIONES EN LOTE (TRANSACCIÓN)
   ============================================================ */
export const createBatch = async (dataArray) => {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error('Debe enviar un array de calificaciones');
  }

  // Verificación previa para el lote completo
  for (const item of dataArray) {
    if (item.period) {
      const existing = await Qualification.findOne({
        student: item.student,
        subject: item.subject,
        period: item.period,
        year: item.year
      });
      if (existing) {
        throw new Error(`Error en el lote: Ya existe una calificación para el estudiante ${item.student} en la materia ${item.subject} y período ${item.period}.`);
      }
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const created = await Qualification.insertMany(dataArray, { session });
    await session.commitTransaction();
    return created;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/* ============================================================
   GENERAR CALIFICACIONES FINALES
   ============================================================ */
export const generateFinals = async ({ schoolId = null, year, groupId = null }) => {
  if (!year) throw new Error("El campo 'year' es obligatorio.");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Obtener todos los periodos del año y la escuela en una sola consulta
    const periodFilter = { year };
    if (schoolId) periodFilter.school = schoolId;
    const allPeriods = await Period.find(periodFilter).lean().session(session);
    if (!allPeriods.length) {
      await session.commitTransaction();
      return []; // No hay periodos, no se puede calcular nada.
    }

    // 2. Filtrar notas parciales
    const filter = { year, noteType: 'PERIOD' }; // Solo nos interesan las notas de período para calcular finales
    if (schoolId) filter.school = schoolId;
    if (groupId) filter.group = groupId;

    const qualifications = await Qualification.find(filter)
      .populate('student subject period')
      .session(session);

    if (!qualifications.length) {
      await session.commitTransaction(); // No hay error, solo no hay datos. Se commitea la transacción vacía.
      session.endSession();
      return []; // Se retorna un array vacío, que es el comportamiento esperado.
    }

    // 3. Agrupar por estudiante + materia
    const grouped = {};
    for (const q of qualifications) {
      if (!q.student || !q.subject) continue;

      const key = `${q.student._id}-${q.subject._id}`;
      if (!grouped[key]) {
        grouped[key] = {
          student: q.student,
          school: q.school, // Guardamos la escuela desde la calificación
          subject: q.subject,
          grades: []
        };
      }
      grouped[key].grades.push(q);
    }

    const results = [];

    for (const key in grouped) {
      const { student, subject, school, grades } = grouped[key];

      // Filtrar los periodos relevantes para la escuela del estudiante actual de la lista que ya tenemos
      const schoolPeriods = allPeriods.filter(p => p.school.toString() === school.toString());
      if (!schoolPeriods.length) continue;

      // Seleccionar solo los periodos (de esa escuela) que tienen calificación
      const periodsWithGrades = schoolPeriods.filter(p =>
        grades.some(g => g.period?._id.toString() === p._id.toString())
      );
      if (!periodsWithGrades.length) continue; // saltar si no hay notas

      // Ajustar porcentaje proporcional
      const totalPercentage = periodsWithGrades.reduce((sum, p) => sum + p.percentage, 0);
      
      // Si el porcentaje total es 0, no se puede calcular la nota. Evita división por cero.
      if (totalPercentage === 0) continue;

      // Calcular nota final ponderada
      let total = 0;
      periodsWithGrades.forEach(p => {
        const g = grades.find(x => x.period?._id.toString() === p._id.toString());
        if (g && typeof g.note === 'number') { // Usamos 'note' y añadimos una guarda
          total += g.note * (p.percentage / totalPercentage);
        }
      });

      const finalNote = Number(total.toFixed(2)); // Usamos 'finalNote'

      // Calcular ausencias y juicio valorativo final
      const totalAbsences = grades.reduce((sum, g) => sum + (g.absences || 0), 0);
      const finalEvaluativeJudgment = grades.map(g => g.evaluativeJudgment).filter(Boolean).join('; ');

      // Crear o actualizar final
      let final = await FinalQualification.findOne({
        student: student._id,
        subject: subject._id,
        year, // Usar el grupo de la calificación actual para la búsqueda
        group: grades[0].group
      }).session(session);

      if (final) {
        final.finalNote = finalNote;
        final.totalAbsences = totalAbsences;
        final.finalEvaluativeJudgment = finalEvaluativeJudgment || final.finalEvaluativeJudgment;
        final.calculatedAt = new Date();
        final.school = school;
        await final.save({ session });
      } else {
        final = await FinalQualification.create([{
          student: student._id,
          subject: subject._id,
          year,
          group: grades[0].group,
          school: school,
          finalNote,
          totalAbsences,
          finalEvaluativeJudgment,
          calculatedAt: new Date()
        }], { session });
        final = final[0];
      }

      results.push(final);
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

/* ============================================================
   ACTUALIZAR CALIFICACIÓN
   ============================================================ */
export const update = (id, changes) => {
  return Qualification.findByIdAndUpdate(id, changes, { new: true });
};

/* ============================================================
   OBTENER CALIFICACIÓN POR ID
   ============================================================ */
export const getById = (id) => {
  return Qualification.findById(id)
    .populate('student subject period group school registeredBy');
};

/* ============================================================
   LISTAR CALIFICACIONES POR ESTUDIANTE
   ============================================================ */
export const listByStudent = (studentId, year) => {
  const q = { student: studentId };
  if (year) q.year = year;

  return Qualification.find(q)
    .populate('subject period group school')
    .sort({ year: -1 });
};

/* ============================================================
   LISTAR CALIFICACIONES POR GRUPO
   ============================================================ */
export const listByGroup = (groupId, year) => {
  const q = { group: groupId };
  if (year) q.year = year;

  return Qualification.find(q)
    .populate('student subject period')
    .sort({ student: 1 });
};

/* ============================================================
   LISTAR POR GRUPO Y MATERIA
   ============================================================ */
export const listByGroupAndSubject = (groupId, subjectId, year) => {
  const q = { group: groupId, subject: subjectId };
  if (year) q.year = year;

  return Qualification.find(q)
    .populate('student subject period group school')
    .sort({ student: 1 });
};

/* ============================================================
   LISTAR CALIFICACIONES FINALES POR AÑO
   ============================================================ */
export const listFinalsByYear = (year) => {
  return FinalQualification.find({ year })
    .populate('student subject group school')
    .sort({ group: 1, student: 1 });
};

/* ============================================================
   LISTAR FINALES POR ESTUDIANTE
   ============================================================ */
export const listFinalsByStudent = (studentId, year) => {
  const q = { student: studentId };
  if (year) q.year = year;

  return FinalQualification.find(q)
    .populate('subject group school')
    .sort({ year: -1 });
};

/* ============================================================
   LISTAR FINALES POR GRUPO
   ============================================================ */
export const listFinalsByGroup = (groupId, year) => {
  const q = { group: groupId };
  if (year) q.year = year;

  return FinalQualification.find(q)
    .populate('student subject school')
    .sort({ student: 1 });
};

/* ============================================================
   ACTUALIZAR CALIFICACIÓN FINAL
   ============================================================ */
export const updateFinal = (id, changes) => {
  return FinalQualification.findByIdAndUpdate(id, changes, { new: true });
};
