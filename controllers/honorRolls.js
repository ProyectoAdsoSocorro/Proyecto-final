import Registration from '../models/registration.js';
import Period from '../models/period.js';

const honorRollsController = {

    getHonorRolls: async (req, res) => {
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
                group: `${reg.group.grade}°${reg.group.groupIdentifier}`,
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
};

export default honorRollsController;