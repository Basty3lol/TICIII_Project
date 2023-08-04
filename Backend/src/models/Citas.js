import {Schema, model} from "mongoose";

const createCitaSchema = new Schema({
    id_prof: Schema.Types.ObjectId,
    nombre: String,
    rut_cliente: String,
    birth: String,
    edad: Number,
    telefono: String,
    correo: String,
    fecha: String,
    hora: String,
    grupo: String,
    estado: String,
    descripcion: String,
    pago:String
},{
    collection : 'citas',
    timestamp: false,
    versionKey: false 
})

export default model("Cita", createCitaSchema);