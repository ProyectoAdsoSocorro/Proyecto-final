import mongoose from "mongoose";

const schemaTuition = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, ref: "modelusers", 
        required: true
    },
    attendant: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId, ref: "modelusers", 
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
        type: mongoose.Schema.Types.ObjectId, ref: "groups", 
        required: true
    },
    year: {
        type: Number, 
        required: true, 
        maxLength: 4
    },
    tuitionDate: {
        type: Date, 
        required: true
    },
    tuitionNumber: {
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
        type: mongoose.Schema.Types.ObjectId, ref: "schools", 
        required: true
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

export default mongoose.model("Tuition", schemaTuition);