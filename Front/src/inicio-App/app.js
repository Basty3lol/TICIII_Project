import "./app.css"
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

//Componenetes de la pagina
import Inicio from '../components/inicio'
import Nosotros from '../components/nosotros'
import Agenda from '../components/agenda'
import Login from "../components/login"
import VerCitas from "../components/ver_citas"
import BasicExample from '../layouts/navbar'
import Confirmacion from "../components/confirmacion";
import Rechazado from "../components/rechazado";

//componentes de profesionales
import NavbarProf from "../profesionales/navbar/navbar"
import Agendar from "../profesionales/components/agendar"
import Citas from "../profesionales/components/citas"
import Stats from "../profesionales/components/stats"

import {ProtectedRoute} from "../profesionales/ProtectedRoute"



function App() {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BasicExample />}>
                  <Route path="/" element={ <Inicio />}/> 
                  <Route path="/nosotros" element={ <Nosotros />}/> 
                  <Route path="/agendar" element={ <Agenda />}/>
                  <Route path="/ver_citas" element={ <VerCitas />}/>
                  <Route path="/login" element= {<Login/>}/>
                  <Route path="/confirmacion" element= {<Confirmacion/>}/>
                  <Route path="/rechazado" element= {<Rechazado/>}/>
                  <Route path="*" element={<Navigate replace to="/"/>}/>
                </Route>
                <Route element={<ProtectedRoute/>}>
                  <Route path="/prof" element={<NavbarProf />}>
                    <Route path="/prof/ver_citas" element={ <Citas />}/> 
                    <Route path="/prof/agendar" element={ <Agendar />}/>
                    <Route path="/prof/stats" element={ <Stats />}/>
                    <Route path="*" element={<Navigate replace to="/prof"/>}/>
                  </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;