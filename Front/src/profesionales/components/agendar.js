import {React, useState} from "react";
import TextField from "@material-ui/core/TextField";
import { Button, ButtonGroup } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import {Container, Row, Col, Alert} from "react-bootstrap"
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import dayjs from "dayjs";
import { Dayjs } from 'dayjs';
import es from 'dayjs/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";
import "./agendar.css"
import { DataGrid } from '@mui/x-data-grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import emailjs from "@emailjs/browser";

import { validateEmail, validateRut, validatePhoneNumber, validateBirth } from "../../auth/validate-data"


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

const host = process.env.REACT_APP_HOST_BACKEND
global.profID = null
global.rut_prof = null

function Agendar() {
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

  const verify = () => {
    //console.log(validateBirth(credentials.birth))
    if(!validateRut(credentials.rut)){
      console.log(credentials.rut)
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
    pago:"clinica"
  });

  const [errorValue, setErrorValue] = useState({
    rut:false,
    name:false,
    birth:false,
    email:false,
    phone:false,
    profesional:false
  });

  const resetCredentials = () => {
    setCredentials({
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
    })
  }

  const handleAdd = () => {
    if(rows.length > 0){
      var mid = 0
      var P = []
      for(var i=0 ; i<rows.length ; i++){
        if(rows[i].id > mid){
          mid = rows[i].id;
        }
        P.push(rows[i])
      }
      P.push({id:mid+1,fecha:credentials.fecha,hora:credentials.hora,description:credentials.descripcion})
      setRows(P)
      setCredentials({
        ...credentials,
        "fecha":"",
        "hora":"",
        "descripcion":""
      })
      setValue2(null)
    }
    else{
      setRows([{id:1,fecha:credentials.fecha,hora:credentials.hora,description:credentials.descripcion}])
      setCredentials({
        ...credentials,
        "fecha":"",
        "hora":"",
        "descripcion":""
      })
      setValue2(null)
    }
  }

  const submitForm = async () => {
    if(credentials.name !== "" || credentials.rut !== "" || credentials.phone !== ""){
      console.log(global.rut_prof)
      for(var i=0; i < rows.length ; i++){
        try{
          const response = await axios.post((host+"/api/calendar/createCita"),{
            nombre: credentials.name,
            rut_cliente: credentials.rut,
            edad: credentials.age,
            birth: credentials.birth,
            telefono: credentials.phone, 
            correo: credentials.email,
            fecha: rows[i].fecha, 
            hora: rows[i].hora,
            grupo: credentials.grupo,
            descripcion: rows[i].description,
            rut_prof: global.rut_prof,
            pago:"clinica"
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
              fecha: rows[i].fecha,
              hora: rows[i].hora
            }
            ,"EaaNqcsoFQnUBoXtm");
          }
        }
        catch(err){
          setSubmitAlert("Ha ocurrido un error, intente de nuevamente.")
        }
      }
    }
    resetCredentials()
    setRows([])
    setValue2(null)
    setCalendar([])
    setValue(null)
    setPaso(1)
  }
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'fecha',
      headerName: 'Fecha',
      type: 'string',
      width: 170,
      sortComparator: (v1, v2) => new Date(v1.split("/")[2]+"-"+v1.split("/")[1]+"-"+v1.split("/")[0]).getTime() - new Date(v2.split("/")[2]+"-"+v2.split("/")[1]+"-"+v2.split("/")[0]).getTime()
    },
    {
      field: 'hora',
      headerName: 'Hora',
      type: 'string',
      width: 70,
      sortComparator: (v1, v2) => Number(v1.split(":")[0]+v1.split(":")[1]) - Number(v2.split(":")[0]+v2.split(":")[1])
    },
    {
      field: 'description',
      headerName: 'Desc',
      type: 'string',
      sortable:false,
      width: 250,
    }
  ];

  const [paso, setPaso] = useState(1)
  const [value, setValue] = useState(null)
  const [value2, setValue2] = useState(null)
  const [selectionModel, setSelectionModel] = useState([]);
  const [rows, setRows] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [horas, setHoras] = useState([]);
  const [submitAlert, setSubmitAlert] = useState("");

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

  const disableDays = (date) => {
    const day = date.day();
    
    return day === 0 || day === 6 || calendar.includes(date.format('DD/MM/YYYY'));
  };

  const getUser = async () => {
    const responseUser = await axios.post((host+"/api/login/getUserToken"),{},{
      headers: {'x-access-token': localStorage.getItem("token")}
    });
    console.log(responseUser.data.u.id_prof)
    global.profID = responseUser.data.u.id_prof;
    global.rut_prof = responseUser.data.u.rut
  }

  const getHours = async (fecha,day) => {
    const response = await axios.post((host+"/api/calendar/getHours"),{"fecha":fecha,"dia":day,"rut_prof":global.rut_prof})
    var h_t = []
    var f_t = []
    for(var i=0 ; i<rows.length;i++){
      h_t.push(rows[i].hora)
      f_t.push(rows[i].fecha)
    }

    var P = []
    for(var i=0; i < response.data.horas.length; i++){
      var d = new Date()
      var h = response.data.horas[i].split(":")
      var d2 = dayjs(d)

      if(d2.format("DD/MM/YYYY") === fecha){
        if((Number(h[0]) - d.getHours() > 0 || (Number(h[0]) - d.getHours() === 0 && Number(h[1]) - d.getMinutes() >= 30))){
          P.push(response.data.horas[i])
        }
      }
      else if(f_t.includes(fecha)){
        if(!h_t.includes(response.data.horas[i])){
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

  const handleDelete = () => {
    var P = []
    for(var i=0 ; i<rows.length ; i++){
      if(!selectionModel.includes(rows[i].id)){
        P.push(rows[i])
      }
    }
    setRows(P)
    setSelectionModel([])
  }

  const getAge = () => {
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
  }

  const getPaciente = async () => {
    try{
      const response = await axios.post((host+"/api/calendar/getPaciente"),{rut: credentials.rut},
        {headers: {'x-access-token': localStorage.getItem("token")}
      })

      if(response.status === 200){
        var d = new Date(response.data.cli.birth.split("/")[2]+"-"+response.data.cli.birth.split("/")[1]+"-"+response.data.cli.birth.split("/")[0])
        d.setDate(d.getDate() + 1);
        setValue(dayjs(d))
        setCredentials({
          ...credentials,
          "name": response.data.cli.name,
          "birth": response.data.cli.birth,
          "email": response.data.cli.email,
          "phone": response.data.cli.phone
        })
      }
    }
    catch{
      resetCredentials()
    }
  }

  const renderForms = () => {
    if(paso === 1){
      return(
        <Row>
        <form className="form-agenda form-center">
          <TextField 
            inputProps={{ maxLength: 12 }}
            helperText={!errorValue.rut ? "": "Rut invalido"}
            error={errorValue.rut} 
            className="textorut" id="rut" label="Rut" name="rut" value={credentials.rut} onChange={handleChange}/>

          <Button variant="contained" className="boton-buscar" onClick={() => {
            getPaciente()
          }}>
          Buscar
          </Button>


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

          <Button variant="contained" className="boton-sig" onClick={() => {
            if(verify()){
              setPaso(2)
            }
            if(global.profID === null){
              getUser() 
            }
            getAge()
          }}>
          Siguiente
          </Button>
        </form>
        </Row>
      )
    }
    if(paso === 2){
      return(
      <Row>
      <Col className="colc" md={6} xs={6} offset={6}>
      <form className="form-agenda2">

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

      {
        credentials.fecha !== "" &&
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

      <TextField multiline maxRows={5}
          className="texto-desc" id="descripcion" label="Motivo de consulta" 
          name="descripcion" value={credentials.descripcion} onChange={handleChange}/>
      {credentials.fecha !== "" && credentials.hora !== "" &&
      <Button variant="contained" className="boton-sig boton-add" onClick={() => {
            handleAdd()
          }}>
          Agregar
      </Button>
      }
      </form>
      </Col>
      <Col className="colc" md={6} xs={6} offset={12}>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
      />
      <form className="form-agenda2">
        <Button variant="contained" className="boton-sig boton-borrar" onClick={() => {
              handleDelete()
            }}>
            Borrar
        </Button>
      </form>
      </Col>
      </Row>
      )
    }
  }

  return (
    <Container>
      
      {renderForms()}
      
      {paso === 2 &&
      <Col className="col-c" md={12} xs={12} offset={12}>
      <form className="form-agenda form-center">
      <ButtonGroup aria-label="outlined primary button group" className="grupo-btn">
        <Button variant="contained" className="boton-atras" onClick={() => {setPaso(1)}}>Atras</Button>
        {rows.length > 0 &&
        <Button variant="contained" className="boton-enviar" onClick={submitForm}>Agendar</Button>
        }
      </ButtonGroup>
      </form>
      </Col>
      }
      {/* {submitAlert.length>0 && <div><Alert variant='danger'>{submitAlert}</Alert></div>} */}
      
    </Container>
    )
}
export default Agendar