import mongoose from "mongoose";

const schemaRegistration = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, ref: "users",
        required: true
    },
    attendant: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId, ref: "users",
                required: true,
            },
            relationship: {
                type: String, 
                required: true,
                enum: ['madre', 'padre', 'tío', 'tía', 'abuelo', 'abuela', 'otro'],
                trim: true
            }
        }
    ],
    group: {
        type: mongoose.Schema.Types.ObjectId, ref: "Group",
        required: true
    },
    year: {
        type: Number, 
        required: true, 
        maxLength: 4
    },
    registrationDate: {
        type: Date, 
        required: true
    },
    registrationNumber: {
        type: String, 
        required: true
    },
    state: {
        type: String, 
        enum: ["ACTIVO", "RETIRADO", "DESERTADO","GRADUADO"], 
        default: "ACTIVO"
    },
    description: {
        type: String, 
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId, ref: "School",
        required: true
    },
    // Puesto estudiantes por grupos
    positionStudentByGroupPeriod1: {
        type: Number,
        default: 0
    },
    positionStudentByGroupPeriod2: {
        type: Number, 
        default: 0
    },
    positionStudentByGroupPeriod3: {
        type: Number, 
        default: 0
    },
    positionStudentByGroupPeriod4: {
        type: Number, 
        default: 0
    },
    positionStudentByGroupGeneralPeriod: {
        type: Number, 
        default: 0
    },
    // Puesto estudiantes por colegio
    positionStudentBySchoolPeriod1: {
        type: Number, 
        default: 0
    },
    positionStudentBySchoolPeriod2: {
        type: Number, 
        default: 0
    },
    positionStudentBySchoolPeriod3: {
        type: Number, 
        default: 0
    },
    positionStudentBySchoolPeriod4: {
        type: Number, 
        default: 0
    },
    positionStudentBySchoolGeneralPeriod: {
        type: Number, 
        default: 0
    },
    // Puesto estudiantes por sede
    positionStudentByHeadquarterPeriod1: {
        type: Number, 
        default: 0
    },
    positionStudentByHeadquarterPeriod2: {
        type: Number, 
        default: 0
    },
    positionStudentByHeadquarterPeriod3: {
        type: Number, 
        default: 0
    },
    positionStudentByHeadquarterPeriod4: {
        type: Number, 
        default: 0
    },
    positionStudentByHeadquarterGeneralPeriod: {
        type: Number, 
        default: 0
    },
    // Promedios estudiantes
    averagePeriod1: {
        type: Number, 
        default: 0
    },
    averagePeriod2: {
        type: Number, 
        default: 0
    },
    averagePeriod3: {
        type: Number, 
        default: 0
    },
    averagePeriod4: {
        type: Number, 
        default: 0
    },
    averageGeneralPeriod: {
        type: Number, 
        default: 0
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date, 
        default: Date.now
    }
});

export default mongoose.model("Registration", schemaRegistration);