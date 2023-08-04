import {Schema, model} from "mongoose";

const createCalendarSchema = new Schema({
    rut_prof: String,
    fechas: Array
},{
    collection : 'calendar_days',
    timestamp: false,
    versionKey: false 
})

export default model("Calendar", createCalendarSchema);