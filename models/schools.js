import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
    core_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoreDirection',
        required: true
    },
    nameSchool: { type: String, required: true,},
    code: { type: String, required: true, unique: true},
    addressSchool: { type: String, required: true},
    phoneSchool: { type: String},
    emailSchool: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    active: { type: Boolean, default: true }
}, {
});

const School = mongoose.model('School', SchoolSchema);

export default School;