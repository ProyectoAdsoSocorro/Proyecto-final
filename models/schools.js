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
    isActive: { type: Boolean, default: true }
}, {
     timestamps: true
});
/*
En el archivo de requerimientos  debe estar los campos createAt, y updateAt y segun los lineamientos en
la convención para variables de tipo booleano se menciona en la sección 
"6. Uso de prefijos", la cual forma parte de las "3. Convenciones y Estándares de Nombres".
cuando se trata de variables boleanas se debe usar el prefijo "es" o "is" el cual no estaba
y en los controladores pese a que la variable es active habia uno que usaba isActive
*/

export default mongoose.model('School', SchoolSchema);