import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import imagen_back from './css-img/fondo.jpg';
import imagen_handshake from './css-img/Handshake.png';
import imagen_comunity from './css-img/comunity.png';
import imagen_person_acount from './css-img/person_acount.png';
import './css-img/css-inicio.css';


function Inicio() {
  return (
    <Container fluid className="conta">
      <style type="text/css">{/* utilizar esta configuracion en vez de css bootstrap */}
      {`
      .row>*{
        padding-right: 0px !important;
        padding-left: 0px !important;
      }
      `}
      </style>
      <Row>
        <img src={imagen_back} className="img-fluid" alt="Reserva Tu Horas" />  
      </Row>
      <Row>
        <Col className="col-1" md={12} xs={12} offset={6}>
        <h2>NUESTRAS ESPECIALIDADES</h2>
        </Col>
      </Row>
      <Row className="last-row">
        <Col className="col-2" md={4} xs={4} offset={4}>
        <img src={imagen_handshake} alt="" className="img-fluid"/>
        </Col>
        <Col className="col-2" md={4} xs={4} offset={4}>
        <img src={imagen_comunity} alt="" className="img-fluid"/>
        
        </Col>
        <Col className="col-2" md={4} xs={4} offset={4}>
        <img src={imagen_person_acount} alt="" className="img-fluid"/>

        </Col>
      </Row>
      <Row className="last-row">
        <Col className="col-3" md={4} xs={4} offset={4}>
        <h3 className="texto">Apoyo emocional</h3>
        </Col>
        <Col className="col-3" md={4} xs={4} offset={4}>
        <h3 className="texto">Terapia niños y adolescentes</h3>
        </Col>
        <Col className="col-3" md={4} xs={4} offset={4}>
        <h3 className="texto">Terapia adultos</h3>
        </Col>
      </Row>
      <Row className="last-row">
        <Col className="col-44" md={4} xs={4} offset={4}>
        <h6 className="texto">Brindamos psicoterapia desde distintas perspectivas y orientadas a las necesidades de nuestros pacientes.</h6>
        </Col>
        <Col className="col-44" md={4} xs={4} offset={4}>
        <h6 className="texto">Contamos con profesionales especializados en NNA.</h6>
        </Col>
        <Col className="col-44" md={4} xs={4} offset={4}>
        <h6 className="texto">Prestamos atención adultos de todas las edades.</h6>
        </Col>
      </Row>
      
    </Container>
)}
export default Inicio