import moongose from "mongoose"

const schemaHeadquarters = new moongose.Schema({
    school: {type: moongose.Schema.Types.ObjectId, ref: "schools", required: true},
    name: {type: String, required: true},
    abbreviation: {type: String, required: true},
    code: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    phone: {type: String, required: true, maxLength: 10},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

export default moongose.model("Headquarters", schemaHeadquarters);