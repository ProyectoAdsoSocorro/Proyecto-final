export function drawShortBulletin(doc, bulletinData) {
    
    const { header, detailedTable, summary, context } = bulletinData;

    const MARGIN_LEFT = 50;
    const MARGIN_RIGHT = 550;
    const DOC_WIDTH = MARGIN_RIGHT - MARGIN_LEFT;
    
    // COL_WIDTHS ajustado: eliminamos las columnas de Profesor e Indicadores
    // COL_WIDTHS ORIGINAL: [0.35, 0.05, 0.08, 0.08, 0.08, 0.08, 0.15, 0.13]; (8 columnas)
    // ELIMINAMOS 2 COLUMNAS de la sección "detailedTable" (teacher, indicators)
    
    // Nueva distribución (7 Columnas: Area, F, P1, P2, P3, P4, FN, Nivel)
    // Vamos a redistribuir el espacio para que la tabla ocupe todo el ancho
    // Area (35%) | F (5%) | P1-P4 (4 * 8%) | NF (15%) | NIVEL (13%)
    // 0.35 + 0.05 + (4 * 0.08) + 0.15 + 0.13 = 0.35 + 0.05 + 0.32 + 0.15 + 0.13 = 1.00 (OK)

    const COL_WIDTHS = [0.35, 0.05, 0.08, 0.08, 0.08, 0.08, 0.15, 0.13]; 
    let xArea = MARGIN_LEFT;
    let xAbsences = xArea + (DOC_WIDTH * COL_WIDTHS[0]);
    let xP1 = xAbsences + (DOC_WIDTH * COL_WIDTHS[1]);
    let xP2 = xP1 + (DOC_WIDTH * COL_WIDTHS[2]);
    let xP3 = xP2 + (DOC_WIDTH * COL_WIDTHS[3]);
    let xP4 = xP3 + (DOC_WIDTH * COL_WIDTHS[4]);
    let xFN = xP4 + (DOC_WIDTH * COL_WIDTHS[5]);
    let xLEVEL = xFN + (DOC_WIDTH * COL_WIDTHS[6]); // Esta es la posición X del inicio de la columna Nivel
    // xFN es la posición X del inicio de la columna Nota Final

    // El último valor de COL_SPACING ya no se usa para el docente
    const COL_SPACING = [
        (DOC_WIDTH * COL_WIDTHS[0]), 
        (DOC_WIDTH * COL_WIDTHS[1]), 
        (DOC_WIDTH * COL_WIDTHS[2]), 
        (DOC_WIDTH * COL_WIDTHS[3]), 
        (DOC_WIDTH * COL_WIDTHS[4]), 
        (DOC_WIDTH * COL_WIDTHS[5]), 
        (DOC_WIDTH * COL_WIDTHS[6]), // Ancho de NF
        (DOC_WIDTH * COL_WIDTHS[7])  // Ancho de Nivel
    ];

    const H_PADDING = 5; // Internal cell padding height

    // Helper function to check and add page break
    const checkPageBreak = (spaceNeeded = 30) => {
        if (doc.y > 750 - spaceNeeded) {
            doc.addPage();
            doc.y = 50; // Reset Y after break
        }
    };
    
    doc.font('Helvetica-Bold').fontSize(13)
        .text(context.institution.name, MARGIN_LEFT, doc.y, { align: 'center', width: DOC_WIDTH });
    
    doc.fontSize(10)
        .text(context.institution.title, { align: 'center', width: DOC_WIDTH });
    doc.moveDown(0.2);

    doc.lineWidth(1).lineCap('butt')
        .moveTo(MARGIN_LEFT, doc.y)
        .lineTo(MARGIN_RIGHT, doc.y)
        .stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica');
    const yInfo = doc.y;
    doc.fontSize(9)
        .text(`Estudiante: ${header.studentName}`, MARGIN_LEFT, yInfo, { continued: true, width: DOC_WIDTH / 2 })
        .text(`Grado: ${header.groupName}`, MARGIN_LEFT + DOC_WIDTH / 2, yInfo, { width: DOC_WIDTH / 2, align: 'right' });
    
    doc.y = doc.y + doc.currentLineHeight() + 2; 
    
    doc.fontSize(9)
        .text(`Documento: ${header.studentDocument}`, MARGIN_LEFT, doc.y, { continued: true, width: DOC_WIDTH / 2 })
        .text(`Periodo: ${header.currentPeriodName}`, MARGIN_LEFT + DOC_WIDTH / 2, doc.y, { width: DOC_WIDTH / 2, align: 'right' });
    doc.moveDown(1);
    
    doc.font('Helvetica-Bold').fontSize(10)
        .text('CUADRO DE CALIFICACIONES POR PERIODOS', { align: 'center' }); 
    doc.moveDown(0.5);

    const tableHeaders = ['AREA', 'F', 'NOTA PERIODO', 'NF', 'NIVEL'];
    const subHeaders = ['', '', '1 Per', '2 Per', '3 Per', '4 Per', '', '']; 
    const yStartTable = doc.y;
    let currentY = yStartTable;

    doc.lineWidth(1).lineCap('butt');
    
    doc.fillColor('#EEEEEE').rect(xArea, currentY, COL_SPACING[0], H_PADDING * 2 + 10).fill().fillColor('black'); // Grey background
    doc.text(tableHeaders[0], xArea + 2, currentY + H_PADDING, { width: COL_SPACING[0] - 4, align: 'left', height: 10, bold: true });

    doc.fillColor('#EEEEEE').rect(xAbsences, currentY, COL_SPACING[1], H_PADDING * 2 + 10).fill().fillColor('black');
    doc.text(tableHeaders[1], xAbsences, currentY + H_PADDING, { width: COL_SPACING[1], align: 'center', height: 10, bold: true });

    doc.fillColor('#EEEEEE').rect(xP1, currentY, COL_SPACING[2] + COL_SPACING[3] + COL_SPACING[4] + COL_SPACING[5], H_PADDING + 5).fill().fillColor('black');
    doc.text(tableHeaders[2], xP1, currentY + 2, { width: COL_SPACING[2] + COL_SPACING[3] + COL_SPACING[4] + COL_SPACING[5], align: 'center', height: 10, bold: true });
    
    doc.fillColor('#EEEEEE').rect(xFN, currentY, COL_SPACING[6], H_PADDING * 2 + 10).fill().fillColor('black');
    doc.text(tableHeaders[3], xFN, currentY + H_PADDING, { width: COL_SPACING[6], align: 'center', height: 10, bold: true });
    
    // NIVEL Column (Level)
    doc.fillColor('#EEEEEE').rect(xLEVEL, currentY, COL_SPACING[7], H_PADDING * 2 + 10).fill().fillColor('black');
    doc.text(tableHeaders[4], xLEVEL, currentY + H_PADDING, { width: COL_SPACING[7], align: 'center', height: 10, bold: true });
    
    currentY += H_PADDING + 5; // Next row (Sub-headers)

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

    // Dibujar todas las líneas divisorias verticales
    doc.lineWidth(1).lineCap('butt').strokeColor('#000000');
    // Línea vertical izquierda
    doc.moveTo(xArea, yStartTable).lineTo(xArea, doc.y).stroke();
    // Línea vertical después de AREA
    doc.moveTo(xAbsences, yStartTable).lineTo(xAbsences, doc.y).stroke();
    // Línea vertical después de F
    doc.moveTo(xP1, yStartTable).lineTo(xP1, doc.y).stroke();
    // Líneas verticales internas de NOTA PERIODO
    doc.moveTo(xP2, yStartTable + H_PADDING + 5).lineTo(xP2, doc.y).stroke(); 
    doc.moveTo(xP3, yStartTable + H_PADDING + 5).lineTo(xP3, doc.y).stroke(); 
    doc.moveTo(xP4, yStartTable + H_PADDING + 5).lineTo(xP4, doc.y).stroke(); 
    // Línea vertical después de P4
    doc.moveTo(xFN, yStartTable).lineTo(xFN, doc.y).stroke();
    // Línea vertical después de NF
    doc.moveTo(xLEVEL, yStartTable).lineTo(xLEVEL, doc.y).stroke();
    // Línea vertical derecha
    doc.moveTo(MARGIN_RIGHT, yStartTable).lineTo(MARGIN_RIGHT, doc.y).stroke();


    // C. DRAW DATA ROWS (using translated 'detailedTable' properties)
    doc.font('Helvetica').fontSize(9);
    let rowHeight = 15;
    
    detailedTable.forEach(subject => { // Renamed 'materia' to 'subject' for internal loop
        checkPageBreak(rowHeight + 10);
        
        const level = subject.level || ''; // 'nivel' translated to 'level'
        const isBajo = level === 'BAJO';
        
        // Draw row border (Horizontal line ABOVE data)
        doc.lineWidth(0.5).lineCap('butt').strokeColor('#CCCCCC')
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

    // Cierre de la tabla (línea inferior)
    doc.lineWidth(1).lineCap('butt').strokeColor('#000000')
        .moveTo(MARGIN_LEFT, doc.y).lineTo(MARGIN_RIGHT, doc.y).stroke(); 

    // D. DRAW AVERAGE ROW (using translated 'summary' properties)
    checkPageBreak(30);
    // Ya dibujamos la línea de cierre de la tabla arriba, la omitimos aquí
    // doc.lineWidth(1).lineCap('butt')
    //     .moveTo(MARGIN_LEFT, doc.y).lineTo(MARGIN_RIGHT, doc.y).stroke(); 
    
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
    
    doc.lineWidth(1).lineCap('butt').strokeColor('#000000')
        .moveTo(MARGIN_LEFT, doc.y).lineTo(MARGIN_RIGHT, doc.y).stroke(); 

    doc.moveDown(1);
    
    // Level Legend
    doc.font('Helvetica-Oblique').fontSize(8)
        .text(context.noteConventions, { align: 'center' }); // Text comes from DB/Context (kept in Spanish by default)
    doc.moveDown(1);


    // --- 4. SUBJECT DETAIL AND INDICATORS BLOCK (ELIMINADA) ---
    // Eliminamos todo el bloque de indicadores y profesor.
    

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