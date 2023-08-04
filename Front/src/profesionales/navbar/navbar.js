import './navbar.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {useNavigate ,Outlet, Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';


function NavbarProf() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if(localStorage.getItem("token")){
      localStorage.removeItem("token")
      navigate("/")
    }
    else{
      navigate("/")
    }
  }

  return (
    <>
    <Navbar className="navBg" expand="lg" variant="dark">
        <style type="text/css">{/* utilizar esta configuracion en vez de css bootstrap */}
        {`
        .navbar-dark .navbar-nav .nav-link {
            color: rgba(255,255,255,.95);
            text-align: center;
        }
        .btn-primary {
          color: #fff;
          background-color: #B96756;
          border-color: #B96756;
          margin-left: 0.5rem;
        }
        .btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
          background-color: #B96756 !important;
        }
        .nav-item {
          text-align: center;
        }
        .navbar-brand {
          margin-right: 0 !important;
        }
        `}
        </style>
        <Container fluid>
        <Navbar.Brand as={Link} to="/prof">
        <img
          alt="logo"
          src="data:image/png;base64,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"
          width="45"
          height="45"
          //className="d-inline-block align-top"
        />{'  '}
        Clinica Psicologica Guardia Vieja
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/prof/stats">Ver Estadisicas</Nav.Link>
            <Nav.Link className="letter" as={Link} to="/prof/ver_citas">Ver Citas</Nav.Link>
            <Nav.Link as={Link} to="/prof/agendar">Agendar hora</Nav.Link>
            <Nav.Item as={Link} to="/inicio">
              <Button className="agenda-button" onClick={handleLogout}>Logout</Button>{' '}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
    <section>
        <Outlet></Outlet>
    </section>
    </>
  );
}

export default NavbarProf