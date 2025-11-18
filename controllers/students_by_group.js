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

    },

}

export default httpReportStudents;
