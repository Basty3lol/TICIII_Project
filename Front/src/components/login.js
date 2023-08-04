import React, {useState} from 'react'
import Alert from "react-bootstrap/Alert"
import './css-img/LoginForm.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const host = process.env.REACT_APP_HOST_BACKEND

function Login() {
  const navigate = useNavigate();
  const [alert,setAlert]=useState(false);

  const [credentials, setCredentials] = useState({
      email: "",
      password: ""
  })

  const handleChange = (e) =>{
      setCredentials({
          ...credentials,
          [e.target.name]: e.target.value
      })
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      try{
        const response = await axios.post((host+"/api/login"),credentials)
        localStorage.setItem("token",response.data.token)
        navigate("/prof/ver_citas")
      }
      catch(err){
        //console.log("Mostrando alerta")
        setAlert(true)
      }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form-login">
        <div className='form-inner'>
            <h2>Login</h2>
            
            <div className='form-group'>
                <label htmlFor='email'>Correo:</label>
                <input type="email" name="email" id="email" onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Contraseña:</label>
                <input type="password" name="password" id="password" onChange={handleChange} />
            </div>
            {alert && <div><Alert variant='danger'>Correo o contraseña incorrecto.</Alert></div>}
            <input type="submit" value="Login"/>
        </div>
      </form>
    </div>
  );
}

export default Login;