import mongoose from 'mongoose';
import User from '../../models/users.js';
import Registration from '../../models/registration.js';
import Period from '../../models/period.js';
import Group from '../../models/groups.js';
import Headquarters from '../../models/headquarters.js'; 
import School from '../../models/schools.js'; 
import Validity from '../../models/validity.js'; 
import Qualification from '../../models/qualifications.js';
// IMPORTANTE: Ya no necesitamos Indicators ni Subject si no los vamos a usar en el pipeline
// import Indicators from '../../models/indicators.js'; 
import FinalQualification from '../../models/finalQualifications.js';
import Subject from '../../models/subject.js'; // Lo dejamos porque lo usamos en populate

import { generatePDF } from '../../utils/pdfGenerator.js'

function getLevel(note) {
    if (note >= 4.5) return 'SUPERIOR';
    if (note >= 4.0) return 'ALTO';
    if (note >= 3.0) return 'BASICO';
    return 'BAJO';
}

const fetchStudentDataEntry = async (studentId, periodId, yearNum) => {
    
    const [student, currentPeriod, enrollment] = await Promise.all([
        User.findById(studentId).lean(),
        Period.findById(periodId).lean(),
        Registration.findOne({ student: studentId, year: yearNum }).lean()
    ]);
    
    if (!enrollment || !student || !currentPeriod) {
        return null;
    }
    
    const group = await Group.findById(enrollment.group)
        .populate('groupDirector', 'names lastNames') 
        .lean();
    
    if (!group) { 
        console.warn(`No se encontró Grupo para el estudiante ${studentId}.`);
        return null; 
    }

    const headquarters = await Headquarters.findById(group.headquarters).lean();
    if (!headquarters) {
        console.warn(`No se encontró Sede para el grupo ${group._id}.`);
        return null;
    }

    const school = await School.findById(headquarters.school).lean();
    if (!school) {
        console.warn(`No se encontró Colegio para la sede ${headquarters._id}.`);
        return null;
    }

    const validity = await Validity.findOne({ school: school._id, year: yearNum }) // Volví a incluir el filtro por school para que sea más robusto
        .lean();

    const currentPeriodNumber = currentPeriod.number;

    const rector = await User.findOne({
        roles: 'rector',
        college: school._id
    }).lean(); 
    
    const qualificationsTable = await Qualification.aggregate([
        {
            $match: {
                student: new mongoose.Types.ObjectId(studentId),
                year: yearNum,
                noteType: 'PERIOD',
            }
        },
        { $lookup: { from: 'subjects', localField: 'subject', foreignField: '_id', as: 'subjectInfo' } },
        { $unwind: '$subjectInfo' },
        { $lookup: { from: 'periods', localField: 'period', foreignField: '_id', as: 'periodInfo' } },
        { $unwind: '$periodInfo' },
        // ELIMINAMOS EL LOOKUP A USERS (TEACHER)
        // ELIMINAMOS EL LOOKUP A INDICATORS
        
        {
            $group: {
                _id: '$subjectInfo._id', // Este es el ID de la Materia
                areaName: { $first: '$subjectInfo.name' }, 
                notes: {
                    $push: {
                        note: '$note', 
                        absences: '$absences', 
                        periodNum: '$periodInfo.number',
                        // ELIMINAMOS TEACHER INFO
                        // ELIMINAMOS INDICATORS INFO
                    }
                }
            }
        },
        {
            $project: {
                subjectId: '$_id', 
                _id: 0,
                areaName: 1,
                noteP1: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 1] } } } },
                noteP2: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 2] } } } },
                noteP3: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 3] } } } },
                noteP4: { $first: { $filter: { input: '$notes', as: 'n', cond: { $eq: ['$$n.periodNum', 4] } } } }
            }
        }
    ]);
    
    const subjectIds = qualificationsTable.map(q => q.subjectId).filter(id => id); 
 
    const finalNotes = await FinalQualification.find({
        student: studentId,
        year: yearNum,
        subject: { $in: subjectIds } 
    }).populate('subject', 'name').lean();


    const fnMap = finalNotes.reduce((acc, fn) => {
        if (fn.subject && fn.subject.name) {
            acc[fn.subject.name] = {
                fn: fn.finalNote, 
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
        header: { 
            studentName: `${student?.names || 'Nombre Desconocido'} ${student?.lastNames || ''}`, 
            studentDocument: student?.numberDocument || 'N/A', 
            groupName: `${group.grade} ${group.groupIdentifier}`, 
            currentPeriodName: `${currentPeriod.name} ${yearNum}`, 
            year: yearNum
        },

        detailedTable: qualificationsTable.map(area => { 
            const final = fnMap[area.areaName] || { fn: 0, level: 'BAJO' };
            const currentNoteData = area[`noteP${currentPeriodNumber}`];
            
            return {
                area: area.areaName,
                p1: area.noteP1 ? area.noteP1.note.toFixed(2) : '',
                p2: area.noteP2 ? area.noteP2.note.toFixed(2) : '',
                p3: area.noteP3 ? area.noteP3.note.toFixed(2) : '',
                p4: area.noteP4 ? area.noteP4.note.toFixed(2) : '',
                f: currentNoteData ? currentNoteData.absences : 0,
                fn: final.fn.toFixed(2),
                level: final.level,
            }
        }),

        summary: { 
            periodAverage: averages[`p${currentPeriodNumber}`],
            groupPosition: positions[`groupP${currentPeriodNumber}`],
            schoolPosition: positions[`schoolP${currentPeriodNumber}`],
            averageP1: averages.p1, averageP2: averages.p2, averageP3: averages.p3, averageP4: averages.p4,
        },

        context: { 
            institution: { name: school.name || school.name, title: 'REPORT CARD AND PROMOTION REPORT' }, 
            signatures: { 
                rector: `${rector?.names || 'Rector(a) No Asignado'} ${rector?.lastNames || ''}`,
                groupDirector: `${group.groupDirector?.names || ''} ${group.groupDirector?.lastNames || ''}`
            },
            noteConventions: validity?.noteConventions || 'LEGEND: Superior (4.5-5.0), High (4.0-4.4), Basic (3.0-3.9), Low (1.0-2.9)'
        }
    };
};


export const fetchStudentData = async ({ students, periodId, year }) => { 
    const dataPromises = students.map(studentId => fetchStudentDataEntry(studentId, periodId, year));

    const readyData = (await Promise.all(dataPromises)).filter(data => data !== null);

    return readyData;
};


export const generateShortBulletins = async ({ students, periodId, year }) => {

    const studentDataList = await fetchStudentData({ students, periodId, year });
    
    if (studentDataList.length === 0) {
        return { pdfBuffer: null, fileName: 'No_Students.pdf' };
    }
    const pdfBuffer = await generatePDF(studentDataList, 'short');

    const studentName = (studentDataList[0]?.header?.studentName || 'EstudianteDesconocido').replace(/\s/g, '_');
    const fileName = `Boletin_Corto_${studentName}_${year}.pdf`;

    return { pdfBuffer, fileName };
};