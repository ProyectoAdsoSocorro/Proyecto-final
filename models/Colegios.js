import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
    core_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coredirections',
        required: true
    },
    name: { type: String, required: true,},
    code: { type: String, required: true, unique: true},
    address: { type: String, required: true},
    phone: { type: String},
    email: {
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