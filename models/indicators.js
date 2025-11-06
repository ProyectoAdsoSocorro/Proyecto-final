import mongoose from "mongoose";

const indicatorsSchema = new mongoose.Schema({

    academicLoad: {
        type: mongoose.Schema.Types.ObjectId,
        /* ref: 'AcademicLoad', */
        required: true 
    },
    period: {
        type: mongoose.Schema.Types.ObjectId,
       /*  /* ref: 'Period', */
        required: true
    },
    type: [{
        type: String
    }],
    
    year:{type: String, required:true}, 

    description: { 
        type: String, 
        required: true
    },
    performanceIndicators: {
        type: String,
        enum: ['Alto', 'Medio', 'Bajo', 'Excelente', 'Regular', 'Deficiente'],
        required: true 
    },
    userWhoDidIt: {
        type: mongoose.Schema.Types.ObjectId,
        /* ref: 'User', */
        required: true
    },
    active: { 
        type: Boolean, 
        default: true 
    }

}, {
    timestamps: true
});

const Indicators = mongoose.model('Indicators', indicatorsSchema);
export default Indicators;