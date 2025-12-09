import Matricula from '../models/registration.js';
import Calificacion from '../models/qualifications.js';
import Vigencia from '../models/validity.js';
import Indicador from '../models/indicators.js';
import Grupo from '../models/groups.js';
import Colegio from '../models/schools.js';
import Sede from '../models/headquarters.js';
import usuariosColegio from '../models/users.js';   


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

export default {
    getBaseInfo,
    getCalificaciones
};