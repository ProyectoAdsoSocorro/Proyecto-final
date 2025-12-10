import mongoose from 'mongoose';
//falta importar servicio
import { generateShortBulletins } from '../services/bulletin-types/shortbulliten.js';
//import { generateShortBulletins } from '../services/bulletin-types/shortBulletinService.js';

//import { NotaFinalAcumulada } from '../models/NotaFinalAcumulada();


export const getStudentShortBulletin = async (req, res) => {
    try {
       const { estudianteId, periodoId, año } = req.params; // Usé nombres en español por consistencia con la ruta

        /* const studentId = estudianteId;
        const periodId = periodoId; */
        const yearNum = Number(año);
        /* console.log(estudianteId, periodoId, yearNum); */
        // El resto del código ahora es correcto porque llama a la función que acabamos de importar
       const result = await generateShortBulletins({
            students: [estudianteId], 
            periodId: periodoId,
            year: yearNum,
        });

       const { pdfBuffer, fileName } = result; 

        if (!pdfBuffer) {
             return res.status(404).json({ msg: 'No se pudo generar el boletín. Verifique IDs o estado de matrícula.' });
        }

       res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        res.end(pdfBuffer);

    } catch (error) {
      console.error('Error in getStudentShortBulletin:', error);
        res.status(500).json({ msg: 'Internal server error while generating the short bulletin', error: error.message });
    }
};