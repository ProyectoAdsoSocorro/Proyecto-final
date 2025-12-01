import mongoose from "mongoose";
const { Schema, model } = mongoose;

const groupSchema = new Schema({
    headquarters: { //! sede
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Headquarters',
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
        ref: 'users', // Nombre correcto del modelo de usuarios // ! modelusers
        required: true,
    },
    periodData: [{
        period: { 
            type: Number,
            required: true,
        },
    }],
    isActive: { 
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

groupSchema.index({
    headquarters: 1,
    year: 1,
    grade: 1,
    groupIdentifier: 1
}, { unique: true });

const Group = model('Group', groupSchema); 
export default Group;