import Cita from "../models/Citas"
import Profesional from "../models/Profesionals"
import Calendar from "../models/Calendar"

const days = ["","lunes","martes","miercoles","jueves","viernes","sabado"]

export const getHours = async (req, res) => {
    const prof = await Profesional.findOne({rut: req.body.rut_prof})
    const citas = await Cita.find({fecha: req.body.fecha, id_prof:prof._id})

    var hours = prof.schedule[days[req.body.dia]]

    for(var i = 0; i < citas.length ; i++){
        const index = hours.indexOf(citas[i].hora)
        if(index > -1){
            hours.splice(index,1)
        }
    }

    res.status(200).json({horas: hours})
}

export const getCalendar = async (req, res) => {
    const dates = await Calendar.findOne({rut_prof: req.body.rut_prof})
    
    res.status(200).json(dates)
}

export const getCitas = async (req, res) => {
    const citas = await Cita.find();
    res.json(citas)
}

export const createCita = async (req, res) => {
    const citas = await Cita.find({fecha:req.body.fecha, hora:req.body.hora, estado: {$in: ["Confirmada"]}});
    console.log(citas, citas.length)

    var cita_finded = false
    if(citas.length > 0){
        for(var i = 0; i < citas.length && cita_finded; i++){
            if(citas[i].estado !== "Cancelada")
            {
                cita_finded = true
            }
        }
    }

    if(!cita_finded) {
        const profFound = await Profesional.findOne({rut: req.body.rut_prof});
        const id_prof = profFound._id;

        const estado = "Pendiente"
        const {nombre, rut_cliente, birth, edad, telefono, fecha, correo, hora, grupo, descripcion, pago} = req.body;

        if(pago === "presencial"){
            const citas = await Cita.find({rut_cliente: rut_cliente, estado:{$in: ["Confirmado","Pendiente"]}});
            if(citas.length > 2){
                res.status(203).json({message: 'Hay 3 o más citas pendientes con tu rut'})
            }
        }
        const nueva_cita = new Cita({id_prof, nombre, rut_cliente, birth, edad, telefono, correo, fecha, hora, grupo, estado, descripcion, pago});
        const citaSaved = await nueva_cita.save();
    
        res.status(201).json({message: "Se agendó correctamente la cita",code:citaSaved._id});
    }
    else {
        res.status(200).json({message: 'Ya hay una cita agendada en este dia y hora'})
    }
    
}

export const cancelCita = async (req, res) => {
    
}

export const getPaciente = async (req, res) => {
    console.log(req.body.rut)
    const cita = await Cita.findOne({rut_cliente: req.body.rut})

    if(cita){
        res.status(200).json({cli:{rut: cita.rut_cliente, name: cita.nombre, phone: cita.telefono, email: cita.correo, birth: cita.birth}})
    }
    else{
        res.status(404).json([])
    }
}

export const getCitasByRutClient = async (req, res) => {
    const citas = await Cita.find({rut_cliente: req.body.rut, id_prof: req.body.id_prof})
    
    var P_names = []
    for(var i = 0; i < citas.length; i++) {
        P_names.push({id:citas[i]._id, name:citas[i].nombre, rut:citas[i].rut_cliente, edad:citas[i].edad, phone:citas[i].telefono, email:citas[i].correo, fecha:citas[i].fecha, hora:citas[i].hora, description:citas[i].descripcion, state:citas[i].estado, pago:citas[i].pago})
    }
    res.status(200).json(P_names)
}

export const getCitasByCode = async (req, res) => {
    const citas = await Cita.find({_id: req.query.codigo});
    var P_names = []
    for(var i = 0; i < citas.length; i++) {
        
        const prof = await Profesional.findOne({ _id : citas[i].id_prof });
        P_names.push({nombre: citas[i].nombre, fecha: citas[i].fecha, hora: citas[i].hora, nombre_prof: (prof.nombre+" "+prof.apellido)})
    
    }
    res.status(200).json(P_names)
}

export const updateCitaState = async (req, res) => {
    try{
        const cita = await Cita.findOneAndUpdate({_id:req.body.id_cita},{estado:req.body.state})
        console.log(cita)
        res.status(200).json("Cambio exitoso")
    }catch(err){
        res.status(401)
    }
    
}

export const getCitasByDay = async (req, res) => {
    const citas = await Cita.find({fecha: req.body.fecha, id_prof: req.body.id_prof, estado:{$in: ["Confirmada","Pendiente"]}})
    var C = []
    for(var i = 0; i < citas.length; i++) {
        C.push({id:citas[i]._id, name:citas[i].nombre, rut:citas[i].rut_cliente, edad:citas[i].edad, phone:citas[i].telefono, email:citas[i].correo, fecha:citas[i].fecha, hora:citas[i].hora, description:citas[i].descripcion, state:citas[i].estado, pago:citas[i].pago})
    }
    res.status(200).json(C)
}

export const getCitasByWeek = async (req, res) => {
    const F = req.body.fechas
    const citas = await Cita.find({fecha: {$in: F}, id_prof: req.body.id_prof, estado:{$in: ["Confirmada","Pendiente"]}})

    var C = []
    for(var i = 0; i < citas.length; i++) {
        C.push({id:citas[i]._id, name:citas[i].nombre, rut:citas[i].rut_cliente, edad:citas[i].edad, phone:citas[i].telefono, email:citas[i].correo, fecha:citas[i].fecha, hora:citas[i].hora, description:citas[i].descripcion, state:citas[i].estado, pago:citas[i].pago})
    }
    
    res.status(200).json(C)
}

export const getProfesional = async (req, res) => {
    const prof = await Profesional.find({grupo: req.body.grupo})
    res.status(200).json({"prof": prof})
}