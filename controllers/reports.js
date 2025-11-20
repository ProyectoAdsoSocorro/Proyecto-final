// IMPORTACIONES NECESARIAS
import Registration from '../models/registration.js';  //Matriculas
import Qualification from '../models/qualifications.js';  //Calificaciones
import Group from '../models/groups.js';  //Grupos
import Period from '../models/period.js';  //Periodos
import Headquarter from '../models/headquarters.js';  //Sedes

/**
 * Calcular el promedio de un estudiante en un período
 * 
 * @param {String} studentId - ID del estudiante
 * @param {String} groupId - ID del grupo
 * @param {String} periodId - ID del período
 * @param {Number} year - Año académico
 * @returns {Number} Promedio del estudiante (0 si no tiene notas)
 */

const calculateStudentAverage = async (studentId, groupId, periodId, year ) => {
    try {
        // 1. Busacr todas las calificaciones del estudiante en ese periodo
        const qualifications = await Qualification.find({
            student: studentId,
            group: groupId,
            period: periodId,
            year: year,
            noteType: 'PERIOD'
        }).populate('subject');

        // DEBUG: Mostrar cuántas calificaciones se encontraron
        console.log(`\n📊 Estudiante ${studentId}:`);
        console.log(`   - Calificaciones encontradas: ${qualifications.length}`);

        if (qualifications.length === 0) {
        console.log(`   ⚠️  No se encontraron calificaciones`);
        return 0;
        }

        // 2. Filtrar solo las materias que se inlcuyen en estadisticas
        const validGrades = qualifications.filter(qual => {
        const hasSubject = qual.subject != null;
        const hasNote = qual.note != null;
        const includeInStats = qual.subject?.includeInStatistics !== false;
        
        console.log(`   - Materia: ${qual.subject?.name || 'N/A'}, Nota: ${qual.note}, Incluye: ${includeInStats}, Activa: ${qual.subject?.active}`);
        
        return hasSubject && hasNote && includeInStats;
        });

    console.log(`   - Notas válidas para promedio: ${validGrades.length}`);

        // 3. Si no tiene notas validas, retornar 0
        if(validGrades.length === 0) {
            return 0;
        }

        // 4. Sumar todas las notas y calcular promedio
        const sumGrades = validGrades.reduce((sum, qual) => sum + qual.note, 0);
        const average = sumGrades / validGrades.length;

        // 5. Redondear a 2 decimales
        return Math.round(average * 100) / 100;

    } catch (error) {
        console.error('Error al calcular el promedio del estudiante:', error);
        throw error;
    }
};

/**
 * Calcular promedios de múltiples estudiantes
 * 
 * @param {Array} registrations - Array de matrículas
 * @param {String} periodId - ID del período
 * @param {Number} year - Año académico
 * @returns {Array} Array de estudiantes con sus promedios
 */

const calculateStudentsAverages = async (registrations, periodId, year) => {
    const studentsWithAverage = [];

    for (let registration of registrations) {
        const average = await calculateStudentAverage(
            registration.student._id,
            registration.group,
            periodId,
            year
        );

        studentsWithAverage.push({
            registrationId: registration._id,
            studentId: registration.student._id,
            average: average
        });
    }

    return studentsWithAverage;
};

/**
 *  Asignar puestos según promedios
 * 
 * @param {Array} studentsWithAverage - Array de estudiantes con promedios
 * @returns {Array} Array de estudiantes con puestos asignados
 */

const assignPositions = (studentsWithAverage) => {
    // Ordenar de mayor a menor promedio
    studentsWithAverage.sort((a, b) => b.average - a.average);

    const studentsWithPositions = [];
    let currentPosition = 1;

    for (let i = 0; i < studentsWithAverage.length; i++) {
        const item = studentsWithAverage[i];

        // Manejar empates: si tiene el mismo promedio que el anterior, mantener el mismo puesto
        if (i > 0 && item.average === studentsWithAverage[i - 1].average) {
            // Mantener el mismo puesto
        } else {
            currentPosition = i + 1;
        }

        studentsWithPositions.push({
            ...item,
            position: currentPosition
        });
    }

    return studentsWithPositions;
};

/**
 * ENDPOINT PRINCIPAL: Calcular estadísticas del grupo
 * Incluye puestos por: GRUPO, SEDE y COLEGIO
 * 
 * GET /api/reportes/estadisticas-grupo/:grupoId
 * 
 * @param {Request} req - Objeto de petición de Express
 * @param {Response} res - Objeto de respuesta de Express
 * @returns {JSON} Estadísticas del grupo con promedio y puesto de cada estudiante
 */

const getStatisticsByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Validación del parámetro
        if(!groupId) {
            return res.status(400).json({
                msg: 'ID de Grupo es obligatorio'
            });
        }

        // 1: Obtener información del grupo
        const group = await Group.findById(groupId).populate('headquarters');

        if (!group) {
            return res.status(404).json({ 
                msg: 'Grupo no encontrado' 
            });
        }

        const year = group.year;
        const headquarterId = group.headquarters._id;
        const schoolId = group.headquarters.school;

        // 2: Obtener el período activo
        const activePeriod = await Period.findOne({
            active: true,
            year: year,
            school: schoolId
        });

        if (!activePeriod) {
            return res.status(404).json({ 
                msg: `No hay un período activo configurado para este año ${year}`
            });
        }

        const periodNumber = activePeriod.number;

        // DEBUG: Mostrar información clave
        console.log('🔍 INFORMACIÓN DE DEBUG:');
        console.log(`   - Grupo ID: ${groupId}`);
        console.log(`   - Año: ${year}`);
        console.log(`   - Período ID: ${activePeriod._id}`);
        console.log(`   - Número de Período: ${periodNumber}`);
        console.log(`   - Colegio ID: ${schoolId}`);
        console.log('---');

        // 3: Calcular puestos por Grupo
        const groupRegistrations = await Registration.find({
            group: groupId,
            year: year,
            state: 'ACTIVO'
        }).populate('student', 'names lastNames documentNumber');

        if (groupRegistrations.length === 0) {
            return res.status(404).json({ 
                msg: 'No hay estudiantes matriculados en este grupo' 
            });
        }

        const groupAverages = await calculateStudentsAverages(
            groupRegistrations,
            activePeriod._id,
            year
        );

        const groupPositions = assignPositions(groupAverages);

        // 4: Calcular puestos por Sede
        const headquartersGroups = await Group.find({
            headquarters: headquarterId,
            year: year,
            isActive: true
        });

        const headquartersGroupIds = headquartersGroups.map(g => g._id);

        // Buscar todas las matriculas de la sede
        const headquartersRegistrations = await Registration.find({
            group: { $in: headquartersGroupIds },
            year: year,
            state: 'ACTIVO'
        }).populate('student');

        const headquartersAverages = await calculateStudentsAverages(
            headquartersRegistrations,
            activePeriod._id,
            year
        );

        const headquartersPositions = assignPositions(headquartersAverages);

        // 5: Calcular puestos por Colegio
        // Buscamos todas las sedes del colegio
        const schoolHeadquarters = await Headquarter.find({
            school: schoolId,
            isActive: true
        });

        const schoolHeraquarterIds = schoolHeadquarters.map(h => h._id);

        // Buscar todos los grupos del colegio
        const schoolGroups = await Group.find({
            headquarters: { $in: schoolHeraquarterIds },
            year: year,
            isActive: true
        });

        const schoolGroupsIds = schoolGroups.map(g => g._id);

        // Buscar todas las matrículas del colegio
        const schoolRegistrations = await Registration.find({
            group: { $in: schoolGroupsIds },
            year: year,
            state: 'ACTIVO'
        }).populate('student');

        const schoolAverages = await calculateStudentsAverages(
            schoolRegistrations,
            activePeriod._id,
            year
        );

        const schoolPositions = assignPositions(schoolAverages);

        // 6: Actualizar Matriculas con todos los puestos
        const results = [];

        for (let groupItem of groupPositions) {
            // Buscar los puestos correspondientes en sede y colegio
            const headquartersItem = headquartersPositions.find( 
                p => p.studentId.toString() === groupItem.studentId.toString()
            );

            const schoolItem = schoolPositions.find(
                p => p.studentId.toString() === groupItem.studentId.toString()
            );

            // Buscar la información del estudiante
            const registration = groupRegistrations.find(
                r => r._id.toString() === groupItem.registrationId.toString()
            );

            // Preparar datos para actualizar
            const updateData = {};

            // Promedio
            updateData[`averagePeriod${periodNumber}`] = groupItem.average;

            // Puesto en Grupo
            updateData[`positionStudentByGroupPeriod${periodNumber}`] = groupItem.position;

            // Puesto por Sede
            if (headquartersItem) {
                updateData[`positionStudentByHeadquarterPeriod${periodNumber}`] = headquartersItem.position;
            }

            // Puesto por Colegio
            if (schoolItem) {
                updateData[`positionStudentBySchoolPeriod${periodNumber}`] = schoolItem.position;
            }

            // Actualizar la matrícula
            await Registration.findByIdAndUpdate(
                groupItem.registrationId,
                updateData
            );

            // Agregar a resultados
            results.push({
                groupPosition: groupItem.position,
                headquarterPosition: headquartersItem ? headquartersItem.position : null,
                schoolPosition: schoolItem ? schoolItem.position : null,
                student: {
                    id: registration.student._id,
                    names: registration.student.names,
                    lastNames: registration.student.lastNames,
                    fullName: `${registration.student.names} ${registration.student.lastNames}`,
                    documentNumber: registration.student.documentNumber
                },
                average: groupItem.average
            });
        }

        // 7: Retornar resultados
        res.json({
            msg: 'Estadísticas calculadas exitosamene',
            group: {
                id: group._id,
                level: group.level,
                grade: group.grade,
                groupIdentifier: group.groupIdentifier,
                session: group.session,
                year: group.year
            },
            headquarters: {
                id: headquarterId,
                name: group.headquarters.name
            },
            school: {
                id: schoolId
            },
            period: {
                id: activePeriod._id,
                number: activePeriod.number,
                name: activePeriod.name,
                startDate: activePeriod.startDate,
                endDate: activePeriod.endDate
            },
            totals: {
                groupStudents: groupRegistrations.length,
                headquarterStudents: headquartersRegistrations.length,
                schoolStudents: schoolRegistrations.length
            },
            statistics: results
        });

    } catch (error) {
        console.error('Error calculando estadísticas del grupo:', error);
        res.status(500).json({
            msg: 'Error del servidor al calcular estadísticas del grupo',
            error: error.message
        });
    }
};
 

   const httpReportStudents =  async (req, res) => {
        try {

            const { schoolyear, schoolId, GroupId } = req.params;

            const registrations  = await Registration.find({

                year: schoolyear,
                school: schoolId,
                group: GroupId,
                state: 'ACTIVO'
            }).populate({
                path: 'student',
                select: 'names lastNames numberDocument' 
            })
             if (registrations.length === 0) {
                return res.status(404).json({ message: "No se encontraron estudiantes para los criterios especificados." });
            }

            //INFORMACION DE LOS ESTUDIANTES DE MATRICULAS 

            const students = registrations.map(registration => registration.student)

            // ORDENAR ALFABETICAMENTE POR APELLIDO Y LUEGO POR NOMBRE
            students.sort((a, b) => {
                const lastNameComparison = a.lastNames.localeCompare(b.lastNames);
                if (lastNameComparison !== 0) {
                    return lastNameComparison;
                }
                return a.names.localeCompare(b.names);  //localeCompare  forma robusta y recomendada para comparar strings, 
            });
            
           res.status(200).json({
                message: `Reporte de estudiantes para el año ${schoolyear}`,
                count: students.length,
                students: students
            });
            
        } catch (error) {
            res.status(500).json({ message: "Error al listar el reporte de estudiantes por grupo", error: error.message });
        }

    };

    
    
       const honorRollsController = async (req, res) => {
            try {
                const { schoolyear, schoolId, periodId } = req.params;
    
                // 1. Validar que los parámetros necesarios están presentes
                if (!schoolyear || !schoolId || !periodId) {
                    return res.status(400).json({ message: "Los parámetros son requeridos." });
                }
    
                // 2. Obtener el número del período a partir de su ID
                const period = await Period.findById(periodId).lean();
                if (!period) {
                    return res.status(404).json({ message: "El período especificado no fue encontrado." });
                }
                const periodNumber = period.number;
    
                // 3. Construir los nombres de los campos dinámicamente
                const averageField = `averagePeriod${periodNumber}`;
                const positionField = `positionStudentByGroupPeriod${periodNumber}`;
    
                // 4. Buscar las matrículas activas que tengan un promedio para ese período
                const registrations = await Registration.find({
                    year: schoolyear,
                    school: schoolId,
                    state: 'ACTIVO',
                    [averageField]: { $exists: true, $ne: null } // Asegurarse de que el promedio exista
                }).populate({
                    path: 'student',
                    select: 'names lastNames numberDocument'
                }).populate('group', 'grade groupIdentifier')
                  .lean(); //lean() para obtener objetos JS planos y mejorar el rendimiento
    
                if (registrations.length === 0) {
                    return res.status(404).json({ message: "No se encontraron estudiantes con promedios para los criterios especificados." });
                }
    
                // 5. Ordenar los resultados por promedio de mayor a menor
                registrations.sort((a, b) => b[averageField] - a[averageField]);
    
                // 6. Mapear los resultados para dar una respuesta limpia
                const honorRoll = registrations.map(reg => ({
                    student: {
                        names: reg.student.names,
                        lastNames: reg.student.lastNames,
                        numberDocument: reg.student.numberDocument
                    },
                    group: reg.group ? `${reg.group.grade}°${reg.group.groupIdentifier}` : 'Grupo no asignado',
                    average: reg[averageField],
                    position: reg[positionField]
                }));
    
                res.status(200).json({
                    message: `Cuadro de honor para el período ${period.name} del año ${schoolyear}`,
                    count: honorRoll.length,
                    honorRoll: honorRoll
                });
    
            } catch (error) {
                res.status(500).json({ message: "Error al obtener el cuadro de honor", error: error.message });
            }
        }
    

export default {
    getStatisticsByGroup,
    httpReportStudents,
    honorRollsController
};