import React from 'react';
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import emailjs from "@emailjs/browser";
import axios from "axios";

const host = process.env.REACT_APP_HOST_BACKEND

function Confirmacion() {
    const navigation = useNavigate()
    const [credentials, setCredentials] = useState({
      rut:"",
      name:"",
      age:0,
      birth: null,
      email:"",
      phone:"",
      grupo:"",
      //segunda parte del formulario
      profesional:"",
      profesionalName:"",
      idProf:null,
      fecha:"",
      dia:null,
      hora:"",
      descripcion:"",
      pago:"online"
  });

  const submitForm = async () => {
    if(credentials.name !== "" || credentials.rut !== "" || credentials.profesional !== "" || credentials.fecha !== "" || credentials.hora !== "" || credentials.phone !== ""){
      try{
        const response = await axios.post((host+"/api/calendar/createCita"),{
          nombre: credentials.name,
          rut_cliente: credentials.rut,
          birth: credentials.birth,
          edad: credentials.age,
          telefono: credentials.phone, 
          correo: credentials.email,
          fecha: credentials.fecha, 
          hora: credentials.hora,
          grupo: credentials.grupo,
          descripcion: credentials.descripcion,
          rut_prof: credentials.profesional,
          pago:"online"
        })

        if(response.status === 200){
          console.log(response.data.message)
        }
        else if(response.status === 201){
          emailjs.send("guardiavieja1","template_eso42io",{
            name: credentials.name,
            email: credentials.email,
            codigo: response.data.code,
            fecha: credentials.fecha,
            hora: credentials.hora
          }
          ,"EaaNqcsoFQnUBoXtm");
          //resetCredentials()
        }
      }
      catch(err){
        console.log("Error")
      }
    }
    else{
      console.log("Error")
    }
  }

  
  Swal.fire({
      title: 'Pago confirmado!',
      text: 'Has click aqui para continuar',
      icon: 'success',
      confirmButtonText: 'Continuar'
  })
  .then((result) => {
    if (result.value) {
      navigation("/")
    }
  })
//<a style="color:#FFF" href="http://localhost:3000/"></a>
  useEffect(() => {
    if(localStorage.getItem("name") !== ""){
      credentials.name = localStorage.getItem("name");
      credentials.rut = localStorage.getItem("rut");
      credentials.age = localStorage.getItem("age");
      credentials.birth = localStorage.getItem("birth");
      credentials.phone = localStorage.getItem("phone");
      credentials.email = localStorage.getItem("email");
      credentials.fecha = localStorage.getItem("fecha");
      credentials.hora = localStorage.getItem("hora");
      credentials.grupo = localStorage.getItem("grupo");
      credentials.descripcion = localStorage.getItem("descripcion");
      credentials.profesional = localStorage.getItem("profesional");

      localStorage.setItem("name","")
      localStorage.setItem("rut","")
      localStorage.setItem("age","")
      localStorage.setItem("phone","")
      localStorage.setItem("email","")
      localStorage.setItem("fecha","")
      localStorage.setItem("hora","")
      localStorage.setItem("grupo","")
      localStorage.setItem("descripcion","")
      localStorage.setItem("profesional","")

      submitForm()
      console.log("Reservado")
    }
    
  })
  return (
    <div>
    
    </div>
  )
}



export default Confirmacion