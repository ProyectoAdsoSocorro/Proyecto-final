import Registration from '../models/registration.js';


 const httpReportStudents = {

    getstudent: async (req, res) => {
        try {

            const { schoolyear, schoolId, GroupId } = req.params;

            const registrations  = await Registration.find({

                year: schoolyear,
                school: schoolId,
                group: GroupId,
                state: 'ACTIVO'
            }).populate({
                path: 'student',
                select: 'firstName lastName documentOfNumber'
            })
             if (registrations.length === 0) {
                return res.status(404).json({ message: "No se encontraron estudiantes para los criterios especificados." });
            }

            //EXTRAEMOS LA INFORMACION DE LOS ESTUDIANTES DE MATRICULAS 

            const students = registrations.map(registration => registration.student)

            
            
           res.status(200).json({
                message: `Reporte de estudiantes para el año ${schoolyear}`,
                count: students.length,
                students: students
            });
            
        } catch (error) {
            res.status(500).json({ message: "Error al listar el reporte de estudiantes por grupo", error: error.message });
        }

    },

}

export default httpReportStudents;
