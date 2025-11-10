import mongoose from "mongoose";
const { Schema, model } = mongoose;

const groupSchema = new Schema({
    // Reference to the SchoolBranch collection
    schoolBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolBranch', // Name of the SchoolBranch model
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    cycle: {
        type: String,
        enum: ['normal', 'semestral'], 
        required: true,
    },
    level: {
        type: String,
        enum: ['PREESCOLAR', 'PRIMARIA', 'SECUNDARIA', 'ESCUELA_SECUNDARIA'], 
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    groupIdentifier: { // e.g., 'A', 'B', 'C'
        type: String,
        required: true,
    },
    session: { 
        type: String,
        enum: ['MAÑANA', 'TARDE', 'NOCHE'],
        required: true,
    },
    // Reference to the SchoolUser/Teachers collection
    groupDirector: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SchoolUser', // Name of the SchoolUser model
        required: true,
    },
    periodData: [{
        period: { 
            type: Number,
            required: true,
        },
        // You could add fields here like:
        // average: { type: Number },
    }],
    isActive: { 
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

groupSchema.index({
    schoolBranch: 1, 
    year: 1, 
    grade: 1, 
    groupIdentifier: 1
}, { unique: true });

const Group = model('Group', groupSchema); 
export default Group;