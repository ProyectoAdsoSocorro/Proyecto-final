import mongoose from "mongoose";

const schemaAttendant = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schools',
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    documentOfType: {
        type: String, // Ej: "CC", "TI", "CE", etc.
        required: true,
        trim: true
    },
    documentOfNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
        required: true,
        enum: ['masculino', 'femenino', 'otro'],
        trim: true
    },
    roles: {
        type: [String],
        required: true,
        default: ['acudiente'],
        enum: ['acudiente'] 
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'users',
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model("ModelUser", schemaAttendant)