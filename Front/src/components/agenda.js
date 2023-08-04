import "./css-img/agenda.css";
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Button, ButtonGroup } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import {Container, Row, Col, Alert} from "react-bootstrap"
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import emailjs from "@emailjs/browser";
import Form from 'react-bootstrap/Form';

import dayjs from "dayjs";
import { Dayjs } from 'dayjs';
import es from 'dayjs/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { validateEmail, validateRut, validatePhoneNumber, validateBirth } from "../auth/validate-data"

const host = process.env.REACT_APP_HOST_BACKEND

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const Agenda = () => {
  function clean (rut) {
    return typeof rut === 'string'
      ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
      : ''
  }

  function format (rut, options = {
    dots: true
  }) {
    rut = clean(rut)
  
    let result
    if (options.dots) {
      result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1)
      for (let i = 4; i < rut.length; i += 3) {
        result = rut.slice(-3 - i, -i) + '.' + result
      }
    } else {
      result = rut.slice(0, -1) + '-' + rut.substr(rut.length - 1)
    }
  
    return result
  }
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [submitAlert, setSubmitAlert] = useState("");
  const [timeRedirect, setRedirect] = useState(5);

  const [page, setPage] = useState(0);
  const [profesionales, setProfesionales] = useState(Array)
  const [calendar, setCalendar] = useState(Array)
  const [horas, setHoras] = useState(Array)
  
  const [checkbox, setCheckbox] = useState([true,false])

  const [errorValue, setErrorValue] = useState({
    rut:false,
    name:false,
    birth:false,
    email:false,
    phone:false,
    profesional:false
  });

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
    pago:"presencial"
  });
  
  const verify = () => {
    //console.log(validateBirth(credentials.birth))
    if(!validateRut(credentials.rut)){
      setErrorValue({
        ...errorValue,
        rut: true
      })
      return false
    }
    else{
      errorValue.rut = false
    }

    if((credentials.name.trim()).length < 5){
      setErrorValue({
        ...errorValue,
        name: true
      })
      return false
    }
    else{
      errorValue.name = false
    }

    if(!validateBirth(credentials.birth)){
      setErrorValue({
        ...errorValue,
        birth: true
      })
      return false
    }
    else{
      errorValue.birth = false
    }

    if(!validateEmail(credentials.email)){
      setErrorValue({
        ...errorValue,
        email: true
      })
      return false
    }
    else{
      errorValue.email = false
    }

    if(!validatePhoneNumber(credentials.phone)){
      setErrorValue({
        ...errorValue,
        phone: true
      })
      return false
    }
    else{
      errorValue.phone = false
    }

    

    return true
  }
  
  const handleChange = (e) =>{
    if(e.target.name === "rut"){
      if(e.target.value.length <= 1){
        setCredentials({
          ...credentials,
          [e.target.name]: e.target.value
        })
      }
      else{
        setCredentials({
          ...credentials,
          [e.target.name]: format(e.target.value)
        })
      }
    }
    else{
      setCredentials({
        ...credentials,
        [e.target.name]: e.target.value
      })
    }
    //console.log(e.target.name,e.target.value)
  }
  
  const resetCredentials = () => {
    setCredentials({
      rut:"",
      name:"",
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
      descripcion:""
    })
  }

  const disableDays = (date) => {
    const day = date.day();
    
    return day === 0 || day === 6 || calendar.includes(date.format('DD/MM/YYYY'));
  };

  const getCalendar = async (rut_prof) => {
    const response = await axios.post((host+"/api/calendar"),{"rut_prof":rut_prof})
    var P = []
    for(var i=0; i < response.data.fechas.length; i++){
      P.push(response.data.fechas[i])
    }
    await setCalendar(P)
    //console.log(response.data.fechas)
  }

  const getHours = async (fecha,day) => {
    const response = await axios.post((host+"/api/calendar/getHours"),{"fecha":fecha,"dia":day,"rut_prof":credentials.profesional})
    
    var P = []
    for(var i=0; i < response.data.horas.length; i++){
      var d = new Date()
      var h = response.data.horas[i].split(":")
      var d2 = dayjs(d)
      console.log(d2,fecha)
      if(d2.format("DD/MM/YYYY") === fecha){
        if((Number(h[0]) - d.getHours() > 0 || (Number(h[0]) - d.getHours() === 0 && Number(h[1]) - d.getMinutes() >= 30))){
          P.push(response.data.horas[i])
        }
      }
      else{
        P.push(response.data.horas[i])
      }
    }
    setHoras(P)
    //console.log(horas)
  }

  const getProfesionales = async () => {
    // niño y adolencentes 1-13 y 14-17
    // adultos de 18 en adelante
    var today = new Date();
    var datesplit=credentials.birth.split('/');
    var year = datesplit[2]
    var month = datesplit[1]
    var day = datesplit[0]
    var age = today.getFullYear() - year;
    if (today.getMonth() < month || (today.getMonth() === month && today.getDate() < day)) {
      age--;
    }
    credentials.age = age;
    var grupe = "";

    if(age >= 18){
      grupe = "adultos"
    }
    else if(0 <= age <=13){
      grupe = "niños";
    }
    else if(14 <= age <= 17){
      grupe = "adolecentes"
    }
    
    credentials.grupo = grupe;
    const response = await axios.post((host+"/api/calendar/getProfesional"),{"grupo":grupe})

    var P = []
    for(var i=0; i < response.data.prof.length; i++){
      P.push(response.data.prof[i])
    }
    await setProfesionales(P)
  }
  
  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const redirectTime = async () => {
    var count = 0;
    while(count < 6){
      await sleep(1000);
      setRedirect(5-count);
      count++;
    }
    navigate("/")
  }

  const submitForm = async () => {
    if(credentials.name !== "" || credentials.rut !== "" || credentials.profesional !== "" || credentials.fecha !== "" || credentials.hora !== "" || credentials.phone !== ""){
      if(credentials.pago === "online"){
        const pago = await axios.post((host+"/pago"),{
          title: credentials.profesionalName,
          unit_price: 10000,
          quantity: 1,
          currency_id:"CLP",
        })

        localStorage.setItem("name",credentials.name)
        localStorage.setItem("rut",credentials.rut)
        localStorage.setItem("age",credentials.age)
        localStorage.setItem("birth", credentials.birth,)
        localStorage.setItem("phone",credentials.phone)
        localStorage.setItem("email",credentials.email)
        localStorage.setItem("fecha",credentials.fecha)
        localStorage.setItem("hora",credentials.hora)
        localStorage.setItem("grupo",credentials.grupo)
        localStorage.setItem("descripcion",credentials.descripcion)
        localStorage.setItem("profesional",credentials.profesional)
        
        window.location.replace(pago.data)
      }
      else if(credentials.pago === "presencial"){
        try{
          const response = await axios.post((host+"/api/calendar/createCita"),{
            nombre: credentials.name,
            rut_cliente: credentials.rut,
            edad: credentials.age,
            birth: credentials.birth,
            telefono: credentials.phone, 
            correo: credentials.email,
            fecha: credentials.fecha, 
            hora: credentials.hora,
            grupo: credentials.grupo,
            descripcion: credentials.descripcion,
            rut_prof: credentials.profesional,
            pago:"presencial"
          })

          if(response.status === 200){
            setSubmitAlert(response.data.message)
          }
          else if(response.status === 203){
            setSubmitAlert(response.data.message)
          }
          //============================================================================
          else if(response.status === 201){
            emailjs.send("guardiavieja1","template_eso42io",{
              name: credentials.name,
              email: credentials.email,
              codigo: response.data.code,
              fecha: credentials.fecha,
              hora: credentials.hora
            }
            ,"EaaNqcsoFQnUBoXtm");
            resetCredentials()
            redirectTime()
            setPage(2)
          }
        }
        catch(err){
          setSubmitAlert("Ha ocurrido un error, intente de nuevamente.")
        }
      }
    }
    else{
      setSubmitAlert(true)
    }
  }

  const setProfesional = (e) => {
    for(var i=0; profesionales.length > i; i++) {
      if(profesionales[i].rut === e.target.value){
        credentials.profesionalName = profesionales[i].nombre + " " + profesionales[i].apellido
        break;
      }
    }
  }

  const pageDisplay = () =>{
    if(page === 0){
      return (
        <form className="form-agenda form-center">
          <TextField 
            inputProps={{ maxLength: 12 }}
            helperText={!errorValue.rut ? "": "Rut invalido"}
            error={errorValue.rut} 
            className="texto1" id="rut" label="Rut" name="rut" value={credentials.rut} onChange={handleChange}/>
          
          <TextField
          helperText={!errorValue.name ? "": "Campo obligatorio"}
          error={errorValue.name}
          className="texto1" id="name" label="Nombre y Apellidos" name="name" value={credentials.name} onChange={handleChange}/>
          
          <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
          <DatePicker className="texto1"
            disableFuture
            locale={es}
            inputFormat="DD/MM/YYYY"
            label="Fecha de nacimiento del paciente"
            openTo="year"
            views={['year', 'month', 'day']}
            value={value}
            
            renderInput={(params) => <TextField error={true} id="birth" name="birth" {...params}/>}
            onChange={(newValue) => {
              setValue(newValue);
              if(newValue){
                handleChange({target:{name:"birth", value:newValue.format('DD/MM/YYYY')}})
              }
              else{
                handleChange({target:{name:"birth", value:null}})
              }
            }}
          />
          </LocalizationProvider>

          <TextField 
          helperText={!errorValue.email ? "": "Correo invalido"}
          error={errorValue.email} 
          className="texto1" id="correo" label="Correo electronico de contacto" name="email" value={credentials.email} onChange={handleChange}/>

          <TextField 
          inputProps={{ maxLength: 12 }}
          helperText={!errorValue.phone ? "": "Número invalido"}
          error={errorValue.phone}
          className="texto1" id="phone" label="Numero de celular" 
          placeholder="Ejemplo: +56912345678" name="phone" value={credentials.phone} onChange={handleChange}/>
          
          <TextField multiline maxRows={5}
          className="texto-desc" id="descripcion" label="Motivo de consulta" 
          name="descripcion" value={credentials.descripcion} onChange={handleChange}/>

          <Button variant="contained" className="boton-sig" onClick={() => {
            if(verify()){
              getProfesionales()
              setPage(1)
            }
          }}>
          Siguiente
          </Button>
        </form>
      )
    }
    else if(page === 1){
      return(
        <FormControl className="form-agenda form-center">
        <InputLabel className="label-in" id="demo-simple-select-autowidth-label">Seleccione Profesional</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          name="profesional"
          value={credentials.profesional}
          onChange={(newVal) => {
            setValue2(null);
            credentials.fecha = "";
            setProfesional(newVal);
            handleChange(newVal);           
            getCalendar(newVal.target.value);
          }}
          autoWidth
          label="Seleccione Profesional"
        >
          {profesionales.map((prof) => <MenuItem key={prof.rut} value={prof.rut}>{prof.nombre + " " + prof.apellido}</MenuItem>)}
        </Select>
        
        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
        <CalendarPicker 
        date={value2}
        disablePast={true}
        shouldDisableDate={disableDays}
        name="fecha"
        inputFormat="DD/MM/YYYY"
        onChange={ (newDate) => {
          setValue2(newDate);

          credentials.hora = "";

          handleChange({target:{name:"fecha", value: newDate.format('DD/MM/YYYY')}})
          getHours(newDate.format('DD/MM/YYYY'), newDate.day());

        }}
        />
        </LocalizationProvider>
        
        {credentials.profesional !== "" && credentials.fecha !== "" && horas.length === 0 &&
        <div> No hay horas disponibles este día </div>
        }

        {
        credentials.profesional !== "" && credentials.fecha !== "" &&
        <StyledToggleButtonGroup className="horas-btn-group"
        size="small"
        color="primary"
        value={credentials.hora}
        exclusive
        name="hora"
        onChange={(newValue) => {
          if(newValue){
            handleChange({target:{name:"hora", value: newValue.target.value}})
          }
          else{
            handleChange({target:{name:"hora", value:""}})
          }
        }}
        >
        {horas.map((h) => 
        <ToggleButton key={h} value={h} className="btn-hora">
          {h}
        </ToggleButton>
        )}
        </StyledToggleButtonGroup>
        }

        <div>Método de pago:</div>
        <div key={`inline-radio`} className="mb-3">
          
          <Form.Check
            inline
            label="Efectivo"
            name="group1"
            type="radio"
            id={`inline-"radio"-1`}
            checked={checkbox[0]}
            onChange={(newVal) => {
              if(newVal.target.checked === true){
                setCheckbox([1,0])
                handleChange({target:{name:"pago", value: "presencial"}})
              }         
            }}
          />
          <Form.Check
            inline
            label="Online"
            name="group1"
            type="radio"
            id={`inline-"radio"-2`}
            checked={checkbox[1]}
            onChange={(newVal) => {
              if(newVal.target.checked === true){
                setCheckbox([0,1])
                handleChange({target:{name:"pago", value: "online"}})
              }         
            }}
          />
        </div>

        {submitAlert.length>0 && <div><Alert variant='danger'>{submitAlert}</Alert></div>}

        <ButtonGroup aria-label="outlined primary button group" className="grupo-btn">
        <Button variant="contained" className="boton-atras" onClick={() => {setPage(0)}}>Atras</Button>
        {credentials.pago === "presencial" && credentials.profesional !== "" && credentials.fecha !== "" && credentials.hora !== "" &&
        <Button variant="contained" className="boton-enviar" onClick={submitForm}>Agendar</Button>
        }
        {credentials.pago === "online" && credentials.profesional !== "" && credentials.fecha !== "" && credentials.hora !== "" &&
        <Button variant="contained" className="boton-enviar" onClick={submitForm}>Pagar</Button>
        }
        </ButtonGroup>
        {submitAlert.length>0 && <div><Alert variant='danger'>{submitAlert}</Alert></div>}
      </FormControl>
      )
    }
    else if(page === 2){
      return(
      <div>
        <Alert className="form-center success-alert" variant='success'>Se creó la cita correctamente, Redirigiendo en {timeRedirect}.</Alert>
      </div>
      )
    }
  }

  return (
    <Container fluid className="container-agenda">
    <Row>
        <Col className="col-c" md={12} xs={12} offset={12}>
            {pageDisplay()}
        </Col>
    </Row>
    </Container>
  );
};

export default Agenda