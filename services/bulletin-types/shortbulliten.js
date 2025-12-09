import mongoose from 'mongoose';
import User from '../../models/users.js';
import Registration from '../../models/registration.js';
import Period from '../../models/period.js';
import Group from '../../models/groups.js';
import Headquarters from '../../models/headquarters.js'; // Ajustar si solo exporta 'default'
import School from '../../models/schools.js'; // Ajustar si solo exporta 'default'
import Validity from '../../models/validity.js'; // Ajustar si solo exporta 'default'
import Qualification from '../../models/qualifications.js';
import FinalQualification from '../../models/finalQualifications.js';
import Subject from '../../models/subject.js';

import { generatePDF } from '../../utils/pdfGenerator.js'

function getLevel(note) {
    if (note >= 4.5) return 'SUPERIOR';
    if (note >= 4.0) return 'ALTO';
    if (note >= 3.0) return 'BASICO';
    return 'BAJO';
}

const fetchStudentDataEntry = async (studentId, periodId, yearNum) => {
       /*  console.log(studentId , periodId, yearNum); */
    const [student, currentPeriod, enrollment] = await Promise.all([
        User.findById(studentId).lean(),
        Period.findById(periodId).lean(),
        // Assuming fields are 'student' and 'year' in registration model//!
        Registration.findOne({ student: studentId, year: yearNum }).lean()
    ]);
       /*  console.log(student, currentPeriod, enrollment); */
    if (!enrollment || !student || !currentPeriod) {
        return null;
    }

    const group = await Group.findById(enrollment.group)
        .populate('groupDirector', 'firstName lastName') // Assumed 'nombres'/'apellidos' are 'firstName'/'lastName'
        .lean();

    const headquarters = await Headquarters.findById(group.headquarters).lean();
    const school = await School.findById(headquarters.school).lean();
   /*  console.log(school) */
    const validity = await Validity.findOne({ school: school._id, year: yearNum })
        .populate('rector', 'firstName lastName')
        .lean();

    const currentPeriodNumber = currentPeriod.number;


    const qualificationsTable = await Qualification.aggregate([
        {
            $match: {
                student: new mongoose.Types.ObjectId(studentId),
                year: yearNum,
                noteType: 'PERIODO' // Assuming this constant is still in Spanish/Uppercase
            }
        },
        { $lookup: { from: 'subjects', localField: 'subject', foreignField: '_id', as: 'subjectInfo' } },
        { $unwind: '$subjectInfo' },
        { $match: { 'subjectInfo.type': 'area' } }, // Assuming 'area' type is still used
        { $lookup: { from: 'periods', localField: 'period', foreignField: '_id', as: 'periodInfo' } },
        { $unwind: '$periodInfo' },
        // Lookup for the teacher (docente)
        { $lookup: { from: 'users', localField: 'teacher', foreignField: '_id', as: 'teacherInfo' } }, // Assuming field is 'teacher'
        { $unwind: { path: '$teacherInfo', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: '$subjectInfo._id',
                areaName: { $first: '$subjectInfo.name' }, // Assumed 'nombre' is 'name'
                notes: {
                    $push: {
                        note: '$note', // Assumed 'nota' is 'note'
                        absences: '$absences', // Assumed 'fallas' is 'absences'
                        periodNum: '$periodInfo.number',
                        // Teacher info
                        teacher: { firstName: '$teacherInfo.firstName', lastName: '$teacherInfo.lastName' },
                        indicators: ['Example Indicator 1...', 'Example Indicator 2...'] // Placeholders
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                areaName: 1,
                noteP1: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 1] } } } },
                noteP2: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 2] } } } },
                noteP3: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 3] } } } },
                noteP4: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 4] } } } }
            }
        }
    ]);

    const finalNotes = await FinalQualification.find({
        student: studentId,
        year: yearNum
    }).populate('subject', 'name').lean();

    const fnMap = finalNotes.reduce((acc, fn) => {
        if (fn.subject && fn.subject.name) {
            acc[fn.subject.name] = {
                fn: fn.finalNote, // Mapped from 'notaFinal'
                level: getLevel(fn.finalNote)
            };
        }
        return acc;
    }, {});

    const averages = {
        p1: enrollment.averagePeriod1 || 0, p2: enrollment.averagePeriod2 || 0,
        p3: enrollment.averagePeriod3 || 0, p4: enrollment.averagePeriod4 || 0,
    };
    const positions = {
        groupP1: enrollment.positionStudentByGroupPeriod1 || 0, groupP2: enrollment.positionStudentByGroupPeriod2 || 0,
        groupP3: enrollment.positionStudentByGroupPeriod3 || 0, groupP4: enrollment.positionStudentByGroupPeriod4 || 0,
        schoolP1: enrollment.positionStudentBySchoolPeriod1 || 0, schoolP2: enrollment.positionStudentBySchoolPeriod2 || 0,
        schoolP3: enrollment.positionStudentBySchoolPeriod3 || 0, schoolP4: enrollment.positionStudentBySchoolPeriod4 || 0,
    };
    return {
        header: { // Renamed from 'encabezado'
            studentName: `${student.names} ${student.lastNames}`, // Assumed 'nombres'/'apellidos'
            studentDocument: student.numberDocument, // Assumed 'numeroDocumento'
            groupName: `${group.grade} ${group.groupIdentifier}`, // Assumed 'grado'/'grupo' are 'grade'/'groupIdentifier'
            currentPeriodName: `${currentPeriod.name} ${yearNum}`, // Assumed 'nombre' is 'name'
            year: yearNum
        },

        detailedTable: qualificationsTable.map(area => { // Renamed from 'tablaDetallada'
            const final = fnMap[area.areaName] || { fn: 0, level: 'BAJO' };
            const currentNoteData = area[`noteP${currentPeriodNumber}`];
            const teacherInfo = currentNoteData && currentNoteData.teacher ? `${currentNoteData.teacher.firstName} ${currentNoteData.teacher.lastName}` : 'Docente No Asignado';

            return {
                area: area.areaName,
                p1: area.noteP1 ? area.noteP1.note.toFixed(2) : '',
                p2: area.noteP2 ? area.noteP2.note.toFixed(2) : '',
                p3: area.noteP3 ? area.noteP3.note.toFixed(2) : '',
                p4: area.noteP4 ? area.noteP4.note.toFixed(2) : '',
                f: currentNoteData ? currentNoteData.absences : 0,
                fn: final.fn.toFixed(2),
                level: final.level,
                teacher: teacherInfo, // Renamed from 'docente'
                indicators: currentNoteData ? currentNoteData.indicators : ['No indicators found for this period.']
            }
        }),

        summary: { // Renamed from 'resumen'
            periodAverage: averages[`p${currentPeriodNumber}`],
            groupPosition: positions[`groupP${currentPeriodNumber}`],
            schoolPosition: positions[`schoolP${currentPeriodNumber}`],
            averageP1: averages.p1, averageP2: averages.p2, averageP3: averages.p3, averageP4: averages.p4,
        },

        context: { // Renamed from 'contexto'
            institution: { name: school.nameSchool, title: 'REPORT CARD AND PROMOTION REPORT' },
            signatures: {
                rector: `${validity?.rector?.firstName || 'Rector(a) No Asignado'} ${validity?.rector?.lastName || ''}`,
                groupDirector: `${group.groupDirector.firstName} ${group.groupDirector.lastName}`
            },
            noteConventions: validity?.noteConventions || 'LEGEND: Superior (4.5-5.0), High (4.0-4.4), Basic (3.0-3.9), Low (1.0-2.9)'
        }
    };
};


export const fetchStudentData = async ({ students, periodId, year }) => { // Renamed from 'traerDatosAprendiz'

    const dataPromises = students.map(studentId => fetchStudentDataEntry(studentId, periodId, year));

    // Execute all queries in parallel and filter out students without enrollment
    const readyData = (await Promise.all(dataPromises)).filter(data => data !== null);

    return readyData;
};


export const generateShortBulletins = async ({ students, periodId, year }) => {
    const studentDataList = await fetchStudentData({ students, periodId, year });
    /* console.log(studentDataList) */
    if (studentDataList.length === 0) {
        return { pdfBuffer: null, fileName: 'No_Students.pdf' };
    }
    const pdfBuffer = await generatePDF(studentDataList, 'short');

    const studentName = studentDataList[0].header.studentName.replace(/\s/g, '_');
    const fileName = `Boletin_Corto_${studentName}_${year}.pdf`;

    return { pdfBuffer, fileName };
}; 