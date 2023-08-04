import { set } from "mongoose";
import Cita from "../models/Citas";

const month_names = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

export const getTypes = async (_, res) => {

    const citas = await Cita.find();
    res.json(citas)
}

export const getCitasCounter = async (_, res) => {
    
    const citas = await Cita.countDocuments();
    res.json(citas)
}

export const getYears = async (_, res) => {

    const first = await Cita.find().select("fecha");
    const dates = []

    for (var i=0; i<first.length; ++i) {
        dates[i] = first[i].fecha;
    }

    const years = [...new Set(dates.map(x => x.split('/')[2]))].sort()

    res.json({value: years, label: years})
}

export const getCitasFreq = async (req, res) => {

    const {year} = req.body;
    console.log(year)
    
    const first = await Cita.find();
    const dates = []
    const dates_year = []
    const months = new Array(12).fill(0);
    const respuesta = {}

    for (var i=0; i<first.length; ++i) {
        dates[i] = first[i].fecha
    }

    for (var i=0; i<dates.length; ++i) {
        if(dates[i].includes(year)) {
            dates_year[i] = dates[i];
        }
    }

    for (var i = 1; i < 13; ++i) {
        for(var j = 0; j< dates_year.length; ++i) {
            if(toString(i) == dates_year[j].split('/')[1]) {
                months[i] += 1
            }
        }
    }

    for (var i=1; i <= months.length; ++i) {
        respuesta[i] = {
            name: month_names[i],
            value: months[i]
        }
    }

    res.json(respuesta)
}