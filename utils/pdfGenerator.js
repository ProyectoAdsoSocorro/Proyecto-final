import PDFDocument from 'pdfkit';

import { drawShortBulletin } from '../services/pdfs-drawings/boletinCortodraw.js'; // (Para boletín corto)
// import { drawLongBulletin } from '../services/bulletin-types/boletinLargodraw.js'; // (Para boletín largo)

export const generatePDF = (dataList, bulletinType) => {

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'LETTER',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });
            
            const buffers = [];

            // Capturar los datos del stream PDF
            doc.on('data', buffers.push.bind(buffers));
            
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            let firstPage = true;

            // Iterar sobre todos los estudiantes/boletines
            dataList.forEach((bulletinData) => {
                
                // Agregar un salto de página si no es el primer estudiante
                if (!firstPage) {
                    doc.addPage();
                }

                // Llamar a la función de dibujo correcta
                if (bulletinType === 'short') {
                    drawShortBulletin(doc, bulletinData);
                } else if (bulletinType === 'long') {
                } else {
                    doc.fontSize(16).text(`Tipo de boletín desconocido: ${bulletinType}`, 50, 200);
                }

                firstPage = false;
            });

            doc.end();

        } catch (error) {
            console.error('Error en la generación del PDF:', error);
            reject(error);
        }
    });
};