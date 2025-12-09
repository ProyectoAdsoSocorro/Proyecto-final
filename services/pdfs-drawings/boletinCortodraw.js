// La función recibe la instancia del documento (doc) y los datos (bulletinData)
// Las variables internas están en inglés para consistencia de código,
// pero el texto que se dibuja en el PDF se mantiene en español.
export function drawShortBulletin(doc, bulletinData) {
    
    // Desestructuración de los datos utilizando los nuevos nombres en inglés
    const { header, detailedTable, summary, context } = bulletinData;

    // --- 1. DESIGN CONSTANTS (pdfkit coordinates) ---
    const MARGIN_LEFT = 50;
    const MARGIN_RIGHT = 550;
    const DOC_WIDTH = MARGIN_RIGHT - MARGIN_LEFT;
    
    // X coordinates for table columns (adjusted for 'pdfkit')
    const COL_WIDTHS = [0.35, 0.05, 0.08, 0.08, 0.08, 0.08, 0.15, 0.13]; // Percentages
    let xArea = MARGIN_LEFT;
    let xAbsences = xArea + (DOC_WIDTH * COL_WIDTHS[0]);
    let xP1 = xAbsences + (DOC_WIDTH * COL_WIDTHS[1]);
    let xP2 = xP1 + (DOC_WIDTH * COL_WIDTHS[2]);
    let xP3 = xP2 + (DOC_WIDTH * COL_WIDTHS[3]);
    let xP4 = xP3 + (DOC_WIDTH * COL_WIDTHS[4]);
    let xFN = xP4 + (DOC_WIDTH * COL_WIDTHS[5]);
    let xLEVEL = xFN + (DOC_WIDTH * COL_WIDTHS[6]);
    
    const X_POSITIONS = [xArea, xAbsences, xP1, xP2, xP3, xP4, xFN, xLEVEL]; // Unused, but for reference
    const COL_SPACING = [
        (DOC_WIDTH * COL_WIDTHS[0]), 
        (DOC_WIDTH * COL_WIDTHS[1]), 
        (DOC_WIDTH * COL_WIDTHS[2]), 
        (DOC_WIDTH * COL_WIDTHS[3]), 
        (DOC_WIDTH * COL_WIDTHS[4]), 
        (DOC_WIDTH * COL_WIDTHS[5]), 
        (DOC_WIDTH * COL_WIDTHS[6]), 
        (DOC_WIDTH * COL_WIDTHS[7])
    ];

    const H_PADDING = 5; // Internal cell padding height

    // Helper function to check and add page break
    const checkPageBreak = (spaceNeeded = 30) => {
        if (doc.y > 750 - spaceNeeded) {
            doc.addPage();
            doc.y = 50; // Reset Y after break
        }
    };
    
    // --- 2. HEADER AND TITLES ---
    
    // Institution Titles
    doc.font('Helvetica-Bold').fontSize(13)
        .text(context.institution.name, MARGIN_LEFT, doc.y, { align: 'center', width: DOC_WIDTH });
    
    doc.fontSize(10)
        .text(context.institution.title, { align: 'center', width: DOC_WIDTH });
    doc.moveDown(0.2);

    // Separator line
    doc.lineWidth(1).lineCap('butt')
        .moveTo(MARGIN_LEFT, doc.y)
        .lineTo(MARGIN_RIGHT, doc.y)
        .stroke();
    doc.moveDown(0.5);

    // Student Info (using translated 'header' properties)
    doc.font('Helvetica');
    const yInfo = doc.y;
    doc.fontSize(9)
        .text(`Estudiante: ${header.studentName}`, MARGIN_LEFT, yInfo, { continued: true, width: DOC_WIDTH / 2 })
        .text(`Grado: ${header.groupName}`, MARGIN_LEFT + DOC_WIDTH / 2, yInfo, { width: DOC_WIDTH / 2, align: 'right' });
    
    doc.y = doc.y + doc.currentLineHeight() + 2; // Ensure the next line
    
    doc.fontSize(9)
        .text(`Documento: ${header.studentDocument}`, MARGIN_LEFT, doc.y, { continued: true, width: DOC_WIDTH / 2 })
        .text(`Periodo: ${header.currentPeriodName}`, MARGIN_LEFT + DOC_WIDTH / 2, doc.y, { width: DOC_WIDTH / 2, align: 'right' });
    doc.moveDown(1);
    
    // Table Title
    doc.font('Helvetica-Bold').fontSize(10)
        .text('CUADRO DE CALIFICACIONES POR PERIODOS', { align: 'center' }); // Text in Spanish
    doc.moveDown(0.5);

    // --- 3. QUALIFICATION TABLE (Manual Drawing) ---
    // Headers kept in Spanish for the final PDF output
    const tableHeaders = ['AREA', 'F', 'NOTA PERIODO', 'NF', 'NIVEL'];
    const subHeaders = ['', '', '1 Per', '2 Per', '3 Per', '4 Per', '', '']; 
    const yStartTable = doc.y;
    let currentY = yStartTable;

    // A. DRAW TABLE HEADERS (ROW 1)
    doc.lineWidth(1).lineCap('butt');
    
    // AREA Column
    doc.fillColor('#EEEEEE').rect(xArea, currentY, COL_SPACING[0], H_PADDING * 2 + 10).fill().fillColor('black'); // Grey background
    doc.text(tableHeaders[0], xArea + 2, currentY + H_PADDING, { width: COL_SPACING[0] - 4, align: 'left', height: 10, bold: true });

    // F Column (Absences)
    doc.fillColor('#EEEEEE').rect(xAbsences, currentY, COL_SPACING[1], H_PADDING * 2 + 10).fill().fillColor('black');
    doc.text(tableHeaders[1], xAbsences, currentY + H_PADDING, { width: COL_SPACING[1], align: 'center', height: 10, bold: true });

    // NOTA PERIODO Column (ColSpan: 4)
    doc.fillColor('#EEEEEE').rect(xP1, currentY, COL_SPACING[2] + COL_SPACING[3] + COL_SPACING[4] + COL_SPACING[5], H_PADDING + 5).fill().fillColor('black');
    doc.text(tableHeaders[2], xP1, currentY + 2, { width: COL_SPACING[2] + COL_SPACING[3] + COL_SPACING[4] + COL_SPACING[5], align: 'center', height: 10, bold: true });
    
    // NF Column (Final Note)
    doc.fillColor('#EEEEEE').rect(xFN, currentY, COL_SPACING[6], H_PADDING * 2 + 10).fill().fillColor('black');
    doc.text(tableHeaders[3], xFN, currentY + H_PADDING, { width: COL_SPACING[6], align: 'center', height: 10, bold: true });
    
    // NIVEL Column (Level)
    doc.fillColor('#EEEEEE').rect(xLEVEL, currentY, COL_SPACING[7], H_PADDING * 2 + 10).fill().fillColor('black');
    doc.text(tableHeaders[4], xLEVEL, currentY + H_PADDING, { width: COL_SPACING[7], align: 'center', height: 10, bold: true });
    
    currentY += H_PADDING + 5; // Next row (Sub-headers)

    // B. DRAW SUB-HEADERS (ROW 2)
    doc.fillColor('#EEEEEE').rect(xP1, currentY, COL_SPACING[2], H_PADDING + 5).fill().fillColor('black');
    doc.text(subHeaders[2], xP1, currentY + 2, { width: COL_SPACING[2], align: 'center', bold: true });
    
    doc.fillColor('#EEEEEE').rect(xP2, currentY, COL_SPACING[3], H_PADDING + 5).fill().fillColor('black');
    doc.text(subHeaders[3], xP2, currentY + 2, { width: COL_SPACING[3], align: 'center', bold: true });

    doc.fillColor('#EEEEEE').rect(xP3, currentY, COL_SPACING[4], H_PADDING + 5).fill().fillColor('black');
    doc.text(subHeaders[4], xP3, currentY + 2, { width: COL_SPACING[4], align: 'center', bold: true });

    doc.fillColor('#EEEEEE').rect(xP4, currentY, COL_SPACING[5], H_PADDING + 5).fill().fillColor('black');
    doc.text(subHeaders[5], xP4, currentY + 2, { width: COL_SPACING[5], align: 'center', bold: true });
    
    currentY += H_PADDING + 5; // Next row (Data start)
    doc.y = currentY;

    // C. DRAW DATA ROWS (using translated 'detailedTable' properties)
    doc.font('Helvetica').fontSize(9);
    let rowHeight = 15;
    
    detailedTable.forEach(subject => { // Renamed 'materia' to 'subject' for internal loop
        checkPageBreak(rowHeight + 10);
        
        const level = subject.level || ''; // 'nivel' translated to 'level'
        const isBajo = level === 'BAJO';
        
        // Draw row border
        doc.lineWidth(0.5).lineCap('butt')
            .moveTo(MARGIN_LEFT, doc.y).lineTo(MARGIN_RIGHT, doc.y).stroke();
        
        const textY = doc.y + 2; 
        
        // AREA
        doc.text(subject.area, xArea + 2, textY, { width: COL_SPACING[0] - 4, align: 'left', height: rowHeight, continued: false });
        
        // F (Absences)
        doc.text(subject.f || '', xAbsences, textY, { width: COL_SPACING[1], align: 'center', height: rowHeight, continued: false });
        
        // P1 to P4
        doc.text(subject.p1 || '', xP1, textY, { width: COL_SPACING[2], align: 'center', height: rowHeight, continued: false });
        doc.text(subject.p2 || '', xP2, textY, { width: COL_SPACING[3], align: 'center', height: rowHeight, continued: false });
        doc.text(subject.p3 || '', xP3, textY, { width: COL_SPACING[4], align: 'center', height: rowHeight, continued: false });
        doc.text(subject.p4 || '', xP4, textY, { width: COL_SPACING[5], align: 'center', height: rowHeight, continued: false });
        
        // NF (Final Note)
        doc.font('Helvetica-Bold').text(subject.fn || '', xFN, textY, { width: COL_SPACING[6], align: 'center', height: rowHeight, continued: false });
        
        // NIVEL (Color if BAJO)
        doc.fillColor(isBajo ? 'red' : 'black')
            .text(level, xLEVEL, textY, { width: COL_SPACING[7], align: 'center', height: rowHeight, continued: false, bold: isBajo });
        
        doc.fillColor('black').font('Helvetica'); // Reset style
        doc.y += rowHeight;
    });

    // D. DRAW AVERAGE ROW (using translated 'summary' properties)
    checkPageBreak(30);
    doc.lineWidth(1).lineCap('butt')
        .moveTo(MARGIN_LEFT, doc.y).lineTo(MARGIN_RIGHT, doc.y).stroke(); 
    
    doc.font('Helvetica-Bold').fontSize(9);
    const yAverage = doc.y + H_PADDING;

    // Position and Average
    doc.text(`Puesto grupo: ${summary.groupPosition || ''}`, xArea + 2, yAverage, { width: COL_SPACING[0] + COL_SPACING[1] - 4, align: 'left' }); // Text in Spanish
    doc.text(`PROMEDIO`, xArea + 2, yAverage + 10, { width: COL_SPACING[0] + COL_SPACING[1] - 4, align: 'left' }); // Text in Spanish

    // Period Averages
    const averages = [summary.averageP1, summary.averageP2, summary.averageP3, summary.averageP4];
    [xP1, xP2, xP3, xP4].forEach((x, index) => {
        if (averages[index]) {
            doc.text(averages[index].toFixed(2), x, yAverage + 10, { width: COL_SPACING[index + 2], align: 'center' });
        }
    });

    doc.y = yAverage + 25;
    
    doc.lineWidth(1).lineCap('butt')
        .moveTo(MARGIN_LEFT, doc.y).lineTo(MARGIN_RIGHT, doc.y).stroke(); 

    doc.moveDown(1);
    
    // Level Legend
    doc.font('Helvetica-Oblique').fontSize(8)
        .text(context.noteConventions, { align: 'center' }); // Text comes from DB/Context (kept in Spanish by default)
    doc.moveDown(1);


    // --- 4. SUBJECT DETAIL AND INDICATORS BLOCK ---
    checkPageBreak(50);
    doc.font('Helvetica-Bold').fontSize(10)
        .text('OBSERVACIONES E INDICADORES DE DESEMPEÑO POR ASIGNATURA', { align: 'center' }); // Text in Spanish
    doc.moveDown(1);
    
    doc.font('Helvetica').fontSize(9);

    detailedTable.forEach(subject => { // Renamed 'materia' to 'subject' for internal loop
        checkPageBreak(80); 

        const level = subject.level;
        const colorLevel = level === 'BAJO' ? 'red' : 'black';
        
        // Area Title
        doc.font('Helvetica-Bold').fontSize(10).text(subject.area.toUpperCase(), { decoration: 'underline' });
        doc.moveDown(0.2);
        
        // Absences, Performance, and Final Note (NF)
        doc.font('Helvetica-Oblique').fontSize(9).fillColor(colorLevel).text(`Fallas: ${subject.f || 0} | Desempeño: ${level} (${subject.fn})`, { bold: level !== 'SUPERIOR' }); // Text in Spanish
        doc.fillColor('black'); // Reset color
        doc.moveDown(0.5);

        // Indicators Title
        doc.font('Helvetica-Bold').text('INDICADORES:', { margin: [0, 5, 0, 2] }); // Text in Spanish
        
        // Indicators List
        doc.font('Helvetica').fontSize(9);
        const indicators = subject.indicators || ['• No hay indicadores definidos.']; // Text in Spanish
        indicators.forEach(ind => {
            doc.text('• ' + ind, { indent: 10, align: 'left' });
        });
        doc.moveDown(0.5);

        // Teacher
        doc.font('Helvetica-Oblique').fontSize(9).text(`Docente: ${subject.teacher || 'Docente no asignado'}`, { align: 'right' }); // Text in Spanish
        doc.moveDown(0.5);

        // Separator line
        doc.lineWidth(0.5).lineCap('butt')
            .moveTo(MARGIN_LEFT, doc.y).lineTo(MARGIN_RIGHT, doc.y).stroke();
        doc.moveDown(0.5);
    });

    // --- 5. SIGNATURE BLOCK ---
    checkPageBreak(120); 

    doc.moveDown(3); 
    doc.font('Helvetica-Bold').fontSize(9);
    
    const SIGNATURE_Y = doc.y;
    const BOX_WIDTH = 200;
    const BOX_HEIGHT = 50;
    const LEFT_COL = MARGIN_LEFT + 20;
    const RIGHT_COL = MARGIN_RIGHT - BOX_WIDTH - 20; 
    
    // Rector/Rectora (using translated 'context.signatures' properties)
    doc.rect(LEFT_COL, SIGNATURE_Y, BOX_WIDTH, BOX_HEIGHT).stroke();
    doc.y = SIGNATURE_Y + BOX_HEIGHT + 5;
    doc.text(context.signatures.rector, LEFT_COL, doc.y, { width: BOX_WIDTH, align: 'center', underline: true });
    doc.text('RECTORA', LEFT_COL, doc.y + 10, { width: BOX_WIDTH, align: 'center', font: 'Helvetica' }); // Role in Spanish
    
    // Group Director (using translated 'context.signatures' properties)
    doc.rect(RIGHT_COL, SIGNATURE_Y, BOX_WIDTH, BOX_HEIGHT).stroke();
    doc.text(context.signatures.groupDirector, RIGHT_COL, doc.y, { width: BOX_WIDTH, align: 'center', underline: true });
    doc.text('DIRECTORA DE GRUPO', RIGHT_COL, doc.y + 10, { width: BOX_WIDTH, align: 'center', font: 'Helvetica' }); // Role in Spanish
    
    doc.moveDown(2);
} 