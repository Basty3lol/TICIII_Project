import React from 'react'
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import {useNavigate} from "react-router-dom";



function Rechazado() {
    const navigation = useNavigate();
    Swal.fire({
        title: 'No se ha podido procesar el pago :(',
        text: 'Intentalo nuevamente!',
        icon: 'error',
        confirmButtonText: 'Continuar'
      })
      .then((result) => {
        if (result.value) {
          navigation("/")
        }
      })


  return (
    <div><h1></h1></div>
  )
}



export default Rechazado