/**
 * --------------------------------------------------
 * Controlador de Boletines
 * --------------------------------------------------
 * Gestiona la generación de boletines académicos:
 * - Boletín corto y largo (por estudiante y grupo)
 * - Boletines finales (por estudiante y grupo)
 * 
 * Incluye:
 * - Calificaciones
 * - Indicadores (para boletín largo)
 * - Promedio y puesto dentro del grupo
 */

import Matricula from '../models/registration.js';
import Calificacion from '../models/qualifications.js';
import Vigencia from '../models/validity.js';
import Usuario from '../models/users.js';
import Indicador from '../models/indicators.js';
import Grupo from '../models/groups.js';

/**
 * Descripción: Controlador encargado de consolidar los datos académicos
 * para generar los boletines (corto y largo, por estudiante o grupo).
 */

/**
 * Helper: obtener información base de estudiante, grupo, vigencia, etc.
 */
const getBaseInfo = async (estudianteId, año) => {
  const matricula = await Matricula.findOne({ estudiante: estudianteId, año })
    .populate('grupo')
    .populate('colegio')
    .populate('acudiente.ObjectId', 'nombres apellidos email telefono')
    .lean();

  const vigencia = await Vigencia.findOne({ año }).lean();

  if (!matricula) throw new Error('No se encontró matrícula para el estudiante.');
  if (!vigencia) throw new Error('No se encontró vigencia para el año.');

  return { matricula, vigencia };
};

/**
 * Helper: obtener calificaciones con o sin indicadores
 */
const getCalificaciones = async (estudianteId, periodoId, año, includeIndicadores = false) => {
  const calificaciones = await Calificacion.find({
    estudiante: estudianteId,
    año,
    tipoNota: 'PERIODO',
    periodo: periodoId
  })
    .populate('materia', 'nombre codigo')
    .populate('grupo', 'nombre grado grupo')
    .populate('registradoPor', 'nombres apellidos')
    .lean();

  if (includeIndicadores) {
    const indicadores = await Indicador.find({ año, periodo: periodoId, grupo: calificaciones[0]?.grupo?._id })
      .populate('materia', 'nombre')
      .lean();
    return { calificaciones, indicadores };
  }

  return { calificaciones };
};

/**
 * Boletín corto por estudiante
 */
