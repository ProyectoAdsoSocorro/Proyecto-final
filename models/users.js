import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const modelUsers = new Schema(
    {
        names: String,
        lastNames: String,
        typeDocument: String,
        numberDocument: String,
        email: String,
        password: String,
        cellphone: String,
        direction: String,
        dateBorn: String,
        gender: String,
        isActive: { type: Boolean, default: true },
        roles: [],
        stratum: Number,
        sisben: String,
        eps: String,
        typeBlood: String,
        victimPopulation: Boolean,
        disability: String,
        ethnic: String,
        profilePhoto: String,
        firmaDisignDigitalgital: String,
        college: { type: mongoose.Types.ObjectId, ref: "School" }   // referenciado al colegio
    });

export default mongoose.model("users", modelUsers);