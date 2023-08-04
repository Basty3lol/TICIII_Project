import "./citas.css"

import { DataGrid } from '@mui/x-data-grid';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import { styled } from '@mui/material/styles';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import es from 'dayjs/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { visuallyHidden } from '@mui/utils';
import axios from "axios";


const host = process.env.REACT_APP_HOST_BACKEND
global.userId = null;

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

function Citas() {
  function clean (rut) {
    return typeof rut === 'string'
      ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
      : ''
  }

  function format(rut, options = {
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

  const [value, setValue] = useState(null);
  const [selectValue, setSelectValue] = useState("");
  const [open, setOpen] = React.useState(false);

  const [calendar, setCalendar] = useState(Array);
  const [selectionModel, setSelectionModel] = React.useState([]);

  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);

  const [rut, setRut] = useState("");
  const [detalles, setDetalles] = useState({});

  const updateAsistir = async () => {
    try{
      const response = await axios.post((host+"/api/calendar/updateCitaState"),{id_cita: selectionModel[0], state:"Atendido"},
        {headers: {'x-access-token': localStorage.getItem("token")}
      })
      if(selectValue === "Dia"){
        for(var i=0; i < rows.length; i++){
          if(rows[i].id === selectionModel[0]){
            rows[i].state = "Atendido";
            break;
          }
        }
      }
      else{
        for(var i=0; i < rows2.length; i++){
          if(rows2[i].id === selectionModel[0]){
            rows2[i].state = "Atendido";
            break;
          }
        }
      }
    }catch (error) {
      return
    }
  }
  
  const updateNoAsistir = async () => {
    try{
      console.log(selectionModel[0])
      const response = await axios.post((host+"/api/calendar/updateCitaState"),{id_cita: selectionModel[0], state:"NoAtendido"},
        {headers: {'x-access-token': localStorage.getItem("token")}
      })
      if(selectValue === "Dia"){
        for(var i=0; i < rows.length; i++){
          if(rows[i].id === selectionModel[0]){
            rows[i].state = "NoAtendido";
            break;
          }
        }
      }
      else{
        for(var i=0; i < rows2.length; i++){
          if(rows2[i].id === selectionModel[0]){
            rows2[i].state = "NoAtendido";
            break;
          }
        }
      }
    }catch (error) {
      return
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Nombre Completo',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 250,
    },
    {
      field: 'edad',
      headerName: 'Edad',
      type: 'number',
      width: 70,
    },
    {
      field: 'hora',
      headerName: 'Hora',
      type: 'string',
      width: 70,
      sortComparator: (v1, v2) => Number(v1.split(":")[0]+v1.split(":")[1]) - Number(v2.split(":")[0]+v2.split(":")[1])
    },
    {
      field: 'state',
      headerName: 'Estado',
      type: 'string',
      width: 110,
    },
    {
      field: 'pago',
      headerName: 'Pago',
      type: 'string',
      width: 110,
    }
  ];

  const columns2 = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Nombre Completo',
      sortable: false,
      width: 250,
    },
    {
      field: 'edad',
      headerName: 'Edad',
      type: 'string',
      width: 70,
    },
    {
      field: 'hora',
      headerName: 'Hora',
      type: 'string',
      width: 70,
      sortComparator: (v1, v2) => Number(v1.split(":")[0]+v1.split(":")[1]) - Number(v2.split(":")[0]+v2.split(":")[1])
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      type: 'string',
      width: 110,
      sortComparator: (v1, v2) => new Date(v1.split("/")[2]+"-"+v1.split("/")[1]+"-"+v1.split("/")[0]).getTime() - new Date(v2.split("/")[2]+"-"+v2.split("/")[1]+"-"+v2.split("/")[0]).getTime()
    },
    {
      field: 'state',
      headerName: 'Estado',
      type: 'string',
      width: 110,
    },
    {
      field: 'pago',
      headerName: 'Pago',
      type: 'string',
      width: 110,
    }
  ];

  const handleSelect = (e) => {
    setSelectValue(e.target.value);
  };

  const getUser = async () => {
    const responseUser = await axios.post((host+"/api/login/getUserToken"),{},{
      headers: {'x-access-token': localStorage.getItem("token")}
    });
    global.profID = responseUser.data.u.id_prof;
  }

  const getCitas = async (day) => {
    const response = await axios.post((host+"/api/calendar/getCitasByDay"),{fecha: day, id_prof: global.profID},
      {headers: {'x-access-token': localStorage.getItem("token")}
    })
    //console.log(response.data)
    var P = []
    for(var i=0; i < response.data.length; i++){
      P.push(response.data[i])
    }
    setRows(P)
  }

  const disableDays = (date) => {
    const day = date.day();
    return day === 0 || day === 6 || calendar.includes(date.format('DD/MM/YYYY'));
  };

  const getCalendar = async () => {
    const responseUser = await axios.post((host+"/api/login/getUserToken"),{},{
      headers: {'x-access-token': localStorage.getItem("token")}
    });
    //console.log(responseUser.data)
    const response = await axios.post((host+"/api/calendar"),{"rut_prof":responseUser.data.u.rut})
    var P = []
    for(var i=0; i < response.data.fechas.length; i++){
      P.push(response.data.fechas[i])
    }
    setCalendar(P);
    //console.log(response.data.fechas)
  }

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!value) {
      return <PickersDay {...pickersDayProps} />;
    }

    const start = value.startOf('week');
    const end = value.endOf('week');
    
    const dayIsBetween = date.isBetween(start, end, null, '[]');
    const isFirstDay = date.isSame(start, 'day');
    const isLastDay = date.isSame(end, 'day');

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  }

  async function getDatesInRange(startDate, endDate) {
    var date = startDate.toDate();

    const dates = [];
    var end = endDate.toDate();

    while (date <= end) {
      var day = date.getDay()
      var d = dayjs(date)
      if(!(day === 0 || day === 6 || calendar.includes(d.format('DD/MM/YYYY')))){
        dates.push(d.format("DD/MM/YYYY"))
      }
      date.setDate(date.getDate() + 1);
    }
  
    const response = await axios.post((host+"/api/calendar/getCitasByWeek"),{fechas: dates, id_prof: global.profID},
      {headers: {'x-access-token': localStorage.getItem("token")}
    })
    console.log(response.data)

    var P = []
    for(var i=0; i < response.data.length; i++){
      P.push(response.data[i])
    }
    setRows2(P);
  }

  const getCitasByRut = async () => {
    const response = await axios.post((host+"/api/calendar/getCitasByRutClient"),{rut: rut, id_prof: global.profID},
      {headers: {'x-access-token': localStorage.getItem("token")}
    })

    var P = []
    for(var i=0; i < response.data.length; i++){
      P.push(response.data[i])
    }
    setRows2(P);
  }

  const getDetalles = () => {
    var a = [];
    if(selectValue === "Dia"){
      a = rows
    }
    else{
      a = rows2
    }
    var det = {} 
    for(var i=0; i < a.length; i++){
      if(a[i].id === selectionModel[0]){
        det = a[i];
        break;
      }
    }
    setDetalles(det)
  }

  const handleChangeRut = async (e) => {
    if((e.target.value).length <= 12){
      if(e.target.value.length <= 1){
        setRut(null)
      }
      else{
        setRut(format(e.target.value))
      }
    }
  }

  const renderContent = () => {
    if(selectValue === "Dia"){
      return(
        <Row>
          <Col className="col1" md={8} xs={8} offset={8}>
          {
          <DataGrid
            checkboxSelection
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            onSelectionModelChange={(newSelectionModel) => {
              if(newSelectionModel.length > 0) {
                setSelectionModel([newSelectionModel[newSelectionModel.length - 1]]);
              }
              else{
                setSelectionModel(newSelectionModel);
              }
            }}
            selectionModel={selectionModel}
          />
          }
          </Col>
          <Col className="col2" md={4} xs={4} offset={12}>
            <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
            <CalendarPicker 
            date={value}
            disablePast={true}
            shouldDisableDate={disableDays}
            name="fecha"
            inputFormat="DD/MM/YYYY"
            onChange={ (newDate) => {
              setValue(newDate);
              //console.log(newDate.format('DD/MM/YYYY'))
              getCitas(newDate.format('DD/MM/YYYY'))
              //handleChange({target:{name:"fecha", value: newDate.format('DD/MM/YYYY')}})
              //getHours(newDate.format('DD/MM/YYYY'), newDate.day());

            }}
            />
            </LocalizationProvider>
          </Col>
        </Row>
      )
    }
    else if(selectValue === "Semana"){
      return(
        <Row>
          <Col className="col1" md={8} xs={8} offset={8}>
            <DataGrid
              checkboxSelection
              rows={rows2}
              columns={columns2}
              pageSize={10}
              rowsPerPageOptions={[10]}
              onSelectionModelChange={(newSelectionModel) => {
                if(newSelectionModel.length > 0) {
                  setSelectionModel([newSelectionModel[newSelectionModel.length - 1]]);
                }
                else{
                  setSelectionModel(newSelectionModel);
                }

              }}
              selectionModel={selectionModel}
            />
          </Col>
          <Col className="col2" md={4} xs={4} offset={12}>
            <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              label="Week picker"
              value={value}
              disablePast={true}
              shouldDisableDate={disableDays}
              onChange={(newValue) => {
                setValue(newValue);
                const start = newValue.startOf('week');
                const end = newValue.endOf('week');
                console.log(getDatesInRange(start,end))
              }}
              renderDay={renderWeekPickerDay}
              renderInput={(params) => <TextField {...params} />}
              inputFormat="'Week of' MMM d"
            />
            </LocalizationProvider>
          </Col>
        </Row>
      )
    }
    else if(selectValue === "Rut"){
      return(
      <Row>
      <Col className="colc" md={12} xs={12} offset={12}>
      <DataGrid className="grid"
        checkboxSelection
        rows={rows2}
        columns={columns2}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onSelectionModelChange={(newSelectionModel) => {
          if(newSelectionModel.length > 0) {
            setSelectionModel([newSelectionModel[newSelectionModel.length - 1]]);
          }
          else{
            setSelectionModel(newSelectionModel);
          }
        }}
        selectionModel={selectionModel}
      />
      </Col>
      </Row>
      )
    }
  }

  return (
    <Container>
        <Row className="row1">
        <Col className="col-c" md offset={5}>
        <FormControl className="form-filtro">
          <InputLabel className="label-in" id="demo-simple-select-autowidth-label">Buscar citas por:</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            name="filtro"
            value={selectValue}
            onChange={(e)=>{
              if(global.userId === null){
                getUser();
              }
              handleSelect(e);
              setRows([])
              setRows2([])
              setSelectionModel([])
              setValue(null)
              if(calendar.length <0){
                getCalendar();
              }
            }}
            autoWidth
            label="Buscar citas por:"
          >
            <MenuItem key={"dia"} value={"Dia"}>Día</MenuItem>
            <MenuItem key={"week"} value={"Semana"}>Semana</MenuItem>
            <MenuItem key={"rut"} value={"Rut"}>Rut Paciente</MenuItem>
          </Select>
          </FormControl>
        </Col>
        <Col className="col-c" md offset={10}>
        {selectValue === "Rut" &&
          <FloatingLabel className="form-rut"  label="Rut">
          <Form.Control id="rut"
            className="texto1" label="Rut" name="rut" value={rut} onChange={handleChangeRut}/>
          </FloatingLabel>
        }
        </Col>
        <Col className="col-c3" md offset={12}>
        {selectValue === "Rut" &&
          <Button variant="success" className="btn-buscar" onClick={getCitasByRut}>Buscar</Button>
        } 
        </Col>  
        </Row>
        {/* =================================================================================================== */}
        
        {renderContent()}
        
        <Row>
        {selectionModel.length > 0 && 
          <Col className="colc" md={12} xs={12} offset={12}>
          {selectValue !== "Rut" &&
          <Button variant="danger" className="btn-nollego" onClick={()=>{updateNoAsistir()}}>No asistió</Button>
          }{" "}
          <Button variant="secondary" className="btn-detalle" onClick={()=>{
            getDetalles()
            if(detalles.id !== null) {
              handleClickOpen()
            }
          }}>Ver detalles</Button>{" "}
          {selectValue !== "Rut" &&
          <Button variant="success" className="btn-llego" onClick={updateAsistir}>Si asistió</Button>
          }
          
          </Col>
        }
        </Row>
        <Row>
        <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Detalles del paciente {detalles.name}</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              ID de cita:
              <DialogContentText>
               {detalles.id}
              </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Nombre completo: 
              <DialogContentText>
              {detalles.name}
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Rut:
              <DialogContentText>
              {detalles.rut}
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Edad:
              <DialogContentText>
              {detalles.edad} Años
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Correo: 
              <DialogContentText>
              {detalles.email}
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Telefono:
              <DialogContentText>
              {detalles.phone}
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Fecha de cita:
              <DialogContentText>
              {detalles.fecha}
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Hora de la cita: 
              <DialogContentText>
              {detalles.hora}
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Estado: 
              <DialogContentText>
              {detalles.state}
            </DialogContentText>
            </Typography>
            <Typography gutterBottom>
              Motivo de consulta:
              <DialogContentText>
              {detalles.description}
            </DialogContentText>
            </Typography>
            

          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Atras</Button>
        </DialogActions>
      </Dialog>
      </Row>
    </Container>
    )
}
export default Citas