export const listShortByStudent = async (req, res) => {
  try {
    const { estudianteId, periodoId, año } = req.params;

    const { matricula, vigencia } = await getBaseInfo(estudianteId, año);
    const { calificaciones } = await getCalificaciones(estudianteId, periodoId, año);

    res.status(200).json({
      tipo: 'boletin-corto',
      estudiante: matricula.estudiante,
      grupo: matricula.grupo,
      colegio: matricula.colegio,
      año: vigencia.año,
      calificaciones
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Boletín largo por estudiante (incluye indicadores)
 */
export const listLongByStudent = async (req, res) => {
  try {
    const { estudianteId, periodoId, año } = req.params;

    const { matricula, vigencia } = await getBaseInfo(estudianteId, año);
    const { calificaciones, indicadores } = await getCalificaciones(estudianteId, periodoId, año, true);

    res.status(200).json({
      tipo: 'boletin-largo',
      estudiante: matricula.estudiante,
      grupo: matricula.grupo,
      colegio: matricula.colegio,
      año: vigencia.año,
      calificaciones,
      indicadores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Boletín corto por grupo
 */
export const listShortByGroup = async (req, res) => {
  try {
    const { grupoId, periodoId, año } = req.params;

    const grupo = await Grupo.findById(grupoId).populate('directorGrupo', 'nombres apellidos').lean();
    if (!grupo) throw new Error('Grupo no encontrado');

    const estudiantes = await Matricula.find({ grupo: grupoId, año })
      .populate('estudiante', 'nombres apellidos')
      .lean();

    const boletines = [];

    for (const mat of estudiantes) {
      const { calificaciones } = await getCalificaciones(mat.estudiante._id, periodoId, año);
      boletines.push({
        estudiante: mat.estudiante,
        grupo,
        calificaciones
      });
    }

    res.status(200).json({ tipo: 'boletin-corto-grupo', año, grupo, boletines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Boletín largo por grupo (con indicadores)
 */
export const listLongByGroup = async (req, res) => {
  try {
    const { grupoId, periodoId, año } = req.params;

    const grupo = await Grupo.findById(grupoId).lean();
    const estudiantes = await Matricula.find({ grupo: grupoId, año })
      .populate('estudiante', 'nombres apellidos')
      .lean();

    const boletines = [];

    for (const mat of estudiantes) {
      const { calificaciones, indicadores } = await getCalificaciones(mat.estudiante._id, periodoId, año, true);
      boletines.push({
        estudiante: mat.estudiante,
        grupo,
        calificaciones,
        indicadores
      });
    }

    res.status(200).json({ tipo: 'boletin-largo-grupo', año, grupo, boletines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Boletín corto por estudiante (notas finales)
 */
export const listShortFinalsByStudent = async (req, res) => {
  try {
    const { estudianteId, año } = req.params;

    const { matricula, vigencia } = await getBaseInfo(estudianteId, año);
    const calificaciones = await Calificacion.find({
      estudiante: estudianteId,
      año,
      tipoNota: 'FINAL'
    })
      .populate('materia', 'nombre codigo')
      .lean();

    res.status(200).json({
      tipo: 'boletin-final-corto',
      estudiante: matricula.estudiante,
      grupo: matricula.grupo,
      colegio: matricula.colegio,
      año: vigencia.año,
      calificaciones
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Boletín largo por estudiante (notas finales + indicadores)
 */
export const listLongFinalsByStudent = async (req, res) => {
  try {
    const { estudianteId, año } = req.params;

    const { matricula, vigencia } = await getBaseInfo(estudianteId, año);
    const calificaciones = await Calificacion.find({
      estudiante: estudianteId,
      año,
      tipoNota: 'FINAL'
    })
      .populate('materia', 'nombre codigo')
      .lean();

    const indicadores = await Indicador.find({ año, grupo: matricula.grupo?._id }).lean();

    res.status(200).json({
      tipo: 'boletin-final-largo',
      estudiante: matricula.estudiante,
      grupo: matricula.grupo,
      colegio: matricula.colegio,
      año: vigencia.año,
      calificaciones,
      indicadores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Boletín corto por grupo (notas finales)
 */
export const listShortFinalsByGroup = async (req, res) => {
  try {
    const { grupoId, año } = req.params;

    const grupo = await Grupo.findById(grupoId).lean();
    const estudiantes = await Matricula.find({ grupo: grupoId, año })
      .populate('estudiante', 'nombres apellidos')
      .lean();

    const boletines = [];

    for (const mat of estudiantes) {
      const calificaciones = await Calificacion.find({
        estudiante: mat.estudiante._id,
        año,
        tipoNota: 'FINAL'
      })
        .populate('materia', 'nombre codigo')
        .lean();

      boletines.push({
        estudiante: mat.estudiante,
        grupo,
        calificaciones
      });
    }

    res.status(200).json({ tipo: 'boletin-final-corto-grupo', año, grupo, boletines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Boletín largo por grupo (notas finales + indicadores)
 */
export const listLongFinalsByGroup = async (req, res) => {
  try {
    const { grupoId, año } = req.params;

    const grupo = await Grupo.findById(grupoId).lean();
    const estudiantes = await Matricula.find({ grupo: grupoId, año })
      .populate('estudiante', 'nombres apellidos')
      .lean();

    const boletines = [];

    for (const mat of estudiantes) {
      const calificaciones = await Calificacion.find({
        estudiante: mat.estudiante._id,
        año,
        tipoNota: 'FINAL'
      })
        .populate('materia', 'nombre codigo')
        .lean();

      const indicadores = await Indicador.find({ año, grupo: grupoId }).lean();

      boletines.push({
        estudiante: mat.estudiante,
        grupo,
        calificaciones,
        indicadores
      });
    }

    res.status(200).json({ tipo: 'boletin-final-largo-grupo', año, grupo, boletines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
