import {Schema, model} from "mongoose";

const profesionalSchema = new Schema({
    id_user: Schema.Types.ObjectId,
    id_prof: String,
    nombre: String,
    apellido: String,
    schedule: Object,
    grupo: [String],
    rut: String,
},{
    collection : 'profesionales',
    timestamp: false,
    versionKey: false 
})

export default model("Profesional", profesionalSchema);